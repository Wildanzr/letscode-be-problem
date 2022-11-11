class ProblemRoutes {
  constructor (express, problemController) {
    this.name = 'Problemroutes'
    this.router = express.Router()

    this.router.post('/', problemController.createProblem)

    this.router.post('/:problemId/test-cases', problemController.createProblemTestCase)

    this.router.post('/:problemId/sample-cases', problemController.createProblemSampleCase)
    this.router.get('/:problemId/sample-cases/:sampleCaseId', problemController.getProblemSampleCase)
  }
}

module.exports = {
  ProblemRoutes
}
