const { Compete, User } = require('../models')

class CompeteService {
  constructor () {
    this.name = 'CompeteService'
  }

  async findUserById (_id) {
    return await User.findById(_id)
  }

  async createCompete (payload) {
    return await Compete.create(payload)
  }

  async getCompeteById (_id) {
    return await Compete.findById(_id)
  }
}

module.exports = {
  CompeteService
}
