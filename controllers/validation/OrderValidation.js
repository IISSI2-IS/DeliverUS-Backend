const { check } = require('express-validator')
const models = require('../../models')
const Order = models.Order

module.exports = {
  create: () => {
    return [
      check('products')
        .custom((value, { req }) => {
          // TODO: Check that the order includes some products (at least one) and each product quantity is greater than 0

        })
        .withMessage('Order should have products, and all of them with quantity greater than zero'),
      check('products')
        .custom(async (value, { req }) => {
          // TODO: Check that productsIds are valid (they exists in the database), and every product belongs to the restaurant of the order
        })
    ]
  },
  confirm: () => {
    return [
      check('startedAt')
        .custom(async (value, { req }) => {
          try {
            const order = await Order.findByPk(req.params.orderId,
              {
                attributes: ['startedAt']
              })
            if (order.startedAt) {
              return Promise.reject(new Error('The order has already been started'))
            } else {
              return Promise.resolve('ok')
            }
          } catch (err) {
            return Promise.reject(err)
          }
        })
    ]
  },
  send: () => {
    return [
      check('sentAt')
        .custom(async (value, { req }) => {
          try {
            const order = await Order.findByPk(req.params.orderId,
              {
                attributes: ['startedAt', 'sentAt']
              })
            if (!order.startedAt) {
              return Promise.reject(new Error('The order is not started'))
            } else if (order.sentAt) {
              return Promise.reject(new Error('The order has already been sent'))
            } else {
              return Promise.resolve('ok')
            }
          } catch (err) {
            return Promise.reject(err)
          }
        })
    ]
  },
  deliver: () => {
    return [
      check('deliveredAt')
        .custom(async (value, { req }) => {
          try {
            const order = await Order.findByPk(req.params.orderId,
              {
                attributes: ['startedAt', 'sentAt', 'deliveredAt']
              })
            if (!order.startedAt) {
              return Promise.reject(new Error('The order is not started'))
            } else if (!order.sentAt) {
              return Promise.reject(new Error('The order is not sent'))
            } else if (order.deliveredAt) {
              return Promise.reject(new Error('The order has already been delivered'))
            } else {
              return Promise.resolve('ok')
            }
          } catch (err) {
            return Promise.reject(err)
          }
        })
    ]
  }
}
