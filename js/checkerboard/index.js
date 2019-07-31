const BASIC_RATIO = GameGlobal.BASIC_RATIO

const screenWidth    = window.innerWidth
const screenHeight   = window.innerHeight

// 棋格相关常量设置
const CHKER_LINE_NUM = 6
const CHKER_ROW_NUM  = 8
const CHKER_TEFT     = 45 / BASIC_RATIO
const CHKER_TOP      = 210 / BASIC_RATIO
const CHKER_WIDTH    = 110 / BASIC_RATIO
const CHKER_HEIGHT   = 110 / BASIC_RATIO

export default class Checkerboard {
  constructor() {
    this.x = CHKER_TEFT
    this.y = CHKER_TOP
    this.lineNum = 6
    this.rowNum = 8
    this.checkerWidth = CHKER_WIDTH
    this.checkerHeight = CHKER_HEIGHT
    this.lightPoint = []
    this.heroPoints = []
    this.checkerPoints = this.getCheckerPoints()

  }

  /**
  * 获取所有棋格坐标
  */
  getCheckerPoints() {
    const points = [];
    const length = CHKER_LINE_NUM * CHKER_ROW_NUM

    for (let i = 0; i < length; i++) {
      const coordX = i % 6
      const coordY = parseInt(i / 6)
      const x = (i % 6 + .5) * this.checkerWidth + this.x
      const y = (7.5 - parseInt(i / 6)) * this.checkerHeight + this.y
      points.push([x, y, coordX, coordY])
    }

    return points
  }

  /**
  * 获取某棋格坐标
  */
  getPointCoord([pointX, pointY]) {
    return {
      x: pointX * this.checkerWidth + this.x,
      y: (7 - pointY) * this.checkerHeight + this.y,
    }
  }

  /**
  * 拖拽英雄是否在棋格中心处（以英雄图片边缘为基线）检测
  */
  dragDetection(dragObj) {
    let dragInCenter = false // 是否拖拽到棋格中点
    const { x, y, width, height } = dragObj

    this.checkerPoints.map((item) => {
      const [x_p, y_p, coordX, coordY] = item;

      if (x < x_p
        && x + width > x_p
        && y < y_p
        && y + height > y_p) {
        dragInCenter = true

        // 判断是否为英雄占用点
        let hasHero = false
        this.heroPoints.map((nextItem) => {
          if (nextItem[0] === x_p && nextItem[1] === y_p) {
            hasHero = true
          }
        })
        if (!hasHero) {
          this.lightPoint = [x_p, y_p, coordX, coordY]
        }
      }
    })

    if (!dragInCenter) {
      this.lightPoint = []
    }
  }

  renderChecker(ctx) {
    let beforeType = 'white'

    this.checkerPoints.map((item, index) => {
      const [x, y] = item

      if (beforeType === 'white') {
        ctx.fillStyle = 'rgba(255, 255 , 255, .2)'
        if (index % 6 !== 5) {
          beforeType = 'black'
        }
      } else {
        ctx.fillStyle = 'rgba(0, 0 , 0, .2)'
        if (index % 6 !== 5) {
          beforeType = 'white'
        }
      }

      ctx.fillRect(
        x - this.checkerWidth / 2,
        y - this.checkerHeight / 2,
        this.checkerWidth,
        this.checkerHeight
      )
    })
  }

  /**
  * 渲染点亮棋格
  */
  renderLigthChecker(ctx) {
    if (this.lightPoint.length) {
        const [x, y] = this.lightPoint
        ctx.fillStyle = 'rgba(0, 251 , 5, .5)'
        ctx.fillRect(
          x - this.checkerWidth / 2,
          y - this.checkerHeight / 2,
          this.checkerWidth,
          this.checkerHeight
        )
    }
  }
}