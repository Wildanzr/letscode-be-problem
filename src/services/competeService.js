const { Compete, User } = require('../models')
const { ClientError } = require('../errors')

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
    let { q, on, isLearnPath, page, limit, challengerId, participantId } = query

    if (q === '' || q === undefined) q = ''
    if (challengerId === '' || challengerId === undefined) challengerId = ''
    if (participantId === '' || participantId === undefined) participantId = ''

    if (isLearnPath === 'false' || isLearnPath === 'no' || isLearnPath === 0 || isLearnPath === '0' || isLearnPath === '' || isLearnPath === undefined) isLearnPath = false
    else if (isLearnPath === 'true' || isLearnPath === 'yes' || isLearnPath === 1 || isLearnPath === '1') isLearnPath = true
    else isLearnPath = true

    if (on === 'true' || on === 'yes' || on === 1 || on === '1' || on === '' || on === undefined) on = true
    else if (on === 'false' || on === 'no' || on === 0 || on === '0') on = false
    else on = true

    // Get competes based on query
    const competes = await Compete.find({
      name: { $regex: q, $options: 'i' },
      participants: participantId === '' ? { $exists: true } : { $in: [participantId] },
      challenger: challengerId === '' ? { $exists: true } : challengerId,
      end: on ? { $gte: new Date() } : { $lte: new Date() },
      isLearnPath
    }).skip((page - 1) * limit)
      .limit(limit)
      .sort({ name: 1 })
      .populate([
        { path: 'participants', select: '_id username avatar' },
        { path: 'challenger', select: '_id username avatar' }
      ])
      .select('_id name start end description isLearnPath problems leaderboard languageAllowed participants key')
      .exec()

    const total = await Compete.countDocuments({
      name: { $regex: q, $options: 'i' },
      participants: participantId === '' ? { $exists: true } : { $in: [participantId] },
      challenger: challengerId === '' ? { $exists: true } : challengerId,
      end: on ? { $gte: new Date() } : { $lte: new Date() },
      isLearnPath
    })

    return { competes, total }
  }

  async getCompete (_id) {
    const compete = await Compete.findById(_id)
      .populate([
        { path: 'participants', select: '_id username avatar' },
        { path: 'challenger', select: '_id username avatar' }
      ])
      .select('_id name start end description isLearnPath problems leaderboard languageAllowed participants key')
      .exec()

    if (!compete) throw new ClientError('Compete not found.', 404)

    return compete
  }
}

module.exports = {
  CompeteService
}
