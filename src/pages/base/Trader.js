import objectPath from 'object-path'
import Timer from '@pages/base/Timer'
import Entity from '@pages/base/Entity'
import Stock from '@pages/stocks/Stock'
import Engine from '@pages/utils/Engine'
import { randomInt } from '@lib/random'
import { STOCK_TYPE_RESOURCE, STOCK_TYPE_PRODUCT } from '@pages/constants'

export default class Trader extends Entity {
  /**
   * @typedef {Object} TraderOptions
   * @property {number} [size]
   * @property {string[]} [types]
   */

  /**
   *
   * @param {TraderOptions} [options]
   */
  constructor(options) {
    super()

    /** @type {Stock[]} */
    this.stocks = []

    /** @type {Entity|Mine|Factory} */
    this.target = undefined

    /** @type {Timer} */
    this.time = new Timer()
      .sleep(this.randomSleep)

    /** @type {Engine} */
    this.engine = new Engine()

    /** @type {boolean} */
    this.pause = false

    /** @type {string} */
    this.status = Trader.STATUS_WAITING

    /**
     * Размер грузового отсека.
     * @type {number}
     */
    this.size = objectPath.get(options, ['size'], 150)

    /** @type {string[]} */
    this.types = objectPath.get(options, ['types'], [ STOCK_TYPE_RESOURCE, STOCK_TYPE_PRODUCT ])
  }

  /**
   *
   * @returns {number}
   */
  get randomSleep() {
    return randomInt(1000, 10000)
  }

  /**
   * Находится на базе.
   * @type {string}
   */
  static ENV_HOME = 'home'

  /**
   * Находится в космосе.
   * @type {string}
   */
  static ENV_SPACE = 'space'

  /**
   * Находится на станции.
   * @type {string}
   */
  static ENV_TARGET = 'target'

  static EVENT_TRADE = 'trade'
  static EVENT_MOVE_UPDATE = 'move-update'
  static EVENT_MOVE_COMPLETE = 'move-complete'
  static EVENT_MOVE_START = 'move-stop'

  /**
   * Ждет загрузку или разкрузку на базе.
   * @type {string}
   */
  static STATUS_WAITING = 'waiting'

  /**
   * Поиск цели.
   * @type {string}
   */
  static STATUS_SCANNING = 'scanning'

  /**
   * Загружает или разгружает товар в точке продаж|покупки.
   * @type {string}
   */
  static STATUS_UPLOADING = 'uploading'

  /**
   * Получает цель.
   * @type {string}
   */
  static STATUS_FLY_START = 'fly-start'

  /**
   * Начинает движение и перемещается к цели.
   * @type {string}
   */
  static STATUS_FLYING = 'flying'

  /**
   *
   * @returns {Sector}
   */
  get sector() {
    return this.parent.parent
  }

  /**
   * Найти завод который производит, продает товары.
   * Выбрать по наилучшей цене.
   *
   * @param {Entity[]} entities
   * @param {Stock} stock
   * @returns {Entity|null}
   */
  findResourceTarget(entities, stock) {
    const arr = []
    for (let entity of entities) {
      if (!entity['isFactory'] || this.parent === this) {
        continue
      }

      for (let item of entity['stocks']) {
        if (stock.resource.key !== item.resource.key) {
          continue
        }

        if (stock.type === STOCK_TYPE_RESOURCE && item.type === STOCK_TYPE_PRODUCT) {
          if (item.count > item.minCount) {
            arr.push({ entity, price: item.price })
            break
          }
        }
      }
    }

    const res = arr.sort((a, b) => a.price < b.price ? -1 : 1)
    return res.length > 0 ? res[0]['entity'] : null
  }

  /**
   * Найти завод который потребляет, покупает ресурсы.
   * Выбрать по наилучшей цене.
   *
   * @param {Entity[]} entities
   * @param {Stock} stock
   * @returns {Entity|null}
   */
  findProductTarget(entities, stock) {
    const arr = []
    for (let entity of entities) {
      if (!entity['isFactory'] || this.parent === this) {
        continue
      }

      for (let item of entity['stocks']) {
        if (stock.resource.key !== item.resource.key) {
          continue
        }

        if (stock.type === STOCK_TYPE_PRODUCT && item.type === STOCK_TYPE_RESOURCE) {
          if (item.count < item.maxCount) {
            arr.push({ entity, price: item.price })
            break
          }
        }
      }
    }

    const res = arr.sort((a, b) => a.price < b.price ? 1 : -1)
    return res.length > 0 ? res[0]['entity'] : null
  }

