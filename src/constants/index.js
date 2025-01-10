export const MESSAGE_TYPE = {
  BOT: 'bot',
  USER: 'user'
}

export const MESSAGE_AVATAR = {
  bot: require('../assets/bot.png'),
  user: require('../assets/logo.png')
}

// 临时机器人信息
export const botInfo = {
  content: '思考中...',
  sender: MESSAGE_TYPE.BOT,
  loading: true,
};