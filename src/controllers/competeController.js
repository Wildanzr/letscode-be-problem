const { ClientError } = require('../errors')

class CompeteController {
  constructor (competeService, validator, response, tokenize) {
    this.name = 'CompeteController'
    this._competeService = competeService
    this._validator = validator
    this._response = response
    this._tokenize = tokenize

    // Bind function
    this.createCompete = this.createCompete.bind(this)
    this.getCompetes = this.getCompetes.bind(this)
  }

  async createCompete (req, res) {
    const token = req.headers.authorization
    const payload = req.body

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._competeService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      if (payload.start !== null || payload.end !== null) {
        // Check if start time is greater than end time
        if (payload.start > payload.end) throw new ClientError('Start time must be less than end time.', 400)
      }

      // Validate payload
      this._validator.validateCreateCompete(payload)

      // Create compete
      const compete = await this._competeService.createCompete(payload)

      // Response
      const response = this._response.success(201, 'Create compete successfully.', { compete })

      // Response
      return res.status(response.statusCode || 201).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async getCompetes (req, res) {
    const token = req.headers.authorization
    const { q, on, page, limit, challengerId, participantId } = req.query

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._competeService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Validate payload
      this._validator.validateGetCompetes({ q, on, page, limit, challengerId, participantId })

      // Get competes
      const { competes, total } = await this._competeService.getCompetes({ q, on, page, limit, challengerId, participantId })

      // Meta data
      const meta = {
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit)
      }

      // Response
      const response = this._response.success(200, 'Get competes successfully.', { competes }, meta)

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }
}

module.exports = {
  CompeteController
}
