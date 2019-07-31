import Sprite from '../base/sprite'

const UIWidth      = 750
const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight
const basicRatio   = UIWidth / screenWidth // 设置背景图基础比例全局变量（游戏背景图UI尺寸为750*1334）
// 准备页常量设置
const START_IMG_SRC  = 'images/start.png'
const START_WIDTH    = 750 / basicRatio
const START_HEIGHT   = 1334 / basicRatio
const BTN_IMG_SRC    = 'images/start-btn.png'
const BTN_IMG_WIDTH  = 380 / basicRatio
const BTN_IMG_HEIGHT = 110 / basicRatio

GameGlobal.BASIC_RATIO = basicRatio

/**
 * 准备游戏背景类
 * 提供start游戏开始回调
 */
export default class ReadyPage extends Sprite {
  constructor(ctx) {
    super(START_IMG_SRC, START_WIDTH, START_HEIGHT)

    this.btnImg = null

    this.render(ctx)
  }

  /**
   * 背景图重绘函数
   */
  render(ctx) {
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
    )
    /**
     * 进入游戏按钮定位
     */
    if (!this.btnImg) {
      this.btnImg = new Image()
      this.btnImg.src = BTN_IMG_SRC
    }

    this.startBtn = {
      x: 192 / basicRatio,
      y: 700 / basicRatio,
      width: BTN_IMG_WIDTH,
      height: BTN_IMG_HEIGHT,
    }

    ctx.drawImage(
      this.btnImg,
      this.startBtn.x,
      this.startBtn.y,
      this.startBtn.width,
      this.startBtn.height,
    )
  }
}
