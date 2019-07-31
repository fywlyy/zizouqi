const baseUrl = 'https://appletgame.zxinol.com/v1'
const wSUrl   = 'wss://appletgame.zxinol.com/v1'

const api = {
  login: `${baseUrl}/user/login/wx_app`, // 登录
  joinAuto: `${baseUrl}/game/room/join_auto`, // 自动加入房间
  connectRoom: `${wSUrl}/game/room/connect`, // 连接到房间
  roleList: `${baseUrl}/game/role/list`, // 角色列表
  roleBuy: `${baseUrl}/game/role/buy`, // 角色购买
  sendLog: `${baseUrl}/v1/log`, // 日志
}

module.exports = api