export const menuConfig = [
  {
    name: '课程介绍',
    key: 'ClassIntroduce',
    children: []
  },
  {
    name: '智能助手',
    key: 'ChatBot',
    children: []
  },
  {
    name: 'Fab',
    key: 'FabGPT',
    children: [
      {
        name: '缺陷大模型',
        key: 'issue'
      },
      {
        name: '光刻大模型',
        key: 'lithgraphy'
      },
      {
        name: 'TCAD大模型',
        key: 'tcad'
      },
      {
        name: 'SPICE大模型',
        key: 'spice'
      }
    ]
  }
]