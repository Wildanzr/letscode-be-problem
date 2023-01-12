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

  async getStudentsData (query) {
    let { q, page, limit } = query
    if (q === '' || q === undefined) q = ''

    // Get student data based on query
    const students = await User.find({
      fullName: { $regex: q, $options: 'i' },
      role: 0,
      isVerified: true
    }).skip((page - 1) * limit)
      .limit(limit)
      .sort({ fullName: 1 })
      .select('_id fullName username avatar point')
      .exec()

    // Count total students
    const total = await User.countDocuments({
      fullName: { $regex: q, $options: 'i' },
      role: 0,
      isVerified: true
    })

    return { students, total }
  }
}

module.exports = {
  UserService
}
