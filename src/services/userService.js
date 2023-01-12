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
      .sort({ point: -1 })
      .limit(25)
      .select('username avatar point')
      .lean()
  }

  async getTotalTeacherAndStudent () {
    // get all users only role property but isVerified is true, then count the number of teacher and student
    const users = await User.find({ isVerified: true })
      .select('role')
      .lean()

    const totalTeacher = users.filter(user => user.role === 1).length
    const totalStudent = users.filter(user => user.role === 0).length

    return { totalTeacher, totalStudent }
  }
}

module.exports = {
  UserService
}
