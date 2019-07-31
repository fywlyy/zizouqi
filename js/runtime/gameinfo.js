import Util from '../base/utils'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight
const basicRatio   = GameGlobal.BASIC_RATIO

// 头像框相关常量
const PHOTO_IMG_SRC = 'images/photo.png'
const PHOTO_WIDTH   = 92 / basicRatio
const PHOTO_HEIGHT  = 92 / basicRatio

// 用户头像相关常量设置
const AVATAR_SELEF_X  = 70 / basicRatio
const AVATAR_SELEF_Y  = 46 / basicRatio
const AVATAR_ENEMY_X  = 460 / basicRatio
const AVATAR_ENEMY_Y  = 46 / basicRatio
const AVATAR_WIDTH    = 72 / basicRatio
const AVATAR_HEIGHT   = 72 / basicRatio

// 用户昵称相关常量设置
const NICKNAME_MAX_WIDTH = 150 / basicRatio
const NICKNAME_SELEF_X   = 106 / basicRatio
const NICKNAME_ENEMY_X   = 496 / basicRatio
const NICKNAME_Y         = 156 / basicRatio

// 金币图片相关常量设置
const GOLD_IMG_SRC    = 'images/gold.png'
const GOLD_IMG_X      = 180 / basicRatio
const GOLD_IMG_Y      = 32 / basicRatio
const GOLD_IMG_WIDTH  = 46 / basicRatio
const GOLD_IMG_HEIGHT = 47 / basicRatio

// 等级图片相关常量设置
const GRADE_IMG_SRC    = 'images/grade.png'
const GRADE_IMG_X      = 180 / basicRatio
const GRADE_IMG_Y      = 92 / basicRatio
const GRADE_IMG_WIDTH  = 44 / basicRatio
const GRADE_IMG_HEIGHT = 45 / basicRatio

// 匹配按钮相关常量设置
const MATCHBTN_IMG_SRC = 'images/match.png'
const MATCHBTN_X       = 245 / basicRatio
const MATCHBTN_Y       = 500 / basicRatio
const MATCHBTN_WIDTH   = 255 / basicRatio
const MATCHBTN_HEIGHT  = 93 / basicRatio

// 英雄栏相关常量设置
const COLUMN_IMG_SRC    = 'images/column.png'
const COLUMN_IMG_WIDTH  = 750 / basicRatio
const COLUMN_IMG_HEIGHT = 210 / basicRatio

// 商店入口相关常量设置
const SHOP_BTN_IMG_SRC    = 'images/shop-btn.png'
const SHOP_BTN_IMG_X      = 18 / basicRatio
const SHOP_BTN_IMG_Y      = 1080 / basicRatio
const SHOP_BTN_IMG_WIDTH  = 105 / basicRatio
const SHOP_BTN_IMG_HEIGHT = 95 / basicRatio

// VS图片相关常量设置
const VS_IMG_SRC    = 'images/vs.png'
const VS_IMG_X      = 330 / basicRatio
const VS_IMG_Y      = 45 / basicRatio
const VS_IMG_WIDTH  = 70 / basicRatio
const VS_IMG_HEIGHT = 72 / basicRatio

// 准备图片相关常量设置
const READY_IMG_SRC    = 'images/ready.png'
const READY_IMG_X      = 240 / basicRatio
const READY_IMG_Y      = 210 / basicRatio
const READY_IMG_WIDTH  = 275 / basicRatio
const READY_IMG_HEIGHT = 323 / basicRatio

// 准备、取消准备按钮图片相关常量设置
const READY_BTN_IMG_SRC    = 'images/ready-btn.png'
const CANCEL_BTN_IMG_SRC   = 'images/cancel-btn.png'
const READY_BTN_IMG_X      = 295 / basicRatio
const READY_BTN_IMG_Y      = 420 / basicRatio
const READY_BTN_IMG_WIDTH  = 161 / basicRatio
const READY_BTN_IMG_HEIGHT = 87 / basicRatio

// 上一页按钮相关常量设置
const PRE_BTN_IMG_SRC = 'images/pre-btn.png'
const PRE_BTN_IMG_X = 0
const PRE_BTN_IMG_Y = 1200 / basicRatio
const PRE_BTN_IMG_WIDTH = 72 / basicRatio
const PRE_BTN_IMG_HEIGHT = 91 / basicRatio

// 下一页按钮相关常量设置
const NEXT_BTN_IMG_SRC = 'images/next-btn.png'
const NEXT_BTN_IMG_X = 674 / basicRatio
const NEXT_BTN_IMG_Y = 1200 / basicRatio
const NEXT_BTN_IMG_WIDTH = 76 / basicRatio
const NEXT_BTN_IMG_HEIGHT = 91 / basicRatio

