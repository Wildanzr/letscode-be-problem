const { ClientError } = require('../errors')
const { logger } = require('../utils/logger')

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
    this.updateProblem = this.updateProblem.bind(this)
    this.deleteProblem = this.deleteProblem.bind(this)

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
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Permasalahan tidak ditemukan.', 404)

      // Validate payload
      this._validator.validateCreateProblemSampleCase(payload)

      // Create sample case
      if (payload.explanation === '') payload.explanation = null
      if (payload.input === '') payload.input = null
      const sampleCase = await this._sampleCaseService.createSampleCase(payload)

      // Insert sample case _id to problem
      problem.sampleCases.push(sampleCase._id)
      await problem.save()

      // Response
      const response = this._response.success(200, 'Berhasil membuat contoh kasus')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async getProblemSampleCase (req, res) {
    const { problemId, sampleCaseId } = req.params

    try {
      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Permasalahan tidak ditemukan.', 404)

      // Make sure sampleCaseId is exist in problem.sampleCases
      if (!problem.sampleCases.includes(sampleCaseId)) throw new ClientError('Contoh kasus tidak ditemukan.', 404)

      // Validate payload
      this._validator.validateGetProblemSampleCase({ sampleCaseId })

      // Get sample case
      const sampleCase = await this._sampleCaseService.getSampleCaseById(sampleCaseId)

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan data contoh kasus.', { sampleCase })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async deleteProblemSampleCase (req, res) {
    const token = req.headers.authorization
    const { problemId, sampleCaseId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Permasalahan tidak ditemukan.', 404)

      // Make sure sampleCaseId is exist in problem.sampleCases
      if (!problem.sampleCases.includes(sampleCaseId)) throw new ClientError('Contoh kasus tidak ditemukan.', 404)

      // Validate payload
      this._validator.validateGetProblemSampleCase({ sampleCaseId })

      // Delete sample case
      await this._sampleCaseService.deleteSampleCaseById(sampleCaseId)

      // Remove sample case _id from problem
      problem.sampleCases = problem.sampleCases.filter(id => id !== sampleCaseId)
      await problem.save()

      // Response
      const response = this._response.success(200, 'Berhasil menghapus data contoh kasus.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async updateProblemSampleCase (req, res) {
    const token = req.headers.authorization
    const payload = req.body
    const { problemId, sampleCaseId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Permasalahan tidak ditemukan.', 404)

      // Make sure sampleCaseId is exist in problem.sampleCases
      if (!problem.sampleCases.includes(sampleCaseId)) throw new ClientError('Contoh kasus tidak ditemukan.', 404)

      // Validate payload
      if (payload.explanation === '') payload.explanation = null
      if (payload.input === '') payload.input = null
      this._validator.validateCreateProblemSampleCase(payload)

      // Update sample case
      await this._sampleCaseService.updateSampleCaseById(sampleCaseId, payload)

      // Response
      const response = this._response.success(200, 'Berhasil memperbarui contoh kasus.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
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
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Permasalahan tidak ditemukan.', 404)

      // Validate payload
      this._validator.validateCreateProblemTestCase(payload)

      // Create test case
      const testCase = await this._testCaseService.createTestCase(payload)

      // Insert test case _id to problem
      problem.testCases.push(testCase._id)
      await problem.save()

      // Response
      const response = this._response.success(200, 'Berhasil membuat uji kasus.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async getProblemTestCase (req, res) {
    const { problemId, testCaseId } = req.params

    try {
      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Permasalahan tidak ditemukan.', 404)

      // Make sure testCaseId is exist in problem.testCases
      if (!problem.testCases.includes(testCaseId)) throw new ClientError('Uji kasus tidak ditemukan.', 404)

      // Validate payload
      this._validator.validateGetProblemTestCase({ testCaseId })

      // Get test case
      const testCase = await this._testCaseService.getTestCaseById(testCaseId)

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan data uji kasus.', { testCase })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async deleteProblemTestCase (req, res) {
    const token = req.headers.authorization
    const { problemId, testCaseId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Permasalahan tidak ditemukan.', 404)

      // Make sure testCaseId is exist in problem.testCases
      if (!problem.testCases.includes(testCaseId)) throw new ClientError('Uji kasus tidak ditemukan.', 404)

      // Validate payload
      this._validator.validateGetProblemTestCase({ testCaseId })

      // Delete test case
      await this._testCaseService.deleteTestCaseById(testCaseId)

      // Remove test case _id from problem
      problem.testCases = problem.testCases.filter(id => id !== testCaseId)
      await problem.save()

      // Response
      const response = this._response.success(200, 'Berhasil menghapus uji kasus.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async updateProblemTestCase (req, res) {
    const token = req.headers.authorization
    const payload = req.body
    const { problemId, testCaseId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Check problem is exist
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Permasalahan tidak ditemukan.', 404)

      // Make sure testCaseId is exist in problem.testCases
      if (!problem.testCases.includes(testCaseId)) throw new ClientError('Uji kasus tidak ditemukan.', 404)

      // Validate payload
      this._validator.validateCreateProblemTestCase(payload)

      // Update test case
      await this._testCaseService.updateTestCaseById(testCaseId, payload)

      // Response
      const response = this._response.success(200, 'Berhasil memperbarui uji kasus.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  // Problem
  async createProblem (req, res) {
    const token = req.headers.authorization
    const payload = req.body

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Validate payload
      payload.challenger = _id
      this._validator.validateCreateProblem(payload)

      // Create problem
      const problem = await this._problemService.createProblem(payload)

      // Response
      const response = this._response.success(200, 'Berhasil membuat permasalahan', { problem })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async getProblem (req, res) {
    const { problemId } = req.params

    try {
      // Validate payload
      this._validator.validateGetProblem({ problemId })

      // Get problem data
      const problem = await this._problemService.getProblemDataById(problemId)
      if (!problem) throw new ClientError('Permasalahan tidak ditemukan.', 404)

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan data permasalahan.', { problem })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async updateProblem (req, res) {
    const token = req.headers.authorization
    const payload = req.body
    const { problemId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Validate payload
      payload.challenger = _id
      this._validator.validateCreateProblem(payload)

      // Update problem
      await this._problemService.updateProblemById(problemId, payload)

      // Response
      const response = this._response.success(200, 'Berhasil memperbarui permasalahan.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async deleteProblem (req, res) {
    const token = req.headers.authorization
    const { problemId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Validate payload
      this._validator.validateGetProblem({ problemId })

      // Get problem
      const problem = await this._problemService.getProblemById(problemId)
      if (!problem) throw new ClientError('Permasalahan tidak ditemukan.', 404)

      // Iterate problem test cases, then delete it
      for (const testCaseId of problem.testCases) {
        await this._testCaseService.deleteTestCaseById(testCaseId)
      }

      // Iterate problem sample cases, then delete it
      for (const sampleCaseId of problem.sampleCases) {
        await this._sampleCaseService.deleteSampleCaseById(sampleCaseId)
      }

      // Delete problem
      await this._problemService.deleteProblemById(problemId)

      // Response
      const response = this._response.success(200, 'Berhasil menghapus permasalahan.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }
}

module.exports = {
  ProblemController
}
