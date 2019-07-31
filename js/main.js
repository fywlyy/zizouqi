import ReadyPage  from './runtime/ready-page'
import BackGround from './runtime/background'
import Checkerboard from './checkerboard/index'
import Hero from './hero/index'
import GameInfo from './runtime/gameinfo'
import Shop from './shop/index'
import DataBus from './databus'
import Util from './base/utils'
import API from '../api/index'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight
const rect         = canvas.getBoundingClientRect()
const dpr          = window.devicePixelRatio || 1

canvas.width  = rect.width * dpr
canvas.height = rect.height * dpr

let ctx      = canvas.getContext('2d')
let databus  = new DataBus()

ctx.scale(dpr, dpr)

// 测试用英雄数组（处理后数据）
// const heroArr = [{
//   HeroSeries: '战士', // 战士（英雄类型）
//   classify: 'behind', // 分类
//   HeroLevelType: 'A',
//   level: 1, // 等级
//   ph: 1000, // 血量
//   ad: 100, // 攻击力
//   status: '0', // 初始化英雄当前状态 （0：等待出战，1：已出战待战斗，2：正在战斗，3：死亡）
//   point: [], // 棋盘坐标
//   buffType: 'shield', // buff类型
//   url: 'images/hero/战士/A/front/main.png', // 图片绝对路径（处理后参数）
//   x: window.innerWidth / 2 - 62.5 / GameGlobal.BASIC_RATIO, // 图片x坐标
//   y: 1175 / GameGlobal.BASIC_RATIO, // 图片y坐标
//   cacheX: window.innerWidth / 2 - 62.5 / GameGlobal.BASIC_RATIO,
//   cacheY: 1175 / GameGlobal.BASIC_RATIO,
// }]

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId         = 0
    // 游戏是否开始
    this.gameStart     = false
    // 是否匹配
    this.hasMatch      = false
    // 点中英雄
    this.touchedHero   = null
    // 对方英雄
    this.enemyHeroArr  = []
    // 是否展示商店
    this.showShop      = false
    // 已有英雄
    this.hearoArr      = []
    // 倒计时时间
    this.times         = 0
    // 准备类型
    this.readyType     = ''
    // 自己是否已准备
    this.hasReadySelf  = false
    // 对方是否已准备
    this.hasReadyEnemy = false
    // 已经开始
    this.hasStart      = false
    // 是否正在对战
    this.isFighting    = false
    // 是否是房主
    this.isHomeowner   = false
    // 英雄栏页数
    this.columnPageNo  = 1
    // 英雄栏每页个数
    this.columnPageSize= 3

    this.init()
  }

  /**
   * 游戏初始化
   */
  init() {
    this.renderReadyPage()
    this.restart()
  }

  /**
   * 重置游戏状态进入下一局
   */
  resetGameInfo() {
    // 该局结束重新初始化
    this.enemyHeroArr = []
    this.hearoArr = []
    this.readyType = ''
    this.hasReadySelf = false
    this.hasReadyEnemy = false
    this.hasStart = false
    this.isFighting = false

    databus.heros = []

    // 等待准备倒计时
    this.readyType = 'waitReady'

    this.countdown(60)
  }

