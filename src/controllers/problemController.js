const { ClientError } = require('../errors')

class ProblemController {
  constructor (problemService, sampleCaseService, testCaseService, validator, response, tokenize) {
    this.name = 'ProblemController'
    this._problemService = problemService
    this._sampleCaseService = sampleCaseService
    this._testCaseService = testCaseService
    this._validator = validator
    this._response = response
    this._tokenize = tokenize

    // Bind the problem methods
    this.createProblem = this.createProblem.bind(this)
    this.getProblem = this.getProblem.bind(this)

    // Bind the problem sample case methods
    this.createProblemSampleCase = this.createProblemSampleCase.bind(this)
    this.getProblemSampleCase = this.getProblemSampleCase.bind(this)
    this.deleteProblemSampleCase = this.deleteProblemSampleCase.bind(this)
    this.updateProblemSampleCase = this.updateProblemSampleCase.bind(this)

    // Bind the problem test case methods
    this.createProblemTestCase = this.createProblemTestCase.bind(this)
    this.getProblemTestCase = this.getProblemTestCase.bind(this)
    this.deleteProblemTestCase = this.deleteProblemTestCase.bind(this)
    this.updateProblemTestCase = this.updateProblemTestCase.bind(this)
  }

  // Problem Sample Case
  async createProblemSampleCase (req, res) {
    const token = req.headers.authorization
    const payload = req.body
    const { problemId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Problem not found.', 404)

      // Validate payload
      this._validator.validateCreateProblemSampleCase(payload)

      // Create sample case
      if (payload.explanation === '') payload.explanation = null
      const sampleCase = await this._sampleCaseService.createSampleCase(payload)

      // Insert sample case _id to problem
      problem.sampleCases.push(sampleCase._id)
      await problem.save()

      // Response
      const response = this._response.success(200, 'Sample case created')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async getProblemSampleCase (req, res) {
    const token = req.headers.authorization
    const { problemId, sampleCaseId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Problem not found.', 404)

      // Make sure sampleCaseId is exist in problem.sampleCases
      if (!problem.sampleCases.includes(sampleCaseId)) throw new ClientError('Sample case not found.', 404)

      // Validate payload
      this._validator.validateGetProblemSampleCase({ sampleCaseId })

      // Get sample case
      const sampleCase = await this._sampleCaseService.getSampleCaseById(sampleCaseId)

      // Response
      const response = this._response.success(200, 'Get sample case success.', { sampleCase })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async deleteProblemSampleCase (req, res) {
    const token = req.headers.authorization
    const { problemId, sampleCaseId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Problem not found.', 404)

      // Make sure sampleCaseId is exist in problem.sampleCases
      if (!problem.sampleCases.includes(sampleCaseId)) throw new ClientError('Sample case not found.', 404)

      // Validate payload
      this._validator.validateGetProblemSampleCase({ sampleCaseId })

      // Delete sample case
      await this._sampleCaseService.deleteSampleCaseById(sampleCaseId)

      // Remove sample case _id from problem
      problem.sampleCases = problem.sampleCases.filter(id => id !== sampleCaseId)
      await problem.save()

      // Response
      const response = this._response.success(200, 'Delete sample case success.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async updateProblemSampleCase (req, res) {
    const token = req.headers.authorization
    const payload = req.body
    const { problemId, sampleCaseId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Problem not found.', 404)

      // Make sure sampleCaseId is exist in problem.sampleCases
      if (!problem.sampleCases.includes(sampleCaseId)) throw new ClientError('Sample case not found.', 404)

      // Validate payload
      this._validator.validateCreateProblemSampleCase(payload)

      // Update sample case
      if (payload.explanation === '') payload.explanation = null
      await this._sampleCaseService.updateSampleCaseById(sampleCaseId, payload)

      // Response
      const response = this._response.success(200, 'Update sample case success.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  // Problem Test Case
  async createProblemTestCase (req, res) {
    const token = req.headers.authorization
    const payload = req.body
    const { problemId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Problem not found.', 404)

      // Validate payload
      this._validator.validateCreateProblemTestCase(payload)

      // Create test case
      const testCase = await this._testCaseService.createTestCase(payload)

      // Insert test case _id to problem
      problem.testCases.push(testCase._id)
      await problem.save()

      // Response
      const response = this._response.success(200, 'Test case created')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async getProblemTestCase (req, res) {
    const token = req.headers.authorization
    const { problemId, testCaseId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Problem not found.', 404)

      // Make sure testCaseId is exist in problem.testCases
      if (!problem.testCases.includes(testCaseId)) throw new ClientError('Test case not found.', 404)

      // Validate payload
      this._validator.validateGetProblemTestCase({ testCaseId })

      // Get test case
      const testCase = await this._testCaseService.getTestCaseById(testCaseId)

      // Response
      const response = this._response.success(200, 'Get test case success.', { testCase })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async deleteProblemTestCase (req, res) {
    const token = req.headers.authorization
    const { problemId, testCaseId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Problem not found.', 404)

      // Make sure testCaseId is exist in problem.testCases
      if (!problem.testCases.includes(testCaseId)) throw new ClientError('Test case not found.', 404)

      // Validate payload
      this._validator.validateGetProblemTestCase({ testCaseId })

      // Delete test case
      await this._testCaseService.deleteTestCaseById(testCaseId)

      // Remove test case _id from problem
      problem.testCases = problem.testCases.filter(id => id !== testCaseId)
      await problem.save()

      // Response
      const response = this._response.success(200, 'Delete test case success.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async updateProblemTestCase (req, res) {
    const token = req.headers.authorization
    const payload = req.body
    const { problemId, testCaseId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Problem not found.', 404)

      // Make sure testCaseId is exist in problem.testCases
      if (!problem.testCases.includes(testCaseId)) throw new ClientError('Test case not found.', 404)

      // Validate payload
      this._validator.validateCreateProblemTestCase(payload)

      // Update test case
      await this._testCaseService.updateTestCaseById(testCaseId, payload)

      // Response
      const response = this._response.success(200, 'Update test case success.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  // Problem
  async createProblem (req, res) {
    const token = req.headers.authorization
    const payload = req.body

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Validate payload
      payload.challenger = _id
      this._validator.validateCreateProblem(payload)

      // Create problem
      const problem = await this._problemService.createProblem(payload)

      // Response
      const response = this._response.success(200, 'Problem created', { problem })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async getProblem (req, res) {
    const token = req.headers.authorization
    const { problemId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Validate payload
      this._validator.validateGetProblem({ problemId })

      // Get problem data
      const problem = await this._problemService.getProblemDataById(problemId)
      if (!problem) throw new ClientError('Problem not found.', 404)

      // Response
      const response = this._response.success(200, 'Get problem success.', { problem })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }
}

module.exports = {
  ProblemController
}
