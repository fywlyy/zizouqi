import Sprite from '../base/sprite'

const basicRatio = GameGlobal.BASIC_RATIO

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

const BG_IMG_SRC   = 'images/game-bg.jpg'
const BG_WIDTH     = 750 / basicRatio
const BG_HEIGHT    = 1334 / basicRatio

/**
 * 游戏背景类
 */
export default class Background extends Sprite {
  constructor(ctx) {
    super(BG_IMG_SRC, BG_WIDTH, BG_HEIGHT)

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
  }
}
