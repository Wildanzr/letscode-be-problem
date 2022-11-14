class CompeteRoutes {
  constructor (express, competeController) {
    this.name = 'CompeteRoutes'
    this.router = express.Router()

    this.router.post('/', competeController.createCompete)
    this.router.get('/', competeController.getCompetes)
  }
}

module.exports = {
  CompeteRoutes
}
