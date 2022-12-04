class CompeteProblemRoutes {
  constructor (express, competeProblemController) {
    this.name = 'CompeteProblemRoutes'
    this.router = express.Router()

    this.router.get('/:competeProblemId/submissions', competeProblemController.getSubmissionsInCP)
    this.router.get('/:competeProblemId/submissions/:submissionId', competeProblemController.getSubmissionDetailInCP)
  }
}

module.exports = {
  CompeteProblemRoutes
}
