class CompeteRoutes {
  constructor (express, competeController) {
    this.name = 'CompeteRoutes'
    this.router = express.Router()

    this.router.post('/', competeController.createCompete)
    this.router.get('/', competeController.getCompetes)
    this.router.get('/:competeId', competeController.getCompete)
    this.router.put('/:competeId', competeController.updateCompete)
    this.router.delete('/:competeId', competeController.deleteCompete)
  }
}

module.exports = {
  CompeteRoutes
}
