const { ClientError } = require('../errors')
const { logger } = require('../utils/logger')

class CompeteProblemController {
  constructor (competeProblemService, problemSubmissionService, submissionService, userService, validator, response, tokenize) {
    this.name = 'competeProblemController'
    this._competeProblemService = competeProblemService
    this._problemSubmissionService = problemSubmissionService
    this._submissionService = submissionService
    this._userService = userService
    this._validator = validator
    this._response = response
    this._tokenize = tokenize

    // Bind methods
    this.getSubmissionsInCP = this.getSubmissionsInCP.bind(this)
    this.getSubmissionDetailInCP = this.getSubmissionDetailInCP.bind(this)
    this.getLeaderboardInCP = this.getLeaderboardInCP.bind(this)
    this.checkCPIsDone = this.checkCPIsDone.bind(this)
  }

  async getSubmissionsInCP (req, res) {
    const token = req.headers.authorization
    const { competeProblemId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)

      // Validate payload
      this._validator.validateGetSubmissionInCP({ competeProblemId })

      // Get submissions list
      const submissions = await this._problemSubmissionService.getSubmissionsInCP(competeProblemId, _id)

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan data pengumpulan.', submissions)

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async getSubmissionDetailInCP (req, res) {
    const token = req.headers.authorization
    const { submissionId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)

      // Validate payload
      this._validator.validateGetSubmissionDetail({ submissionId })

      // Get submissions list
      const submission = await this._submissionService.getSubmissionDetail(submissionId)

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan detail data pengumpulan.', { submission })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async getLeaderboardInCP (req, res) {
    const { competeProblemId } = req.params
    const { page, limit } = req.query

    try {
      // Validate cp page and limit
      this._validator.validateGetLeaderboard({ competeProblemId, page, limit })

      // Get leaderboards
      const { leaderboard, total } = await this._problemSubmissionService.getLeaderboardInCP(competeProblemId, page, limit)

      // Meta data
      const meta = {
        total: parseInt(total),
        limit: parseInt(limit),
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
      }

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan papan peringkat permasalahan dalam kompetisi.', { leaderboard }, meta)

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async checkCPIsDone (req, res) {
    const token = req.headers.authorization
    const { competeProblemId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)

      // Validate payload
      this._validator.validateGetSubmissionInCP({ competeProblemId })

      // Check cp is solved, try again or not
      const isDone = await this._problemSubmissionService.checkCPIsDone(competeProblemId, _id)

      // Response
      const response = this._response.success(200, 'Berhasil mengecek kemajuan permasalahan dalam kompetisi.', { isDone })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }
}

module.exports = {
  CompeteProblemController
}
