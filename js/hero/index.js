import Animation from '../base/animation'

const basicRatio = GameGlobal.BASIC_RATIO

// 玩家相关常量设置
const HERO_WIDTH   = 110 / basicRatio
const HERO_HEIGHT  = 110 / basicRatio

const __ = {
  props: Symbol('props'),
  timer: Symbol('timer'),
  moveTimer: Symbol('moveTimer'),
}

export default class Hero extends Animation {
  constructor(props) {
    super(props.url, HERO_WIDTH, HERO_HEIGHT)

    // 英雄属性
    this[__.props] = props
    this.x         = props.x
    this.y         = props.y
    this.cacheX    = props.x
    this.cacheY    = props.y
    this.status    = props.status
    this.buffType  = props.buffType
    this.roleId    = props.role_id
    this.isEnemy   = props.isEnemy
    this.series    = props.HeroSeries
    this.levelType = props.HeroLevelType
    this.level     = props.HeroLevel
    this.allLife   = props.LifeNumber
    this.currLife  = props.LifeNumber
    // 移动中
    this.isMoving  = false
    // buff图片集合
    this.buffImgList = []
    // 当前播放的buff帧
    this.buffIndex = 0
  }

  /**
   * 等待作战放大缩小动画
   */
  waitingWar(interval = this.interval) {
    let index   = 0
    let isZoom  = true
    const times = 100
    const addW  = HERO_WIDTH / 600
    const addH  = HERO_HEIGHT / 600

    this[__.timer] = setInterval(() => {
      if (isZoom) {
        index++
        this.width  += addW
        this.height += addH
        this.x      -= addW / 2
        this.y      -= addH / 2
        if (index === times) {
          isZoom = false
        }
      } else {
        index--
        this.width  -= addW
        this.height -= addH
        this.x      += addW / 2
        this.y      += addH / 2
        if (index === 0) {
          isZoom = true
        }
      }
    }, interval)
  }

  /**
   * 战争开始
   */
  beginningWar() {
    clearInterval(this[__.timer])
    this.width  = HERO_WIDTH
    this.height = HERO_HEIGHT
    this.x      = this.cacheX
    this.y      = this.cacheY
    this.status = '2'
  }

  /**
   * 预定义攻击的帧动画
   */
  initAttackAnimation() {
    let frames = []

    const HERO_IMG_PREFIX = `images/hero/${this[__.props].HeroSeries}/${this[__.props].HeroLevelType}/${this[__.props].classify}/attack/` 
    const HERO_FRAME_COUNT = 4

    for ( let i = 0; i < HERO_FRAME_COUNT; i++ ) {
      frames.push(HERO_IMG_PREFIX + (i + 1) + '.png')
    }
    this.imgList = [] // 重置动画帧图片集合
    this.initFrames(frames)
  }

  /**
   * 移动帧动画
   */
  moving(desCoord, timeOut = this.timeOut, timeOutCb = () => { }, interval = this.interval) {
    // 移动状态
    this.isMoving = true

    let moveTimes = parseInt(timeOut / interval)
    const { x, y } = desCoord
    const everyTimeMoveX = (x - this.x) / moveTimes
    const everyTimeMoveY = (y - this.y) / moveTimes


    this[__.moveTimer] = setInterval(() => {
      moveTimes--;

      if (!moveTimes) {
        this.x = x
        this.y = y
        clearInterval(this[__.moveTimer])
        timeOutCb()
        this.isMoving = false
      } else {
        this.x += everyTimeMoveX
        this.y += everyTimeMoveY
      }
    }, interval)
  }

  /**
   * 初始化buff的帧动画
   */
  initBuffAnimation(type, index = 0, loop = false, interval = this.interval) {
    let BUFF_IMG_PREFIX  = ''
    let BUFF_IMG_COUNT   = 0

    BUFF_IMG_PREFIX = `images/buff/${type}/`
    BUFF_IMG_COUNT = 10

    // 清空buff图片集合
    this.buffImgList = []
    this.buffIndex   = index

    for ( let i = 0; i < BUFF_IMG_COUNT; i++ ) {
      let img = new Image()
      img.src = BUFF_IMG_PREFIX + (i + 1) + '.png'

      this.buffImgList.push(img)
    }

    const count = this.buffImgList.length

    if ( interval > 0 && count ) {
      this[__.timer] = setInterval(() => {
        this.buffIndex++

        if ( this.buffIndex > count - 1 ) {
          if (loop) {
            this.buffIndex = 0
          } else {
            this.buffIndex--
            clearInterval(this[__.timer])
          }
        }
      }, interval)
    }
  }

  renderBuff(ctx) {
    ctx.drawImage(
      this.buffImgList[this.buffIndex],
      this.x,
      this.y,
      this.width,
      this.height,
    )
  }

  /**
   * 清除buff
   */
  clearBuff() {
    clearInterval(this[__.timer])
  }

  renderLifeLevel (ctx, hearoData) {
    // 血量底色
    ctx.fillStyle = "#3a3a3a";
    ctx.fillRect(
      this.x + 20 / basicRatio,
      this.y,
      this.width - 50 / basicRatio,
      10 / basicRatio,
    );
    // 血量
    ctx.fillStyle = "#77fc0d";
    ctx.fillRect(
      this.x + 20 / basicRatio,
      this.y,
      (this.width - 50 / basicRatio) * (hearoData.currLife / hearoData.allLife),
      10 / basicRatio,
    );
    // 等级底色
    ctx.fillStyle = "#ccc";
    ctx.fillRect(
      this.x + this.width - 30 / basicRatio,
      this.y - 5 / basicRatio,
      20 / basicRatio,
      20 / basicRatio,
    );
    // 等级
    ctx.fillStyle = "#fff"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.fillText(
      hearoData.level,
      this.x + this.width - 20 / basicRatio,
      this.y + 5 / basicRatio,
    )
  }
}