import chai from 'chai'
import Stock from '@pages/stocks/Stock'
import Trader from '@pages/ships/Trader'
import Factory from '@pages/factories/Factory'
import Resource from '@pages/resource/Resource'
import { STOCK_TYPE_PRODUCT, STOCK_TYPE_RESOURCE } from '@pages/constants'

describe('Trader', () => {
  describe('getFreePlace', () => {
    it('should return free place of sheep', () => {
      const trader = new Trader({ size: 200 })
      // 15 * 4 = 60
      const stock1 = new Stock({ count: 15 })
      stock1.resource.size = 4
      // 12 * 8 = 96
      const stock2 = new Stock({ count: 12 })
      stock2.resource.size = 8
      // 200 - (60 + 96) = 44
      trader.stocks = [ stock1, stock2 ]

      chai.expect(trader.getFreePlace()).to.be.equal(44)
    })
  })

  describe('countResourcesBuy', () => {
    it('should return count of resources for buying', () => {
      // Максимальный объем грузового отсека карабля 200 ед.
      const trader = new Trader({ size: 200 })

      // На карабле есть один бокс с товарами в кол-ве 15 шт. Занимаемый объем одного товара 4 ед.
      const stockTrader = new Stock({ type: STOCK_TYPE_PRODUCT, count: 15, quantity: 15 })
      stockTrader.resource.size = 4
      trader.stocks = [ stockTrader ]

      // Есть склад который нуждается в ресурсах. Занимаемый объем одного ресурса 8 ед.
      const stockFactoryResource = new Stock({ type: STOCK_TYPE_RESOURCE, quantity: 2, count: 0, size: 500, limitMin: 10, limitMax: 90 })
      stockFactoryResource.resource.size = 8

      // 200 - (15 * 4) = 140
      chai.expect(trader.getFreePlace()).to.be.equal(140)
      // 140 / 8 = 17.5 = 17
      chai.expect(trader.countResourcesBuy(stockFactoryResource)).to.be.equal(17)
    })
  })

  describe('countProductSell', () => {
    it('should return count of products for selling', () => {
      // Максимальный объем грузового отсека карабля 400 ед.
      const trader = new Trader({ size: 400 })

      // На карабле есть один бокс с товарами в кол-ве 15 шт. Занимаемый объем одного товара 3 ед.
      const stockTrader = new Stock({ type: STOCK_TYPE_PRODUCT, count: 25, quantity: 15 })
      stockTrader.resource.size = 3
      trader.stocks = [ stockTrader ]

      // Есть товары на складе которые можно продать. Занимаемый объем одного товара 5 ед.
      const stockFactoryProduct = new Stock({ type: STOCK_TYPE_PRODUCT, quantity: 2, count: 550, size: 800, limitMin: 10, limitMax: 90 })
      stockFactoryProduct.resource.size = 5

      // 400 - (25 * 3) = 325
      chai.expect(trader.getFreePlace()).to.be.equal(325)
      // 325 / 5 = 65
      chai.expect(trader.countProductSell(stockFactoryProduct)).to.be.equal(65)
    })
  })

  describe('removeStock', () => {
    it('should add product stock', () => {
      const trader = new Trader({ size: 400 })
      trader.addProductStock(new Resource({ key: 'key-1' }), 10, 9, 23)
      trader.addProductStock(new Resource({ key: 'key-2' }), 15, 25, 41)
      trader.addResourceStock(new Resource({ key: 'key-3' }), 215, 5, 12)

      const test1 = trader.stocks.map((stock) => stock.resource.key)
      chai.expect(test1).to.be.deep.equal(['key-1', 'key-2', 'key-3'])

      trader.removeStock(trader.stocks[trader.stocks.length - 1])
      const test2 = trader.stocks.map((stock) => stock.resource.key)
      chai.expect(test2).to.be.deep.equal(['key-1', 'key-2'])

      trader.removeStock(trader.stocks[trader.stocks.length - 1])
      const test3 = trader.stocks.map((stock) => stock.resource.key)
      chai.expect(test3).to.be.deep.equal(['key-1'])

      trader.removeStock(trader.stocks[trader.stocks.length - 1])
      const test4 = trader.stocks.map((stock) => stock.resource.key)
      chai.expect(test4).to.be.deep.equal([])
    })
  })

  describe('findResourceTarget', () => {
    const defaultStockOptions = {
      resource: new Resource({ key: 'key-1', size: 3 }),
      type: STOCK_TYPE_PRODUCT,
      size: 1000,
      quantity: 1,
      priceMin: 9,
      priceMax: 23,
      limitMin: 10,
      limitMax: 90,
    }

    it('should find more profitable factory for buying', () => {
      const trader = new Trader({ size: 400 })
      // Нужно купить 400 ресурсов.
      trader.addResourceStock(new Resource({ key: 'key-1' }), 400, 20, 23)

      // Станция которая продает товар (худшая цена)
      const factory1 = new Factory()
      factory1.name = 'Factory 1'
      factory1.stocks = [
        new Stock({ ...defaultStockOptions, count: 120 })
      ]
      // Станция которая продает товар (лучшая цена)
      const factory2 = new Factory()
      factory2.name = 'Factory 2'
      factory2.stocks = [
        new Stock({ ...defaultStockOptions, count: 620 })
      ]
      // Станция которая продает товар (низкая цена).
      const factory3 = new Factory()
      factory3.name = 'Factory 3'
      factory3.stocks = [
        new Stock({ ...defaultStockOptions, count: 201 })
      ]

      const factories = [ factory1, factory2, factory3 ]
      for (let stock of trader.stocks) {
        const productFactoryTarget = trader.findResourceTarget(factories, stock)
        chai.expect(productFactoryTarget.name).to.be.equal('Factory 2')
      }
    })

    it('should skip factories by limit min', () => {
      const trader = new Trader({ size: 200 })
      // Нужно купить 200 ресурсов.
      trader.addResourceStock(new Resource({ key: 'key-1' }), 200, 20, 23)

      // Станция которая продает товар (средняя цена но ниже лимита)
      const factory1 = new Factory()
      factory1.name = 'Factory 1'
      factory1.stocks = [
        new Stock({ ...defaultStockOptions, count: 120, limitMin: 20 })
      ]
      // Станция которая продает товар (лучшая цена но ниже лимита)
      const factory2 = new Factory()
      factory2.name = 'Factory 2'
      factory2.stocks = [
        new Stock({ ...defaultStockOptions, count: 320, limitMin: 40 })
      ]
      // Станция которая продает товар (худшая цена но можно купить 40 товаров).
      const factory3 = new Factory()
      factory3.name = 'Factory 3'
      factory3.stocks = [
        new Stock({ ...defaultStockOptions, count: 50, limitMin: 1 })
      ]

      const factories = [ factory1, factory2, factory3 ]
      for (let stock of trader.stocks) {
        const productFactoryTarget = trader.findResourceTarget(factories, stock)
        chai.expect(productFactoryTarget.name).to.be.equal('Factory 3')
      }
    })
  })

  describe('findProductTarget', () => {
    const defaultStockOptions = {
      resource: new Resource({ key: 'key-1', size: 3 }),
      type: STOCK_TYPE_RESOURCE,
      size: 1000,
      quantity: 1,
      priceMin: 9,
      priceMax: 23,
      limitMin: 10,
      limitMax: 90,
    }

    it('should find more profitable factory for selling', () => {
      const trader = new Trader({ size: 200 })
      // Нужно продать 200 товаров.
      trader.addProductStock(new Resource({ key: 'key-1' }), 200, 20, 23)

      // Станция которая покупает ресурсы (худшая цена)
      const factory1 = new Factory()
      factory1.name = 'Factory 1'
      factory1.stocks = [
        new Stock({ ...defaultStockOptions, count: 10 })
      ]
      // Станция которая покупает ресурсы (лучшая цена)
      const factory2 = new Factory()
      factory2.name = 'Factory 2'
      factory2.stocks = [
        new Stock({ ...defaultStockOptions, count: 600 })
      ]
      // Станция которая покупает ресурсы (низкая цена).
      const factory3 = new Factory()
      factory3.name = 'Factory 3'
      factory3.stocks = [
        new Stock({ ...defaultStockOptions, count: 200 })
      ]

      const factories = [ factory1, factory2, factory3 ]
      for (let stock of trader.stocks) {
        const productFactoryTarget = trader.findProductTarget(factories, stock)
        chai.expect(productFactoryTarget.name).to.be.equal('Factory 1')
      }
    })

    it('should skip factories by limit max', () => {
      const trader = new Trader({ size: 300 })
      // Нужно продать 300 ресурсов.
      trader.addProductStock(new Resource({ key: 'key-1' }), 300, 20, 23)

      // Станция которая покупает русурсы (низкая цена, лимит превышен)
      const factory1 = new Factory()
      factory1.name = 'Factory 1'
      factory1.stocks = [
        new Stock({ ...defaultStockOptions, count: 950, limitMax: 90 })
      ]
      // Станция которая покупает ресурсы (хорошая цена, лимит превышен)
      const factory2 = new Factory()
      factory2.name = 'Factory 2'
      factory2.stocks = [
        new Stock({ ...defaultStockOptions, count: 420, limitMax: 40 })
      ]
      // Станция которая покупает ресурсы (отличная цена).
      const factory3 = new Factory()
      factory3.name = 'Factory 3'
      factory3.stocks = [
        new Stock({ ...defaultStockOptions, count: 700, limitMax: 80 })
      ]

      const factories = [ factory1, factory2, factory3 ]
      for (let stock of trader.stocks) {
        const productFactoryTarget = trader.findProductTarget(factories, stock)
        chai.expect(productFactoryTarget.name).to.be.equal('Factory 3')
      }
    })
  })
})
