import API from '../../api/index'
import Sprite from '../base/sprite'

const screenWidth    = window.innerWidth
const screenHeight   = window.innerHeight

const basicRatio = GameGlobal.BASIC_RATIO

// 商店相关常量设置
const SHOP_IMG_SRC = 'images/shop.png'
const SHOP_WIDTH   = 750 / basicRatio
const SHOP_HEIGHT  = 870 / basicRatio

// 商店英雄相关常量
const SHOP_HERO_IMG_WIDTH  = 110 / basicRatio
const SHOP_HERO_IMG_HEIGHT = 110 / basicRatio

// 星星相关常量
const STAR_IMG_SRC = 'images/star.png'
const STAR_IMG_WIDTH  = 24 / basicRatio
const STAR_IMG_HEIGHT = 24 / basicRatio

// 按钮相关常量
const BTN_IMG_SRC     = 'images/ready-btn.png'
const DIS_BTN_IMG_SRC = 'images/cancel-btn.png'
const BTN_IMG_WIDTH   = 120 / basicRatio
const BTN_IMG_HEIGHT  = 65 / basicRatio

// 关闭按钮相关常量
const CLOSE_BTN_IMG_SRC    = 'images/close-btn.png'
const CLOSE_BTN_IMG_WIDTH  = 68 / basicRatio
const CLOSE_BTN_IMG_HEIGHT = 68 / basicRatio

export default class Shop extends Sprite {
  constructor() {
    super(SHOP_IMG_SRC, SHOP_WIDTH, SHOP_HEIGHT, 0, 150 / basicRatio)
    // 商店英雄
    this.getShopHeros()
    // 当前页数
    this.pageNo    = 1
    // 每页数量
    this.pageSize  = 12
    // 总计数量
    this.total     = 0
    // 上一页按钮
    this.preBtnImg = new Image()
    this.preBtnImg.src = BTN_IMG_SRC
    // 上一页禁用按钮
    this.preDisBtnImg = new Image()
    this.preDisBtnImg.src = DIS_BTN_IMG_SRC
    // 下一页按钮
    this.nextBtnImg = new Image()
    this.nextBtnImg.src = BTN_IMG_SRC
    // 下一页禁用按钮
    this.nextDisBtnImg = new Image()
    this.nextDisBtnImg.src = DIS_BTN_IMG_SRC
    // 关闭按钮
    this.CloseBtnImg = new Image()
    this.CloseBtnImg.src = CLOSE_BTN_IMG_SRC

    this.preBtnDisabled = false
    this.nextBtnDisabled = false
  }

  /**
   * 获取商店英雄数据
   */
  getShopHeros() {
    const dataArr = []
    const paddingX = 120 / basicRatio
    const paddingY = 220 / basicRatio
    const spaceX  = 25 / basicRatio
    const spaceY  = 70 / basicRatio

    wx.request({
      url: API.roleList,
      method: 'GET',
      data: {
        token: GameGlobal.token
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        const { data: { code, data } } = res

        if (code !== 8000) {
          wx.showToast({
            title: '获取数据失败！',
            duration: 2000
          })
          return
        }

        this.shopHeros = data.map((item, index) => {
          item.classify = 'front'
          item.url      = `images/hero/${item.HeroSeries}/${item.HeroLevelType}/front/main.png`
          item.x        = this.x + paddingX + (index % 4) * (SHOP_HERO_IMG_WIDTH + spaceX)
          item.y        = this.y + paddingY + (parseInt((index % 12) / 4) % 4) * (SHOP_HERO_IMG_HEIGHT + spaceY)
          item.width    = SHOP_HERO_IMG_WIDTH
          item.height   = SHOP_HERO_IMG_HEIGHT

          return item
        })

        this.total = this.shopHeros.length
      }
    })
  }

  renderCloseBtn(ctx) {
    const x = this.x + this.width - 150 / basicRatio
    const y = this.y + 30 / basicRatio

    ctx.drawImage(
      this.CloseBtnImg,
      x,
      y,
      CLOSE_BTN_IMG_WIDTH,
      CLOSE_BTN_IMG_HEIGHT,
    )

    this.closeBtn = {
      startX: x,
      startY: y,
      endX: x + CLOSE_BTN_IMG_WIDTH,
      endY: y + CLOSE_BTN_IMG_HEIGHT
    }
  }