export default class GameInfo {
  constructor() {
    // 自己头像
    this.avatarSelefImg = null

    // 对方头像
    this.avatarEnemyImg = null

    // 头像框
    this.photoSelefImg = new Image()
    this.photoSelefImg.src = PHOTO_IMG_SRC

    // 金币图片
    this.goldImg = new Image()
    this.goldImg.src = GOLD_IMG_SRC

    // 等级图片
    this.gradeImg = new Image()
    this.gradeImg.src = GRADE_IMG_SRC

    // 匹配按钮
    this.matchImg  = new Image()
    this.matchImg.src = MATCHBTN_IMG_SRC

    // 英雄栏
    this.columnImg = new Image()
    this.columnImg.src = COLUMN_IMG_SRC

    // 商店入口
    this.shopBtnImg = new Image()
    this.shopBtnImg.src = SHOP_BTN_IMG_SRC

    // VS图片
    this.vsImg = new Image()
    this.vsImg.src = VS_IMG_SRC

    // 准备图片
    this.readyImg = new Image()
    this.readyImg.src = READY_IMG_SRC

    // 准备按钮
    this.readyBtnImg = new Image()
    this.readyBtnImg.src = READY_BTN_IMG_SRC

    // 取消准备按钮
    this.cancelBtnImg = new Image()
    this.cancelBtnImg.src = CANCEL_BTN_IMG_SRC

    // 上一页按钮
    this.preBtnImg = new Image()
    this.preBtnImg.src = PRE_BTN_IMG_SRC

    // 下一页按钮
    this.nextBtnImg = new Image()
    this.nextBtnImg.src = NEXT_BTN_IMG_SRC
  }

