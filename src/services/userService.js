const { User } = require('../models')

class UserService {
  constructor () {
    this.name = 'UserService'
  }

  async findUserById (_id) {
    return await User.findById(_id)
  }
}

module.exports = {
  UserService
}
