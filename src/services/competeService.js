const { Compete } = require('../models')
const { ClientError } = require('../errors')

class CompeteService {
  constructor () {
    this.name = 'CompeteService'
  }

  async findCompeteById (_id) {
    return await Compete.findById(_id)
  }

  async createCompete (payload) {
    return await Compete.create(payload)
  }

  async getCompeteById (_id) {
    return await Compete.findById(_id)
  }

  async getCompetes (query) {
    let { q, on, isLearnPath, isChallenge, page, limit, challengerId, participantId } =
      query

    if (q === '' || q === undefined) q = ''
    if (challengerId === '' || challengerId === undefined) challengerId = ''
    if (participantId === '' || participantId === undefined) participantId = ''

    if (
      isLearnPath === 'false' ||
      isLearnPath === 'no' ||
      isLearnPath === 0 ||
      isLearnPath === '0' ||
      isLearnPath === '' ||
      isLearnPath === undefined
    ) { isLearnPath = false } else if (
      isLearnPath === 'true' ||
      isLearnPath === 'yes' ||
      isLearnPath === 1 ||
      isLearnPath === '1'
    ) { isLearnPath = true } else isLearnPath = true

    if (
      isChallenge === 'false' ||
      isChallenge === 'no' ||
      isChallenge === 0 ||
      isChallenge === '0' ||
      isChallenge === '' ||
      isChallenge === undefined
    ) { isChallenge = false } else if (
      isChallenge === 'true' ||
      isChallenge === 'yes' ||
      isChallenge === 1 ||
      isChallenge === '1'
    ) { isChallenge = true } else isChallenge = true

    if (
      on === 'true' ||
      on === 'yes' ||
      on === 1 ||
      on === '1' ||
      on === '' ||
      on === undefined
    ) { on = true } else if (on === 'false' || on === 'no' || on === 0 || on === '0') { on = false } else on = true

    // Get competes based on query
    const competes = await Compete.find({
      name: { $regex: q, $options: 'i' },
      participants:
        participantId === '' ? { $exists: true } : { $in: [participantId] },
      challenger: challengerId === '' ? { $exists: true } : challengerId,
      end: on ? { $gte: new Date() } : { $lte: new Date() },
      isLearnPath,
      isChallenge
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ name: 1 })
      .populate([
        { path: 'participants', select: '_id username avatar' },
        { path: 'challenger', select: '_id username avatar' }
      ])
      .select(
        '_id name start end description isLearnPath problems leaderboard languageAllowed participants key'
      )
      .exec()

    const total = await Compete.countDocuments({
      name: { $regex: q, $options: 'i' },
      participants:
        participantId === '' ? { $exists: true } : { $in: [participantId] },
      challenger: challengerId === '' ? { $exists: true } : challengerId,
      end: on ? { $gte: new Date() } : { $lte: new Date() },
      isLearnPath,
      isChallenge
    })

    return { competes, total }
  }

  async getCompete (_id) {
    const compete = await Compete.findById(_id)
      .populate([
        { path: 'participants', select: '_id username avatar' },
        { path: 'challenger', select: '_id username avatar' }
      ])
      .select(
        '_id name start end description isLearnPath problems leaderboard languageAllowed participants key'
      )
      .exec()

    if (!compete) throw new ClientError('Compete not found.', 404)

    return compete
  }

  async updateCompete (_id, payload) {
    return await Compete.findByIdAndUpdate(_id, payload, { new: true })
  }

  async deleteCompete (_id) {
    return await Compete.findByIdAndDelete(_id)
  }

  async getCompeteProblems (_id) {
    const compete = await Compete.findById(_id)
      .populate([
        {
          path: 'problems',
          select: 'problemId maxPoint',
          populate: {
            path: 'problemId',
            select: '_id title difficulty'
          }
        }
      ])
      .select('problems')
      .exec()

    if (!compete) throw new ClientError('Compete not found.', 404)

    return compete
  }

  async searchCompeteProblems (_id, query) {
    const { q, page, limit } = query

    const compete = await Compete.findById(_id)
      .populate([
        {
          path: 'problems',
          select: 'problemId maxPoint',
          populate: {
            path: 'problemId',
            select: '_id title difficulty',
            match: { title: { $regex: q, $options: 'i' } }
          }
        }
      ])
      .select('problems')
      .exec()

    if (!compete) throw new ClientError('Compete not found.', 404)

    // Filter based on query
    let problems = compete.problems
      .filter(problem => problem.problemId !== null)

    // Count total
    const total = problems.length

    // Paginate
    if (total > limit) {
      problems = problems
        .slice((page - 1) * limit, page * limit)
    }

    // Assing problems to compete
    compete.problems = problems

    return { compete, total }
  }
}

module.exports = {
  CompeteService
}