  /**
   * 用户信息渲染
   */
  renderUserInfo(ctx, readyType) {
    if (!GameGlobal.userInfo) {
      return;
    }

    if (!this.avatarSelefImg) {
      this.avatarSelefImg     = new Image()
      this.avatarSelefImg.src = GameGlobal.userInfo.user_avatar
    }

    // 绘制用户自己头像
    ctx.drawImage(
      this.avatarSelefImg,
      AVATAR_SELEF_X,
      AVATAR_SELEF_Y,
      AVATAR_WIDTH,
      AVATAR_HEIGHT,
    )

    // 绘制用户自己头像框
    ctx.drawImage(
      this.photoSelefImg,
      60 / basicRatio,
      35 / basicRatio,
      PHOTO_WIDTH,
      PHOTO_HEIGHT,
    )

    // 绘制用户自己昵称
    ctx.fillStyle    = "#fff"
    ctx.font         = "bold 15px Arial"
    ctx.textAlign    = "center"
    ctx.textBaseline = "middle"

    ctx.fillText(
      GameGlobal.userInfo.user_nick,
      NICKNAME_SELEF_X,
      NICKNAME_Y
    )

    if (GameGlobal.userInfo.user_level) {
      // 绘制金币图标
      ctx.drawImage(
        this.goldImg,
        GOLD_IMG_X,
        GOLD_IMG_Y,
        GOLD_IMG_WIDTH,
        GOLD_IMG_HEIGHT,
      )

      // 绘制金币数
      ctx.fillStyle = "#fff"
      ctx.font = "14px Arial"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"

      ctx.fillText(
        GameGlobal.userInfo.user_gold_coin,
        242 / basicRatio,
        60 / basicRatio
      )

      // 绘制等级图标
      ctx.drawImage(
        this.gradeImg,
        GRADE_IMG_X,
        GRADE_IMG_Y,
        GRADE_IMG_WIDTH,
        GRADE_IMG_HEIGHT,
      )

      // 绘制等级数
      ctx.fillStyle = "#fff"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"

      ctx.fillText(
        `LV.${GameGlobal.userInfo.user_level}`,
        245 / basicRatio,
        116 / basicRatio
      )
    }

    if (GameGlobal.enemyUserInfo) {
      if (!this.avatarEnemyImg) {
        this.avatarEnemyImg = new Image()
        this.avatarEnemyImg.src = GameGlobal.enemyUserInfo.user_avatar
      }

      // 绘制对方头像
      ctx.drawImage(
        this.avatarEnemyImg,
        AVATAR_ENEMY_X,
        AVATAR_ENEMY_Y,
        AVATAR_WIDTH,
        AVATAR_HEIGHT,
      )

      // 绘制对方头像框
      ctx.drawImage(
        this.photoSelefImg,
        450 / basicRatio,
        35 / basicRatio,
        PHOTO_WIDTH,
        PHOTO_HEIGHT,
      )

      // 绘制对方昵称
      ctx.fillStyle = "#fff"
      ctx.font = "bold 15px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      ctx.fillText(
        GameGlobal.enemyUserInfo.user_nick,
        NICKNAME_ENEMY_X,
        NICKNAME_Y
      )

      // 绘制VS
      ctx.drawImage(
        this.vsImg,
        VS_IMG_X,
        VS_IMG_Y,
        VS_IMG_WIDTH,
        VS_IMG_HEIGHT,
      )
    }
  }

  /**
   * 准备倒计时渲染
   */
  renderCountdown(ctx, readyType, times) {
    // 绘制准备倒计时背景图
    ctx.drawImage(
      this.readyImg,
      READY_IMG_X,
      READY_IMG_Y,
      READY_IMG_WIDTH,
      READY_IMG_HEIGHT,
    )

    // 绘制准备按钮图
    ctx.drawImage(
      readyType === 'waitReady' ? this.readyBtnImg : this.cancelBtnImg,
      READY_BTN_IMG_X,
      READY_BTN_IMG_Y,
      READY_BTN_IMG_WIDTH,
      READY_BTN_IMG_HEIGHT,
    )

    // 绘制标题文字
    ctx.fillStyle = "#fff"
    ctx.font = "12px Arial" 
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.fillText(
      readyType === 'waitReady' ? '准备阶段' : '即将开战',
      375 / basicRatio,
      28 / basicRatio + READY_IMG_Y,
    )

    // 绘制按钮文字
    ctx.fillStyle = "#000"
    ctx.font = readyType === 'waitReady' ? "18px Arial" : "14px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.fillText(
      readyType === 'waitReady' ? '准备' : '取消准备',
      375 / basicRatio,
      READY_BTN_IMG_Y + READY_BTN_IMG_HEIGHT / 2 - 5 / basicRatio,
    )

    // 绘制倒计时文字
    ctx.fillStyle = "#fff"
    ctx.font = "34px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.fillText(
      times,
      375 / basicRatio,
      READY_IMG_Y + 130 / basicRatio,
    )

    this.btnReady = {
      startX: READY_BTN_IMG_X,
      startY: READY_BTN_IMG_Y,
      endX: READY_BTN_IMG_X + READY_BTN_IMG_WIDTH,
      endY: READY_BTN_IMG_Y + READY_BTN_IMG_HEIGHT
    }
  }

  renderShopBtn(ctx) {
    ctx.drawImage(
      this.shopBtnImg,
      SHOP_BTN_IMG_X,
      SHOP_BTN_IMG_Y,
      SHOP_BTN_IMG_WIDTH,
      SHOP_BTN_IMG_HEIGHT,
    )
    /**
     * 商店按钮区域
     * 方便简易判断按钮点击
     */
    this.btnShop = {
      startX: SHOP_BTN_IMG_X,
      startY: SHOP_BTN_IMG_Y,
      endX  : SHOP_BTN_IMG_X + SHOP_BTN_IMG_WIDTH,
      endY  : SHOP_BTN_IMG_Y + SHOP_BTN_IMG_HEIGHT
    }
  }

  renderMatchBtn(ctx) {
    // 绘制匹配按钮
    ctx.drawImage(
      this.matchImg,
      MATCHBTN_X,
      MATCHBTN_Y,
      MATCHBTN_WIDTH,
      MATCHBTN_HEIGHT,
    )
    // 绘制匹配按钮文字
    ctx.fillStyle = "#442103"
    ctx.font = "18px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    ctx.fillText(
      `开始匹配`,
      375 / basicRatio,
      544 / basicRatio
    )
    /**
     * 匹配按钮区域
     * 方便简易判断按钮点击
     */
    this.btnMatch = {
      startX: MATCHBTN_X,
      startY: MATCHBTN_Y,
      endX: MATCHBTN_X + MATCHBTN_WIDTH,
      endY: MATCHBTN_Y + MATCHBTN_HEIGHT
    }
  }
  /**
   * 绘制英雄栏
   */
  renderHeroColumn(ctx) {
    ctx.drawImage(
      this.columnImg,
      0,
      1125 / basicRatio,
      COLUMN_IMG_WIDTH,
      COLUMN_IMG_HEIGHT,
    )
  }
  /**
   * 绘制英雄栏分页按钮
   */
  drawBtn(ctx, type) {
    if (type === 'pre') {
      // 上一页按钮
      ctx.drawImage(
        this.preBtnImg,
        PRE_BTN_IMG_X,
        PRE_BTN_IMG_Y,
        PRE_BTN_IMG_WIDTH,
        PRE_BTN_IMG_HEIGHT,
      )
    } else {
      // 下一页按钮
      ctx.drawImage(
        this.nextBtnImg,
        NEXT_BTN_IMG_X,
        NEXT_BTN_IMG_Y,
        NEXT_BTN_IMG_WIDTH,
        NEXT_BTN_IMG_HEIGHT,
      )
    }
  }
  /**
   * 渲染英雄栏分页按钮
   */
  renderBtn(ctx, pageNo, pageSize, total) {
    if (total > pageSize) {
      if (pageNo !== 1) { // 上一页
        this.drawBtn(ctx, 'pre')
      }

      if (pageNo * pageSize < total) { // 禁用下一页
        this.drawBtn(ctx, 'next')
      }
    } else { // 禁用上下页

    }

    this.preBtn = {
      startX: PRE_BTN_IMG_X,
      startY: PRE_BTN_IMG_Y,
      endX: PRE_BTN_IMG_Y + PRE_BTN_IMG_WIDTH,
      endY: PRE_BTN_IMG_Y + PRE_BTN_IMG_HEIGHT
    }

    this.nextBtn = {
      startX: NEXT_BTN_IMG_X,
      startY: NEXT_BTN_IMG_Y,
      endX: NEXT_BTN_IMG_Y + NEXT_BTN_IMG_WIDTH,
      endY: NEXT_BTN_IMG_Y + NEXT_BTN_IMG_HEIGHT
    }
  }
}