  /**
   * Определить текущее расположение.
   *
   * @returns {string}
   */
  get env() {
    if (this.object3D.position.equals(this.parent.object3D.position)) {
      return Trader.ENV_HOME
    }

    if (this.target && this.object3D.position.equals(this.target.object3D.position)) {
      return Trader.ENV_TARGET
    }

    return Trader.ENV_SPACE
  }

  /**
   * Покупать ресурсы.
   * @param {Resource} resource - Ресурс который нужно купить.
   * @param {number} size       - Кол-во которое нужно купить.
   * @param {number} priceMin   - Минимальная цена покупки.
   * @param {number} priceMax   - Максимальная цена покупки.
   * @returns {Trader}
   */
  addResourceStock(resource, size, priceMin, priceMax) {
    this.stocks.push(
      new Stock({ type: STOCK_TYPE_RESOURCE, resource, priceMin, priceMax, size, count: 0 })
    )
    return this
  }

  /**
   * Продавать товары.
   * @param {Resource} resource   - Товар который нудно продать.
   * @param {number} count        - Кол-во товаров.
   * @param {number} priceMin     - Минимальная цена продажи товара.
   * @param {number} priceMax     - Максимальная цена продажи товара.
   * @returns {Trader}
   */
  addProductStock(resource, count, priceMin, priceMax) {
    this.stocks.push(
      new Stock({ type: STOCK_TYPE_PRODUCT, size: count, count, priceMin, priceMax, resource })
    )
  }

  /**
   *
   * @param {Stock} stock
   * @returns {Trader}
   */
  removeStock(stock) {
    const index = this.stocks.indexOf(stock)
    if (index !== -1) {
      this.stocks.splice(index, 1)
    }
    return this
  }

  /**
   * Кол-во товаров которое можно продать.
   *
   * @param {Stock} stock
   * @returns {number}
   */
  countProductSell(stock) {
    const freeSpace = this.getFreePlace()
    return Math.floor(stock.outputCount(freeSpace) / stock.resource.size)
  }

  /**
   * Кол-во ресурсов которое можно купить.
   *
   * @param {Stock} stock
   * @returns {number}
   */
  countResourcesBuy(stock) {
    const freeSpace = this.getFreePlace()
    return Math.floor(stock.inputCount(freeSpace) / stock.resource.size)
  }

  /**
   * @returns {number}
   */
  getFreePlace() {
    let size = 0
    for (let stock of this.stocks) {
      size += stock.count * stock.resource.size
    }
    return Math.max(this.size - size, 0)
  }

