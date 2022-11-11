class ProblemRoutes {
  constructor (express, problemController) {
    this.name = 'Problemroutes'
    this.router = express.Router()

    this.router.post('/', problemController.createProblem)
  }
}

module.exports = {
  ProblemRoutes
}
