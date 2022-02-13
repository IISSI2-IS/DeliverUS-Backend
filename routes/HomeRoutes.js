'use strict'

module.exports = (options) => {
  const app = options.app
  app.get('/', (req, res) => {
    res.send('Deliverus API. Check <a href="https://github.eii.us.es/IISSI2-IS/IISSI2-IS-Backend/wiki">Repository Wiki</a>')
  })
}