  update() {
    if (this.status === Trader.STATUS_WAITING && this.parent.pause === false) {
      const { isExpired } = this.time.update()
      if (isExpired) {
        this.time.sleep(this.randomSleep)

        if (this.types.includes(STOCK_TYPE_RESOURCE)) {
          const stock = this.parent.findResourceStock()
          if (stock) {
            const size = this.countResourcesBuy(stock)
            this.addResourceStock(stock.resource, size, stock.priceMin, stock.price)
            this.status = Trader.STATUS_SCANNING
            this.time.sleep(0)
            return
          }
        }

        // if (this.types.includes(STOCK_TYPE_PRODUCT)) {
        //   const stock = this.parent.findProductStock()
        //   if (stock) {
        //     const count = this.countProductSell(stock)
        //     this.addProductStock(stock.resource, count, stock.price, stock.priceMax)
        //     // Отнять со склада количество товаров которое было загруженно на карабль.
        //     stock.count -= count
        //     this.status = Trader.STATUS_SCANNING
        //     this.time.sleep(0)
        //     return
        //   }
        // }
      }
    }

    if (this.status === Trader.STATUS_SCANNING) {
      const { isExpired } = this.time.update()
      if (isExpired) {
        this.time.sleep(this.randomSleep)

        for (let stock of this.stocks) {
          const target = stock.type === STOCK_TYPE_RESOURCE
            ? this.findResourceTarget(this.sector.children, stock)
            : this.findProductTarget(this.sector.children, stock)

          if (target) {
            this.target = target
            this.time.sleep(0)
            this.status = Trader.STATUS_FLY_START
            break
          }
        }
      }
    }

    if (this.status === Trader.STATUS_FLY_START) {
      this.status = Trader.STATUS_FLYING

      const envTarget = this.object3D.position.equals(this.parent.object3D.position)

      if (envTarget) {
        console.log(`Карабль ${this.name} напрвляется на станцию ${this.target.name}`)
      } else {
        console.log(`Карабль ${this.name} напрвляется домой ${this.target.name}`)
      }
      let i = 1
      for (let stock of this.stocks) {
        if (stock.type === STOCK_TYPE_RESOURCE && envTarget) {
          console.log(`${i}. Купить ${stock.resource.key} count: ${stock.count}, size: ${stock.size} price: (${stock.priceMin} - ${stock.priceMax})`)
        } else if (stock.type === STOCK_TYPE_RESOURCE && !envTarget) {
          console.log(`${i}. Куплено ${stock.resource.key} count: ${stock.count}, size: ${stock.size}`)
        }

        // if (stock.type === STOCK_TYPE_PRODUCT && envTarget) {
        //   console.log(`${i}. Продать ${stock.resource.key} count ${stock.count}, size: ${stock.size}, price (${stock.priceMin} - ${stock.priceMax})`)
        // } else if (stock.type === STOCK_TYPE_PRODUCT && !envTarget) {
        //   console.log(`${i}. Продано ${stock.resource.key} count ${stock.count}, size: ${stock.size}`)
        // }
        i++
      }
      this.engine.start(this.object3D.position, this.target.object3D.position, (event, data) => {
        switch (event) {
          case Engine.EVENT_START:
            // this.events.emit(Trader.EVENT_MOVE_START, this, data)
            break
          case Engine.EVENT_UPDATE:
            this.object3D.material.opacity = data.opacity
            this.object3D.position.copy(data.position)
            this.object3D.lookAt(data.lookAt)
            // this.events.emit(Trader.EVENT_MOVE_UPDATE, this, data)
            break
          case Engine.EVENT_COMPLETE:
            this.time.sleep(0)
            this.status = Trader.STATUS_UPLOADING
            // this.events.emit(Trader.EVENT_MOVE_COMPLETE, this, data)
            break
        }
      })
    }

    if (Trader.STATUS_FLYING === this.status) {
      this.engine.update()
    }

    if (this.status === Trader.STATUS_UPLOADING) {
      const { isExpired } = this.time.update()
      if (isExpired) {
        this.time.sleep(this.randomSleep)

        if (this.env === Trader.ENV_TARGET) {
          console.log('Приехал к цели')
          for (let stock of this.stocks) {
            const targetStock = this.target.findStock(stock.resource.key)
            const price = targetStock.price

            // console.log(this.target.name, price, { priceMin: stock.priceMin, priceMax: stock.priceMax })
            if (stock.type === STOCK_TYPE_RESOURCE) {
              const count = targetStock.outputCount(stock.size)
              console.log(`Покупаем ${count} - ${stock.resource.name}`)
              // console.log({ count })
              if (count > 0 && price >= stock.priceMin && price <= stock.priceMax) {
                stock.count += count
                targetStock.count -= count
                console.log(`Куплено ${count} - ${stock.resource.name}`)
              }
            }

            // if (stock.type === STOCK_TYPE_PRODUCT) {
            //   const count = targetStock.inputCount(stock.count)
            //   if (count > 0 && price >= stock.priceMin && price <= stock.priceMax) {
            //     stock.count -= count
            //     targetStock.count += count
            //   }
            // }
          }

          this.events.emit(Trader.EVENT_TRADE, this.target)

          this.target = this.parent
          this.time.sleep(this.randomSleep)
          this.status = Trader.STATUS_FLY_START
        }

        if (this.env === Trader.ENV_HOME) {
          console.log('Приехал домой')
          for (let stock of [...this.stocks]) {
            const parentStock = this.parent.findStock(stock.resource.key)
            if (stock.type === STOCK_TYPE_RESOURCE) {
              const count = parentStock.inputCount(stock.count)
              console.log(`Приехал домой, открузил ${count} ресурсов.`)
              parentStock.count += count
              stock.count -= count
              if (stock.count === 0) {
                console.log('Удалил склад после отгрузки')
                this.removeStock(stock)
              } else {
                console.log('Склад отгружен не полностью.')
              }
            }

            // if (stock.type === STOCK_TYPE_PRODUCT) {
            //   // Отгрузить товары, кассу, удалить склады
            //   if (stock.count === 0) {
            //     this.removeStock(stock)
            //   }
            // }
          }

          this.events.emit(Trader.EVENT_TRADE, this.parent)


          this.time.sleep(this.randomSleep)
          // this.status = this.stocks.length > 0 ? Trader.STATUS_UPLOADING : Trader.STATUS_WAITING
          if (this.stocks.length > 0) {
            // 1. Можно повторно попытаться выгрузить ресурсы через N ремени.
            // 2. Если есть свободное место, можно выполнить поиск доп склада.
          }

          // if (this.getFreePlace() >= this.size / 2) {
          //   this.time.sleep(this.randomSleep)
          //   this.status = Trader.STATUS_WAITING
          // } else {
          //   this.time.sleep(this.randomSleep)
          //   this.status = Trader.STATUS_SCANNING
          // }
        }
      }
    }

  }
}
