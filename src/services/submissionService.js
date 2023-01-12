const { Submission } = require('../models')
const { ClientError } = require('../errors')

class SubmissionService {
  constructor () {
    this.name = 'SubmissionService'
  }

  async getSubmissionDetail (submissionId) {
    const submission = await Submission.findById(submissionId)
    if (!submission) throw new ClientError('Pengumpulan tidak ditemukan.', 404)

    return submission
  }
}

module.exports = {
  SubmissionService
}
