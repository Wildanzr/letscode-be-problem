class ProblemRoutes {
  constructor (express, problemController) {
    this.name = 'Problemroutes'
    this.router = express.Router()

    this.router.get('/test', problemController.test)
  }
}

module.exports = {
  ProblemRoutes
}
