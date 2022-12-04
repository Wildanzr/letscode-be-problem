const { ProblemSubmission } = require('../models')

class ProblemSubmissionService {
  constructor () {
    this.name = 'ProblemSubmissionService'
  }

  async getSubmissionsInCP (competeProblemId, userId) {
    const submission = await ProblemSubmission.findOne({ competeProblemId, userId })
      .select('listOfSubmission currentPoints')
      .exec()

    if (!submission) return { listOfSubmission: [], currentPoint: 0 }

    return submission
  }
}

module.exports = {
  ProblemSubmissionService
}
