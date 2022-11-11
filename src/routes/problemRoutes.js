class ProblemRoutes {
  constructor (express, problemController) {
    this.name = 'Problemroutes'
    this.router = express.Router()

    this.router.post('/', problemController.createProblem)
    this.router.get('/:problemId', problemController.getProblem)

    // Problem sample cases
    this.router.post('/:problemId/sample-cases', problemController.createProblemSampleCase)
    this.router.get('/:problemId/sample-cases/:sampleCaseId', problemController.getProblemSampleCase)
    this.router.put('/:problemId/sample-cases/:sampleCaseId', problemController.updateProblemSampleCase)
    this.router.delete('/:problemId/sample-cases/:sampleCaseId', problemController.deleteProblemSampleCase)

    // Problem test cases
    this.router.post('/:problemId/test-cases', problemController.createProblemTestCase)
    this.router.get('/:problemId/test-cases/:testCaseId', problemController.getProblemTestCase)
    this.router.put('/:problemId/test-cases/:testCaseId', problemController.updateProblemTestCase)
    this.router.delete('/:problemId/test-cases/:testCaseId', problemController.deleteProblemTestCase)
  }
}

module.exports = {
  ProblemRoutes
}
