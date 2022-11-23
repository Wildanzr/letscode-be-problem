const { ClientError } = require('../errors')

class CompeteController {
  constructor (competeService, competeProblemService, problemService, testCaseService, sampleCaseService, userService, validator, response, tokenize) {
    this.name = 'CompeteController'
    this._competeService = competeService
    this._competeProblemService = competeProblemService
    this._problemService = problemService
    this._testCaseService = testCaseService
    this._sampleCaseService = sampleCaseService
    this._userService = userService
    this._validator = validator
    this._response = response
    this._tokenize = tokenize

    // Bind function
    this.createCompete = this.createCompete.bind(this)
    this.getCompetes = this.getCompetes.bind(this)
    this.getCompete = this.getCompete.bind(this)
    this.updateCompete = this.updateCompete.bind(this)
    this.deleteCompete = this.deleteCompete.bind(this)
    this.getCompeteProblems = this.getCompeteProblems.bind(this)

    this.getCompeteProblem = this.getCompeteProblem.bind(this)
    this.createCompeteProblem = this.createCompeteProblem.bind(this)
    this.updateCompeteProblem = this.updateCompeteProblem.bind(this)
    this.deleteCompeteProblem = this.deleteCompeteProblem.bind(this)
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
      const user = await this._userService.findUserById(_id)
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
    const { q, on, isLearnPath, isChallenge, page, limit, challengerId, participantId } = req.query

    try {
      // Validate payload
      this._validator.validateGetCompetes({ q, on, isLearnPath, isChallenge, page, limit, challengerId, participantId })

      // Get competes
      const { competes, total } = await this._competeService.getCompetes({ q, on, isLearnPath, isChallenge, page, limit, challengerId, participantId })

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
    const { competeId } = req.params

    try {
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
      const user = await this._userService.findUserById(_id)
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
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Compete not found.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Unauthorize to update this compete.', 401)

      // Validate payload
      this._validator.validateGetCompete({ competeId })

      const competeProblems = compete.problems

      // Delete compete problems, problem, sample case, and test case
      for (const cp of competeProblems) {
        const competeProblem = await this._competeProblemService.findCompeteProblemById(cp)
        if (!competeProblem) throw new ClientError('Compete problem not found.', 404)
        const { problemId } = competeProblem

        const problem = await this._problemService.getProblemById(problemId)
        if (!problem) throw new ClientError('Problem not found.', 404)

        // Iterate problem test cases, then delete it
        for (const testCaseId of problem.testCases) {
          await this._testCaseService.deleteTestCaseById(testCaseId)
        }

        // Iterate problem sample cases, then delete it
        for (const sampleCaseId of problem.sampleCases) {
          await this._sampleCaseService.deleteSampleCaseById(sampleCaseId)
        }

        // Delete compete problem
        await competeProblem.remove()

        // Delete problem
        await problem.remove()
      }

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

  async getCompeteProblems (req, res) {
    const { competeId } = req.params

    try {
      // Validate payload
      this._validator.validateGetCompete({ competeId })

      // Get compete problems
      const problems = await this._competeService.getCompeteProblems(competeId)

      // Response
      const response = this._response.success(200, 'Get compete problems successfully.', problems)

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  // Compete Problem
  async getCompeteProblem (req, res) {
    const { competeProblemId } = req.params

    try {
      // Validate payload
      this._validator.validateGetCompeteProblem({ competeProblemId })

      // Get compete problem
      const competeProblem = await this._competeProblemService.getCompeteProblemDetail(competeProblemId)

      // Response
      const response = this._response.success(200, 'Get compete problem successfully.', { competeProblem })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

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
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Compete not found.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Unauthorize to create problem compete in this compete.', 401)

      // Check if problem exists
      const problem = await this._problemService.findProblemById(payload.problemId)
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
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Compete not found.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Unauthorize to update this problem compete.', 401)

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

  async deleteCompeteProblem (req, res) {
    const token = req.headers.authorization
    const { competeId, competeProblemId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Compete not found.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Unauthorize to delete this problem compete.', 401)

      // Check if compete problem exists
      const competeProblem = await this._competeProblemService.findCompeteProblemById(competeProblemId)
      if (!competeProblem) throw new ClientError('Compete problem not found.', 404)

      // Get problem
      const problem = await this._problemService.getProblemById(competeProblem.problemId)
      if (!problem) throw new ClientError('Problem not found.', 404)

      // Iterate problem test cases, then delete it
      for (const testCaseId of problem.testCases) {
        await this._testCaseService.deleteTestCaseById(testCaseId)
      }

      // Iterate problem sample cases, then delete it
      for (const sampleCaseId of problem.sampleCases) {
        await this._sampleCaseService.deleteSampleCaseById(sampleCaseId)
      }

      // Delete compete problem
      await this._competeProblemService.deleteCompeteProblem(competeProblemId)

      // Remove compete problem from compete
      const index = compete.problems.indexOf(competeProblemId)
      compete.problems.splice(index, 1)
      await compete.save()

      // Response
      const response = this._response.success(200, 'Delete compete problem successfully.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      this._response.error(res, error)
    }
  }
}

module.exports = {
  CompeteController
}
