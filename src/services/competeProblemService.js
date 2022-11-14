// const { ClientError } = require('../errors')
const { CompeteProblem, Problem } = require('../models')

class CompeteProblemService {
  constructor () {
    this.name = 'CompeteProblemService'
  }

  async findProblemById (_id) {
    return await Problem.findById(_id)
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
}

module.exports = {
  CompeteProblemService
}
