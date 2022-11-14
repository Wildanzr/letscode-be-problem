// const { ClientError } = require('../errors')
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
}

module.exports = {
  CompeteProblemService
}
