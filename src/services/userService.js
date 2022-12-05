const { User } = require('../models')

class UserService {
  constructor () {
    this.name = 'UserService'
  }

  async findUserById (_id) {
    return await User.findById(_id)
  }

  async getTop25Leaderboard () {
    return await User.find({ role: 0, isVerified: true })
      .sort({ score: -1 })
      .limit(25)
      .select('username avatar point')
      .lean()
  }
}

module.exports = {
  UserService
}
