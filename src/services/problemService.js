const { User, Problem } = require('../models')

class ProblemService {
  constructor () {
    this.name = 'ProblemService'
  }

  async findUserById (_id) {
    return await User.findById(_id)
  }

  async createProblem (payload) {
    return await Problem.create(payload)
  }

  async getProblemById (id) {
    return await Problem.findById(id)
  }

  async getProblemDataById (id) {
    const problem = await Problem.findById(id)
      .populate([
        { path: 'challenger', select: '_id username' },
        { path: 'sampleCases', select: '_id input output explanation' },
        { path: 'testCases', select: '_id input output' }
      ])
      .select('_id challenger title description difficulty constraint inputFormat outputFormat sampleCases testCases')
      .exec()

    return problem
  }

  async updateProblemById (id, payload) {
    return await Problem.findByIdAndUpdate(id, payload, { new: true })
  }
}

module.exports = {
  ProblemService
}
