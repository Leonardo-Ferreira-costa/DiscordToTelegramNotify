const fs = require('node:fs')
const path = require('node:path')

const { Client, GatewayIntentBits } = require('discord.js')
const TelegramBot = require('node-telegram-bot-api')

const { discordToken, telegramToken, chatId } = require('./config.json')

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
})

const telegramBot = new TelegramBot(telegramToken, { polling: true })
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file)
  const event = require(filePath)
  if (event.once) {
    client.once(event.name, (...args) =>
      event.execute(...args, telegramBot, chatId)
    )
  } else {
    client.on(event.name, (...args) =>
      event.execute(...args, telegramBot, chatId)
    )
  }
}

client.login(discordToken)