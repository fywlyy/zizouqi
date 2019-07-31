import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame      = 0
    this.score      = 0
    this.heros    = []
    this.animations = []
    this.gameOver   = false
  }

  /**
   * 回收英雄，进入对象池
   * 此后不进入帧循环
   */
  removeHero(hero) {
    let temp = this.heros.shift()

    temp.visible = false

    this.pool.recover('hero', hero)
  }
}
