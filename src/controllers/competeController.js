const { ClientError } = require('../errors')

class CompeteController {
  constructor (competeService, competeProblemService, validator, response, tokenize) {
    this.name = 'CompeteController'
    this._competeService = competeService
    this._competeProblemService = competeProblemService
    this._validator = validator
    this._response = response
    this._tokenize = tokenize

    // Bind function
    this.createCompete = this.createCompete.bind(this)
    this.getCompetes = this.getCompetes.bind(this)
    this.getCompete = this.getCompete.bind(this)
    this.updateCompete = this.updateCompete.bind(this)
    this.deleteCompete = this.deleteCompete.bind(this)

    this.createCompeteProblem = this.createCompeteProblem.bind(this)
    this.updateCompeteProblem = this.updateCompeteProblem.bind(this)
  }

  // Competes
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

      // If start time is null, set it to now and set end time for year 2100
      if (payload.start === null) {
        payload.start = new Date()
        payload.end = new Date(2100, 1, 1)
      }

      // Validate payload
      payload.challenger = _id
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
    const { q, on, isLearnPath, page, limit, challengerId, participantId } = req.query

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._competeService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)

      // Validate payload
      this._validator.validateGetCompetes({ q, on, isLearnPath, page, limit, challengerId, participantId })

      // Get competes
      const { competes, total } = await this._competeService.getCompetes({ q, on, isLearnPath, page, limit, challengerId, participantId })

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

  async getCompete (req, res) {
    const token = req.headers.authorization
    const { competeId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._competeService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)

      // Validate payload
      this._validator.validateGetCompete({ competeId })

      // Get compete
      const compete = await this._competeService.getCompete(competeId)

      // Response
      const response = this._response.success(200, 'Get compete successfully.', { compete })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async updateCompete (req, res) {
    const token = req.headers.authorization
    const { competeId } = req.params
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

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Compete not found.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Unauthorize to update this compete.', 401)

      if (payload.start !== null || payload.end !== null) {
        // Check if start time is greater than end time
        if (payload.start > payload.end) throw new ClientError('Start time must be less than end time.', 400)
      }

      // If start time is null, set it to now and set end time for year 2100
      if (payload.start === null) {
        payload.start = new Date()
        payload.end = new Date(2100, 1, 1)
      }

      // Validate payload
      payload.challenger = _id
      this._validator.validateCreateCompete(payload)

      // Update compete
      const updatedCompete = await this._competeService.updateCompete(competeId, payload)

      // Response
      const response = this._response.success(200, 'Update compete successfully.', { compete: updatedCompete })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async deleteCompete (req, res) {
    const token = req.headers.authorization
    const { competeId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._competeService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Compete not found.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Unauthorize to update this compete.', 401)

      // Validate payload
      this._validator.validateGetCompete({ competeId })

      // TODO: iterate problems and delete it

      // Delete compete
      await this._competeService.deleteCompete(competeId)

      // Response
      const response = this._response.success(200, 'Delete compete successfully.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  // Compete Problem
  async createCompeteProblem (req, res) {
    const token = req.headers.authorization
    const { competeId } = req.params
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

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Compete not found.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Unauthorize to update this compete.', 401)

      // Check if problem exists
      const problem = await this._competeProblemService.findProblemById(payload.problemId)
      if (!problem) throw new ClientError('Problem not found.', 404)

      // Validate payload
      payload.competeId = competeId
      this._validator.validateCreateCompeteProblem(payload)

      // Create compete problem
      const competeProblem = await this._competeProblemService.createCompeteProblem(payload)

      // Insert compete problem to compete
      compete.problems.push(competeProblem._id)
      await compete.save()

      // Response
      const response = this._response.success(200, 'Create compete problem successfully.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async updateCompeteProblem (req, res) {
    const token = req.headers.authorization
    const { competeId, competeProblemId } = req.params
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

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Compete not found.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Unauthorize to update this compete.', 401)

      // Check if problem exists
      const problem = await this._competeProblemService.findCompeteProblemById(competeProblemId)
      if (!problem) throw new ClientError('Compete problem not found.', 404)

      // Validate payload
      this._validator.validateUpdateCompeteProblem(payload)

      // Update compete problem
      await this._competeProblemService.updateCompeteProblem(competeProblemId, payload)

      // Response
      const response = this._response.success(200, 'Update compete problem successfully.')

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
