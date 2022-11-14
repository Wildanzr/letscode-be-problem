class CompeteRoutes {
  constructor (express, competeController) {
    this.name = 'CompeteRoutes'
    this.router = express.Router()

    this.router.post('/', competeController.createCompete)
  }
}

module.exports = {
  CompeteRoutes
}
