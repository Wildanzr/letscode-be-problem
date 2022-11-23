const { ClientError } = require('../errors')
const { CompeteProblem } = require('../models')

class CompeteProblemService {
  constructor () {
    this.name = 'CompeteProblemService'
  }

  async findCompeteProblemById (_id) {
    return await CompeteProblem.findById(_id)
  }

  async createCompeteProblem (payload) {
    return await CompeteProblem.create(payload)
  }

  async updateCompeteProblem (_id, payload) {
    return await CompeteProblem.findByIdAndUpdate(_id, payload, { new: true })
  }

  async deleteCompeteProblem (_id) {
    return await CompeteProblem.findByIdAndDelete(_id)
  }

  async getCompeteProblemDetail (_id) {
    const competeProblem = await CompeteProblem.findById(_id)
      .populate([
        {
          path: 'problemId',
          select: '_id challenger title description constraint inputFormat outputFormat',
          populate: [
            { path: 'challenger', select: '_id username' },
            { path: 'sampleCases', select: '_id input output explanation' },
            { path: 'testCases', select: '_id input output' }
          ]
        }
      ])
      .select('problemId maxPoint')
      .exec()

    if (!competeProblem) throw new ClientError('Compete problem not found', 404)

    return competeProblem
  }
}

module.exports = {
  CompeteProblemService
}
