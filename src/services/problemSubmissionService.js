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

  async getLeaderboardInCP (competeProblemId, page, limit) {
    const leaderboard = await ProblemSubmission.find({ competeProblemId })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'userId', select: '_id username avatar' })
      .select('userId currentPoints')
      .sort({ currentPoints: -1 })
      .exec()

    const total = await ProblemSubmission.countDocuments({ competeProblemId })

    if (!leaderboard) return { leaderboard: [], total: 0 }

    return { leaderboard, total }
  }
}

module.exports = {
  ProblemSubmissionService
}