/**
 * 玩家退出重新初始化
 */
  initGameInfo() {
    this.hasMatch = false
    this.enemyHeroArr = []
    this.hearoArr = []
    this.readyType = ''
    this.hasReadySelf = false
    this.hasReadyEnemy = false
    this.hasStart = false
    this.isFighting = false
    this.isHomeowner = false

    databus.heros = []

    GameGlobal.enemyUserInfo = null

    delete GameGlobal.userInfo.user_gold_coin
    delete GameGlobal.userInfo.user_level

    wx.closeSocket() // 关闭通讯
  }

  /**
   * 发送错误日志
   */
  sendLog(err) {
    wx.request({
      url: API.sendLog,
      method: 'POST',
      data: {
        error: err,
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {

      }
    })
  }

  /**
   * 渲染开始界面
   */
  renderReadyPage() {
    this.readyPage = new ReadyPage(ctx)

    this.touchStartHandler = this.touchStartEventHandler.bind(this)
    this.touchMoveHandler = this.touchMoveEventHandler.bind(this)
    this.touchEndHandler = this.touchEndEventHandler.bind(this)
    canvas.addEventListener('touchstart', this.touchStartHandler)
    canvas.addEventListener('touchmove', this.touchMoveHandler)
    canvas.addEventListener('touchend', this.touchEndHandler)
    // 游戏开始按钮
    const { x, y, width, height } = this.readyPage.startBtn

    this.startButton = wx.createUserInfoButton({
      type: 'text',
      text: '',
      style: {
        left: x,
        top: y,
        width,
        height,
      }
    })
    // 授权登录
    this.startButton.onTap((res) => {
      const { nickName, avatarUrl } = res.userInfo;

      GameGlobal.userInfo = {
        user_nick: nickName,
        user_avatar: avatarUrl,
      }

      try {
        this.login()
      } catch(err) {
        this.sendLog(err)
      }
      
      console.log('用户信息：', res.userInfo)
    })
  }

  restart() {
    databus.reset()

    if (this.gameStart) { // 游戏开始页
      this.bg = new BackGround(ctx)
      this.checkerboard = new Checkerboard()
      this.gameInfo = new GameInfo()
      this.shop = new Shop()
      this.heroGenerate(this.hearoArr)
    }

    this.bindLoop = this.loop.bind(this)

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId)

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  login() {
    const { user_nick, user_avatar } = GameGlobal.userInfo
    // 小程序登录
    wx.showLoading({
      title: '登陆中...',
    })
    wx.login({
      success: ({ code }) => {
        if (code) {
          // 发起登录请求
          wx.request({
            url: API.login,
            method: 'POST',
            data: {
              code,
              nick: user_nick,
              avatar: user_avatar
            },
            header: {
              'content-type': 'application/json'
            },
            success: (res) => {
              const { data, code } = res.data
              wx.hideLoading()
              if (code === 8001) {
                wx.showToast({
                  title: '登录失败！',
                  duration: 2000,
                  mask: true
                })
                return
              } else {
                const { token, user_id } = data

                GameGlobal.token = token
                GameGlobal.userId = user_id

                this.gameStart = true
                this.startButton.hide()
                this.restart()
              }
            }
          })
        } else {
          wx.hideLoading()
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }

  /**
   * 开始倒计时
   */
  countdown(initTimes) {
    clearInterval(this.timer)

    this.times = initTimes
    this.timer = setInterval(() => {
      this.times--
      // 倒计时结束
      if (!this.times) {
        clearInterval(this.timer)

        if (this.readyType === 'waitReady') { // 准备状态倒计时结束强制进入待战斗倒计时
          // 战斗准备上报
          this.hasReadySelf = true
          wx.sendSocketMessage({
            data: JSON.stringify({
              command: "ready",
              data: null
            })
          })

          this.readyType = 'waitFighting'
          this.showShop = false
          this.countdown(5)
        } else { // 待战斗状态倒计时结束
          // 游戏开始上报
          wx.sendSocketMessage({
            data: JSON.stringify({
              command: "start",
              data: null
            })
          })

          this.readyType = ''
        }
      }
    }, 1000)
  }

  /**
   * 连接到游戏房间
   */
  connectRoom(roomNumber, cb) {
    wx.connectSocket({
      url: `${API.connectRoom}?token=${GameGlobal.token}&room_number=${roomNumber}`,
      header: {
        'content-type': 'application/json'
      },
      method: "GET"
    })
    wx.onSocketOpen(() => {
      console.log('openning...')
    })
    wx.onSocketMessage((res) => {
      const data = JSON.parse(res.data)
      const { result, type } = data

      switch(type) {
        case 'joined': // 加入游戏
          if (result.length === 1 && result[0].user_id === GameGlobal.userId) {
            this.isHomeowner = true
            console.log('your are homerowner!')
          }

          result.map((item) => {
            if (item.user_id !== GameGlobal.userId) {
              GameGlobal.enemyUserInfo = item
              cb && cb()
              wx.hideLoading()
              wx.showToast({
                title: '匹配成功！',
                duration: 2000,
                mask: true
              })

              // 等待准备倒计时
              this.readyType = 'waitReady'

              this.countdown(60)

            } else {
              GameGlobal.userInfo = item;
            }
          })
          break
        case 'buy': // 对方购买英雄
          let hearoData = {}
          const length = this.shop.shopHeros.length

          for (let i = 0; i < length; i++) {
            if (this.shop.shopHeros[i].Id === result.role_id) {
              const { classify, url, x, y, HeroSeries, HeroLevelType, LifeNumber, HeroLevel, Id } = this.shop.shopHeros[i]
              hearoData = {
                status: '0', // 待出战
                classify,
                url,
                x: 0, // 重置x坐标
                y: 0, // 重置y坐标
                HeroSeries,
                HeroLevelType,
                LifeNumber,
                HeroLevel,
                role_id: Id,
                isEnemy: true,
              }
              break
            }
          }

          this.enemyHeroArr.push(hearoData)
          break
        case 'ready': // 对方准备通知
          this.hasReadyEnemy = true
          wx.showToast({
            title: `玩家${GameGlobal.enemyUserInfo.user_nick}已准备好`,
            duration: 2000,
            icon: 'none'
          })

          if (this.hasReadySelf) { // 自己已准备
            // 开战倒计时测试
            this.readyType = 'waitFighting'
            this.showShop = false

            this.countdown(5)
          }
          break
        case 'position': // 对方英雄位置
          if (result.user_id !== GameGlobal.enemyUserInfo.user_id || !result.position_data) {
            return;
          }

          const positionData = JSON.parse(result.position_data);

          positionData.map((item) => {
            const roleId = Object.keys(item)[0]
            let point  = item[roleId].split(',')

            this.enemyHeroArr.map((nextItem) => {
              if (nextItem.role_id === parseInt(roleId)) {
                let coord = {}

                if (this.isHomeowner) {
                  coord = this.checkerboard.getPointCoord([parseInt(point[0]), parseInt(point[1])])
                } else {
                  coord = this.checkerboard.getPointCoord([5- parseInt(point[0]), 7- parseInt(point[1])])
                }

                nextItem.x = coord.x
                nextItem.y = coord.y
                nextItem.status = '1'
              }
            })
          })
          break
        case 'ready_cancel': // 对方取消准备
          wx.showToast({
            title: `玩家${GameGlobal.enemyUserInfo.user_nick}已取消准备`,
            duration: 2000,
            icon: 'none'
          })

          this.hasReadyEnemy = false
          this.hasReadySelf = false
          this.readyType = 'waitReady'

          this.countdown(60)

          break
        case 'start': // 游戏开始通知
          if (this.hasStart) {
            return
          }

          this.hasStart = true
          this.heroGenerate(this.enemyHeroArr)

          // 开始攻击
          databus.heros.map((item) => {
            if (item.status === '1') {
              item.beginningWar()
              item.initAttackAnimation() // 初始化攻击动画
            }
          })

          // 攻击上报
          wx.sendSocketMessage({
            data: JSON.stringify({
              command: "attack",
              data: null
            })
          })
          break
        case 'move': // 英雄移动通知
          const movePoint = result.position.split(',')
          let desCoord = {}

          if (this.isHomeowner) {
            desCoord = this.checkerboard.getPointCoord([parseInt(movePoint[0]), parseInt(movePoint[1])])
          } else {
            desCoord = this.checkerboard.getPointCoord([5 - parseInt(movePoint[0]), 7 - parseInt(movePoint[1])])
          }

          if (result.user_id === GameGlobal.userInfo.user_id) {
            databus.heros.map((item) => {
              if (!item.isEnemy && item.status === '2' && item.roleId === result.role_id) {
                item.moving(desCoord, 1000)
              }
            })
          } else {
            databus.heros.map((item) => {
              if (item.isEnemy && item.status === '2' && item.roleId === result.role_id) {
                item.moving(desCoord, 1000) // 移动动画
              }
            })
          }
          break
        case 'attack_done': // 攻击结束通知
          if (result.user_id === GameGlobal.userInfo.user_id) {
            setTimeout(() => {
              let deathAll = true
              databus.heros.map((item, index) => {
                if (!item.isEnemy && item.status === '2' && !item.isMoving) {
                  // 继续攻击
                  item.playAnimation(0, false, 200)
                }

                if (!item.isEnemy && item.status === '2' && item.currLife > 0) {
                  deathAll = false
                }
              })
              if (deathAll) { // 游戏结束或者角色都死亡
                return
              }
              wx.sendSocketMessage({
                data: JSON.stringify({
                  command: "attack",
                  data: null
                })
              })
            }, 1200)
          } else {
            // 继续攻击
            databus.heros.map((item) => {
              if (item.isEnemy && item.status === '2' && !item.isMoving) {
                item.playAnimation(0, false, 200) // 播放动画
              }
            })
          }
          break
        case 'attacked': // 角色被攻击通知
          // 被攻击
          databus.heros.map((item) => {
            if (item.status === '2') {
              if (item.isEnemy && result.user_id === GameGlobal.enemyUserInfo.user_id && result.role_id === item.roleId) {
                if (result.loose_blood <= 0) { // 角色死亡
                  item.status = '3'
                  return
                }

                item.buffType = 'attacked'
                item.initBuffAnimation('attacked', 0, false)
                item.currLife = result.loose_blood;
              } else if (!item.isEnemy && result.user_id === GameGlobal.userInfo.user_id && result.role_id === item.roleId) {
                if (result.loose_blood <= 0) { // 角色死亡
                  item.status = '3'
                  return
                }

                item.buffType = 'attacked'
                item.initBuffAnimation('attacked', 0, false)
                item.currLife = result.loose_blood;
              }
            }
          })
          break
        case 'win': // 胜利通知
          if (result.user_id === GameGlobal.userInfo.user_id) {
            wx.showToast({
              title: '胜利！',
              duration: 2000,
              icon: 'none',
              complete: () => {
                setTimeout(() => {
                  this.resetGameInfo()
                }, 1500)
              }
            })

            GameGlobal.userInfo.user_gold_coin = result.gold_coin
          }
          break
        case 'lose': // 失败通知
          if (result.user_id === GameGlobal.userInfo.user_id) {
            wx.showToast({
              title: '失败！',
              duration: 2000,
              icon: 'none',
              complete: () => {
                setTimeout(() => {
                  this.resetGameInfo()
                }, 1500)
              }
            })

            GameGlobal.userInfo.user_gold_coin = result.gold_coin
          }
          break
        case 'left': // 下线通知
          if (result.user_id !== GameGlobal.userInfo.user_id) {
            wx.showToast({
              title: '对方已下线！',
              duration: 2000,
              icon: 'none',
            })

            this.initGameInfo() // 初始化
          }
          break
        default:
          if (result && result.code !== 8000 && result.msg) {
            wx.showToast({
              title: result.msg,
              duration: 2000,
              icon: 'none'
            })
          }
          break
      }
    })
    wx.onSocketError((error) => {
      console.log('socketError', error)
    })
  }

  /**
   * 匹配玩家
   */
  matchingPlayer(cb) {
    wx.showLoading({
      title: '匹配中...',
    })

    wx.request({
      url: API.joinAuto,
      method: 'POST',
      data: {
        token: GameGlobal.token
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        const { code, data } = res.data
        if (code === 8000) {
          console.log('房间号：', data.room_number)
          GameGlobal.roomNumber = data.room_number
          this.connectRoom(data.room_number, cb)
        }
      }
    })
  }

  /**
   * 点中英雄判断（未开始战斗）
   */
  touchedHeroDetection(touchX, touchY) {
    databus.heros.map((item) => {
      if (!this.isFighting && touchX > item.x && touchX < item.x + item.width && touchY > item.y && touchY < item.y + item.height) {
        item.dragging = true
        this.touchedHero = item
      }
    })
  }
  
  /**
   * 点中商店英雄
   */
  touchedShopHeroDetection(touchX, touchY) {
    this.shop.showShopHeros.map((item) => {
      const { classify, url, HeroSeries, HeroLevelType, Id, GoldCoin, LifeNumber, HeroLevel, } = item
      if (touchX > item.x && touchX < item.x + item.width && touchY > item.y && touchY < item.y + item.height) { // 点中商店英雄购买
        
        if (!GameGlobal.userInfo.user_gold_coin || GoldCoin > GameGlobal.userInfo.user_gold_coin) {
          wx.showToast({
            title: '您的金币不足！',
            duration: 2000,
            icon: 'none'
          })

          return
        }
        
        // 购买英雄上报
        wx.sendSocketMessage({
          data: JSON.stringify({
            command: "buy",
            data: Id
          })
        })

        let hearoData = {}

        GameGlobal.userInfo.user_gold_coin -= GoldCoin
        
        hearoData = {
          status: '0', // 等待出战
          classify: 'behind',
          url,
          y: 1175 / GameGlobal.BASIC_RATIO,
          HeroSeries,
          HeroLevelType,
          LifeNumber,
          HeroLevel,
          role_id: Id,
          cacheY: 1175 / GameGlobal.BASIC_RATIO,
        }

        this.hearoArr.push(hearoData)
        this.heroGenerate([hearoData])
      }
    })
  }

  /**
   * 触摸事件处理逻辑
   */
  touchStartEventHandler(e) {
    e.preventDefault()

    let touchX = e.touches[0].clientX
    let touchY = e.touches[0].clientY



    if (this.showShop) { // 显示商店时判断是否点中商店英雄
      this.touchedShopHeroDetection(touchX, touchY)
      return
    }
    
    if (!this.hasReadySelf && !this.isFighting) { // 在未准备、未开战、没显示商店时判断是否点中英雄
      this.touchedHeroDetection(touchX, touchY)
    }
  }

  /**
   * 英雄拖拽
   */
  touchMoveEventHandler(e) {
    e.preventDefault()

    const touchX = e.touches[0].clientX
    const touchY = e.touches[0].clientY

    if (this.touchedHero) {
      const { width, height } = this.touchedHero
      const dragY = this.checkerboard.y + this.checkerboard.checkerHeight * this.checkerboard.rowNum / 2

      // x边界检测
      if (touchX - width / 2 < 0) {
        this.touchedHero.x = 0
      } else if (touchX + width / 2 > screenWidth) {
        this.touchedHero.x = screenWidth - width
      } else {
        this.touchedHero.x = touchX - width / 2
      }

      // y边界检测
      if (touchY + height / 2 > screenHeight) {
        this.touchedHero.y = screenHeight - height
      } else if (touchY - height / 2 < dragY) {
        this.touchedHero.y = dragY
      } else {
        this.touchedHero.y = touchY - height / 2
      }

      this.checkerboard.dragDetection(this.touchedHero)
    }
  }

  /**
   * 触摸结束
   */
  touchEndEventHandler(e) {
    e.preventDefault()

    const touchX = e.changedTouches[0].clientX
    const touchY = e.changedTouches[0].clientY

    if (this.gameStart) { // 开始游戏
      const { lightPoint } = this.checkerboard
      const { btnShop, btnMatch, btnReady }    = this.gameInfo

      if (this.touchedHero && lightPoint.length) { // 判断是否将英雄拖拽到了棋格上
        this.touchedHero.x = lightPoint[0] - this.touchedHero.width / 2
        this.touchedHero.y = lightPoint[1] - this.touchedHero.height / 2

        this.touchedHero.cacheX = this.touchedHero.x
        this.touchedHero.cacheY = this.touchedHero.y

        this.touchedHero.chessX = lightPoint[2]
        this.touchedHero.chessY = lightPoint[3]

        if (this.touchedHero.status === '0') {
          // 英雄状态变为已出战待战斗状态
          this.touchedHero.status = '1'

          const url = `images/hero/${this.touchedHero.series}/${this.touchedHero.levelType}/behind/main.png`
          const img = new Image()

          img.src = url

          this.touchedHero.img = img
        }

        const waitingHeroPositions = []

        databus.heros.map((item) => {
          if (item.status === '1') {
            if (this.isHomeowner) {
              waitingHeroPositions.push({
                [item.roleId]: `${item.chessX},${item.chessY}`, // 坐标转换
              })
            } else {
              waitingHeroPositions.push({
                [item.roleId]: `${5 - item.chessX},${7 - item.chessY}`, // 坐标转换
              })
            }

          }
        })

        // 上报英雄位置
        wx.sendSocketMessage({
          data: JSON.stringify({
            command: "position",
            data: waitingHeroPositions
          })
        })

        // 重置点中英雄及棋格点亮点
        this.touchedHero = null
        this.checkerboard.lightPoint = []
      } else if (this.touchedHero) { // 未拖拽到棋格上，回退到之前位置
        this.touchedHero.x = this.touchedHero.cacheX
        this.touchedHero.y = this.touchedHero.cacheY
        // 重置点中英雄及棋格点亮点
        this.touchedHero = null
        this.checkerboard.lightPoint = []
      }

      if (
        !this.hasReadySelf &&
        !this.isFighting &&
        btnShop &&
        touchX > btnShop.startX &&
        touchX < btnShop.endX &&
        touchY > btnShop.startY &&
        touchY < btnShop.endY) { // 未准备也未战斗时判断是否点中商店
        this.showShop = !this.showShop
      }

      if (
        !this.hasMatch &&
        btnMatch &&
        touchX >= btnMatch.startX &&
        touchX <= btnMatch.endX &&
        touchY >= btnMatch.startY &&
        touchY <= btnMatch.endY) { // 判断未匹配时是否点中匹配
        this.matchingPlayer(() => {
          this.hasMatch = true
        })
      }

      if (
        !this.showShop &&
        this.hasMatch &&
        !this.isFighting &&
        btnReady &&
        touchX >= btnReady.startX &&
        touchX <= btnReady.endX &&
        touchY >= btnReady.startY &&
        touchY <= btnReady.endY) { // 判断已匹配但未战斗时是否点中准备或取消准备按钮
        if (this.readyType === 'waitReady') { // 点击准备
          // 战斗准备上报
          this.hasReadySelf = true
          wx.sendSocketMessage({
            data: JSON.stringify({
              command: "ready",
              data: null
            })
          })

          // 准备倒计时测试(判断对方是否已准备)
          this.readyType = 'waitFighting'
          this.countdown(this.hasReadyEnemy ? 5 : this.times + 5)

          databus.heros.map((item) => {
            if (item.status === '1') {
              item.waitingWar()
            }
          })
        } else { // 点击取消准备
          // 上报取消准备
          wx.sendSocketMessage({
            data: JSON.stringify({
              command: "ready_cancel",
              data: null
            })
          })

          this.hasReadySelf = false
          this.hasReadyEnemy = false
          this.readyType = 'waitReady'
          this.countdown(60)
        }
      }

      if (
        this.showShop &&
        this.shop.preBtn &&
        touchX >= this.shop.preBtn.startX &&
        touchX <= this.shop.preBtn.endX &&
        touchY >= this.shop.preBtn.startY &&
        touchY <= this.shop.preBtn.endY) { // 判断是否点中商店上一页按钮
        this.shop.btnClick('pre')
      }

      if (
        this.showShop &&
        this.shop.nextBtn &&
        touchX >= this.shop.nextBtn.startX &&
        touchX <= this.shop.nextBtn.endX &&
        touchY >= this.shop.nextBtn.startY &&
        touchY <= this.shop.nextBtn.endY) { // 判断是否点中商店下一页按钮
        this.shop.btnClick('next')
      }

      if (
        this.showShop &&
        this.shop.closeBtn &&
        touchX >= this.shop.closeBtn.startX &&
        touchX <= this.shop.closeBtn.endX &&
        touchY >= this.shop.closeBtn.startY &&
        touchY <= this.shop.closeBtn.endY) { // 判断是否点中商店关闭按钮
        this.showShop = false
      }

      if (
        this.gameInfo.preBtn &&
        touchX >= this.gameInfo.preBtn.startX &&
        touchX <= this.gameInfo.preBtn.endX &&
        touchY >= this.gameInfo.preBtn.startY &&
        touchY <= this.gameInfo.preBtn.endY) { // 判断是否点中英雄栏上一页按钮
        this.columnPageNo--
      }

      if (
        this.gameInfo.nextBtn &&
        touchX >= this.gameInfo.nextBtn.startX &&
        touchX <= this.gameInfo.nextBtn.endX &&
        touchY >= this.gameInfo.nextBtn.startY &&
        touchY <= this.gameInfo.nextBtn.endY) { // 判断是否点中英雄栏下一页按钮
        this.columnPageNo++
      }
    }
  }

  /**
   * 初始化循环生成各种类型的英雄
   */
  heroGenerate(heroArr) {
    heroArr.map((heroProps) => {
      let hero = databus.pool.getItemByClass('hero', Hero, heroProps)

      databus.heros.push(hero)
    })
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (this.gameStart) { // 游戏开始
      this.bg.render(ctx)
      this.checkerboard.renderChecker(ctx)
      this.gameInfo.renderUserInfo(ctx, this.readyType)
      this.gameInfo.renderHeroColumn(ctx)

      if (this.hasMatch) { // 已匹配
        this.checkerboard.renderLigthChecker(ctx)

        if (this.times) {
          this.gameInfo.renderCountdown(ctx, this.readyType, this.times)
        }

        this.gameInfo.renderShopBtn(ctx)

        const { columnPageNo, columnPageSize } = this
        let waitingHearoIndex = 0

        databus.heros.forEach((item) => {
          if ((item.isEnemy && item.status === '0') || item.status === '3') {
            return
          }

          if (item.status === '0') {
            if (waitingHearoIndex >= (columnPageNo - 1) * columnPageSize && waitingHearoIndex < columnPageNo * columnPageSize) {
              if (!item.dragging) {
                item.x = window.innerWidth / 4 - 93.75 / GameGlobal.BASIC_RATIO + 218.75 / GameGlobal.BASIC_RATIO * (waitingHearoIndex % 3)
                item.cacheX = item.x
              }
              
              item.drawToCanvas(ctx)
            }
            waitingHearoIndex++
          } else {
            if (item.status === '1' || item.status === '2') { // 出战显示等级血量
              item.renderLifeLevel(ctx, item)
            }

            item.drawToCanvas(ctx)
          }
        })

        this.gameInfo.renderBtn(ctx, columnPageNo, columnPageSize, waitingHearoIndex)

        databus.animations.forEach((ani) => {
          if (ani.isPlaying) {
            ani.aniRender(ctx)
          }
          if (ani.buffType && ani.status === '2') { // 战斗状态显示buff效果
            ani.renderBuff(ctx)
          }
        })

        // 商店为上一层画布，需最后渲染
        if (this.showShop) {
          this.shop.drawToCanvas(ctx)
          this.shop.renderShopHero(ctx)
          this.shop.renderBtn(ctx)
          this.shop.renderCloseBtn(ctx)
        }
      } else { // 未匹配
        this.gameInfo.renderMatchBtn(ctx)
      }
    } else { // 游戏未开始
      this.readyPage.render(ctx)
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if ( databus.gameOver )
      return

    // this.collisionDetection()

    if ( databus.frame % 20 === 0 ) {
      // this.player.shoot()
      // this.music.playShoot()
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    if (this.gameStart) {
      this.update()
    }
    
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
