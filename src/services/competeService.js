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

  async getCompetes (query) {
    let { q, page, limit, challengerId, participantId } = query

    if (q === '' || q === undefined) q = ''
    if (challengerId === '' || challengerId === undefined) challengerId = ''
    if (participantId === '' || participantId === undefined) participantId = ''

    // Get competes based on query
    const competes = await Compete.find({
      name: { $regex: q, $options: 'i' }
    }).skip((page - 1) * limit)
      .limit(limit)
      .sort({ name: 1 })
      .select('_id name start end description isLearnPath problems leaderboard languageAllowed key')
      .exec()

    const total = await Compete.countDocuments({
      name: { $regex: q, $options: 'i' }
    })

    return { competes, total }
  }
}

module.exports = {
  CompeteService
}
