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
}

module.exports = {
  ProblemService
}