  renderStars(ctx, x, y, num) {
    let startX = x + 45 / basicRatio

    if (num === 2) {
      startX -= 15 / basicRatio
    } else if (num === 3) {
      startX -= 25 / basicRatio
    }

    for (let i = 0; i < num; i++) {
      const img = new Image()

      img.src = STAR_IMG_SRC

      ctx.drawImage(
        img,
        startX + (i * 25 / basicRatio),
        y - 10 / basicRatio,
        STAR_IMG_WIDTH,
        STAR_IMG_HEIGHT,
      )
    }
  }

  renderShopHero(ctx) {
    const { pageNo, pageSize } = this;
    const showShopHeros = this.shopHeros.slice((pageNo - 1) * pageSize, pageNo * pageSize)

    showShopHeros.map((item) => {
      let img = new Image()
      img.src = item.url

      ctx.drawImage(
        img,
        item.x,
        item.y,
        SHOP_HERO_IMG_WIDTH,
        SHOP_HERO_IMG_HEIGHT,
      )

      this.renderStars(ctx, item.x, item.y, parseInt(item.HeroLevel))

      ctx.fillStyle = "#ffd400"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      ctx.fillText(
        `金币 ${item.GoldCoin}`,
        item.x + 60 / basicRatio,
        item.y - 30 / basicRatio,
      )
    })

    this.showShopHeros = showShopHeros
  }

  drawBtn(ctx, type, disabled) {
    const startPreX  = 250 / basicRatio
    const startNextX = 380 / basicRatio
    const startY     = 890 / basicRatio

    if (type === 'pre') {
      // 上一页按钮
      ctx.drawImage(
        disabled ? this.preDisBtnImg : this.preBtnImg,
        startPreX,
        startY,
        BTN_IMG_WIDTH,
        BTN_IMG_HEIGHT,
      )

      // 上一页文字
      ctx.fillStyle = "#fff"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      ctx.fillText(
        `上一页`,
        startPreX + (BTN_IMG_WIDTH / 2),
        startY + (BTN_IMG_HEIGHT / 2),
      )
    } else {
      // 下一页按钮
      ctx.drawImage(
        disabled ? this.nextDisBtnImg : this.nextBtnImg,
        startNextX,
        startY,
        BTN_IMG_WIDTH,
        BTN_IMG_HEIGHT,
      )

      // 下一页文字
      ctx.fillStyle = "#fff"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      ctx.fillText(
        `下一页`,
        startNextX + (BTN_IMG_WIDTH / 2),
        startY + (BTN_IMG_HEIGHT / 2),
      )
    }
  }

  renderBtn(ctx) {
    const startPreX = 250 / basicRatio
    const startNextX = 380 / basicRatio
    const startY = 890 / basicRatio
    const { pageNo, pageSize } = this;

    if (this.total > pageSize) {
      if (pageNo === 1) { // 禁用上一页
        this.preBtnDisabled = true
        this.drawBtn(ctx, 'pre', true)
      } else {
        this.preBtnDisabled = false
        this.drawBtn(ctx, 'pre', false)
      }

      if (pageNo * pageSize >= this.total) { // 禁用下一页
        this.nextBtnDisabled = true
        this.drawBtn(ctx, 'next', true)
      } else {
        this.nextBtnDisabled = false
        this.drawBtn(ctx, 'next', false)
      }
    } else { // 禁用上下页

    }

    this.preBtn = {
      startX: startPreX,
      startY: startY,
      endX: startPreX + BTN_IMG_WIDTH,
      endY: startY + BTN_IMG_HEIGHT
    }

    this.nextBtn = {
      startX: startNextX,
      startY: startY,
      endX: startNextX + BTN_IMG_WIDTH,
      endY: startY + BTN_IMG_HEIGHT
    }
  }

  btnClick(type) {
    if (type === 'pre') {
      if (this.preBtnDisabled) {
        return
      } else {
        this.pageNo -= 1
      }
    } else {
      if (this.nextBtnDisabled) {
        return
      } else {
        this.pageNo += 1
      }
    }
  }
}