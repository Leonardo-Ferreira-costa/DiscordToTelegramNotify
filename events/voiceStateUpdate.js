const { Events } = require('discord.js')

const userCooldowns = new Map()

const COOLDOWN_DURATION = 10000

module.exports = {
  name: Events.VoiceStateUpdate,
  execute(oldState, newState, telegramBot, chatId) {
    try {
      const userId = newState.member.id
      const currentTime = Date.now()

      if (userCooldowns.has(userId) && currentTime - userCooldowns.get(userId) < COOLDOWN_DURATION) {
        return
      }

      userCooldowns.set(userId, currentTime)

      if (!oldState.channel && newState.channel) {
        const user = newState.member.displayName
        const channelName = newState.channel.name
        const guildName = newState.guild.name

        const message = `${user} just entered the '${channelName}' voice channel in ${guildName}`
        telegramBot.sendMessage(chatId, message)
      } else if (oldState.channel && !newState.channel) {
        const user = oldState.member.displayName
        const channelName = oldState.channel.name
        const guildName = oldState.guild.name

        const message = `${user} just left the '${channelName}' voice channel in ${guildName}`
        telegramBot.sendMessage(chatId, message)
      }
    } catch (e) {
      console.log(e)
    }
  },
}