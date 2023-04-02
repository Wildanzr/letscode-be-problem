const { ClientError } = require('../errors')
const { logger } = require('../utils/logger')

class CompeteController {
  constructor (competeService, competeProblemService, problemSubmissionService, problemService, testCaseService, sampleCaseService, userService, validator, response, tokenize) {
    this.name = 'CompeteController'
    this._competeService = competeService
    this._competeProblemService = competeProblemService
    this._problemSubmissionService = problemSubmissionService
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
    this.searchCompeteProblems = this.searchCompeteProblems.bind(this)
    this.checkCompeteProgress = this.checkCompeteProgress.bind(this)
    this.checkOverallProgress = this.checkOverallProgress.bind(this)
    this.getOverallLeaderboard = this.getOverallLeaderboard.bind(this)
    this.joinCompete = this.joinCompete.bind(this)
    this.checkJoinedCompete = this.checkJoinedCompete.bind(this)
    this.getCompeteLeaderboard = this.getCompeteLeaderboard.bind(this)

    this.getCompeteProblem = this.getCompeteProblem.bind(this)
    this.createCompeteProblem = this.createCompeteProblem.bind(this)
    this.updateCompeteProblem = this.updateCompeteProblem.bind(this)
    this.deleteCompeteProblem = this.deleteCompeteProblem.bind(this)
    this.getDashboardStats = this.getDashboardStats.bind(this)
    this.getStudentsData = this.getStudentsData.bind(this)
    this.getStudentProgressData = this.getStudentProgressData.bind(this)

    this.initChallengeData = this.initChallengeData.bind(this)
  }

  // Competes
  async createCompete (req, res) {
    const token = req.headers.authorization
    const payload = req.body

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      if (payload.start !== null || payload.end !== null) {
        // Check if start time is greater than end time
        if (payload.start > payload.end) throw new ClientError('Waktu mulai harus kurang dari waktu selesai.', 400)
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
      const response = this._response.success(201, 'Kompetisi berhasil dibuat.', { compete })

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
      const response = this._response.success(200, 'Berhasil mendapatkan data kompetisi.', { competes }, meta)

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
      const response = this._response.success(200, 'Berhasil mendapatkan data kompetisi.', { compete })

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
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Kompetisi tidak ditemukan.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Otorisasi ditolak untuk memperbarui kompetisi.', 401)

      if (payload.start !== null || payload.end !== null) {
        // Check if start time is greater than end time
        if (payload.start > payload.end) throw new ClientError('Waktu mulai harus kurang dari waktu selesai.', 400)
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
      const response = this._response.success(200, 'Berhasil memperbarui kompetisi.', { compete: updatedCompete })

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
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Kompetisi tidak ditemukan.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Otorisasi ditolak untuk memperbarui kompetisi.', 401)

      // Validate payload
      this._validator.validateGetCompete({ competeId })

      const competeProblems = compete.problems

      // Delete compete problems, problem, sample case, and test case
      for (const cp of competeProblems) {
        const competeProblem = await this._competeProblemService.findCompeteProblemById(cp)
        if (!competeProblem) throw new ClientError('Permasalahan dalam kompetisi tidak ditemukan.', 404)
        const { problemId } = competeProblem

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

        // Delete compete problem
        await competeProblem.remove()

        // Delete problem
        await problem.remove()
      }

      // Delete compete
      await this._competeService.deleteCompete(competeId)

      // Response
      const response = this._response.success(200, 'Berhasil menghapus kompetisi.')

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
      const response = this._response.success(200, 'Berhasil mendapatkan data permasalahan dalam kompetisi.', problems)

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async searchCompeteProblems (req, res) {
    const { competeId } = req.params
    let { q, page, limit } = req.query

    if (q === undefined || q === null || q === '') q = ''
    if (page === undefined || page === null || page === '') page = 1
    if (limit === undefined || limit === null || limit === '') limit = 10

    try {
      // Validate payload
      this._validator.validateGetCompete({ competeId })

      // Get compete problems
      const { compete, total } = await this._competeService.searchCompeteProblems(competeId, { q, page, limit })

      // Meta data
      const meta = {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPage: Math.ceil(total / limit)
      }

      // Response
      const response = this._response.success(200, 'Pencarian permasalahan dalam kompetisi berhasil.', compete, meta)

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
      const response = this._response.success(200, 'Berhasil mendaptakan data permasalahan dalam kompetisi.', { competeProblem })

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
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Kompetisi tidak ditemukan.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Otorisasi ditolak untuk membuat permasalahan dalam kompetisi ini.', 401)

      // Check if problem exists
      const problem = await this._problemService.findProblemById(payload.problemId)
      if (!problem) throw new ClientError('Permasalahan tidak ditemukan.', 404)

      // Validate payload
      payload.competeId = competeId
      this._validator.validateCreateCompeteProblem(payload)

      // Create compete problem
      const competeProblem = await this._competeProblemService.createCompeteProblem(payload)

      // Insert compete problem to compete
      compete.problems.push(competeProblem._id)
      await compete.save()

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan data permasalahan dalam kompetisi.')

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
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Kompetisi tidak ditemukan.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Otorisasi ditolak untuk memperbarui permasalahan dalam kompetisi ini.', 401)

      // Check if problem exists
      const problem = await this._competeProblemService.findCompeteProblemById(competeProblemId)
      if (!problem) throw new ClientError('Permasalahan dalam kompetisi tidak ditemukan.', 404)

      // Validate payload
      this._validator.validateUpdateCompeteProblem(payload)

      // Update compete problem
      await this._competeProblemService.updateCompeteProblem(competeProblemId, payload)

      // Response
      const response = this._response.success(200, 'Berhasil memperbarui data permasalahan dalam kompetisi.')

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
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak.', 403)

      // Get compete by id
      const compete = await this._competeService.findCompeteById(competeId)
      if (!compete) throw new ClientError('Kompetisi tidak ditemukan.', 404)

      // Make sure user is the owner of the compete
      if (compete.challenger !== _id) throw new ClientError('Unauthorize to delete this problem compete.', 401)

      // Check if compete problem exists
      const competeProblem = await this._competeProblemService.findCompeteProblemById(competeProblemId)
      if (!competeProblem) throw new ClientError('Permasalahan dalam kompetisi tidak ditemukan.', 404)

      // Get problem
      const problem = await this._problemService.getProblemById(competeProblem.problemId)
      if (!problem) throw new ClientError('Permasalahan tidak ditemukan.', 404)

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

  // Other methods
  async checkCompeteProgress (req, res) {
    const token = req.headers.authorization
    const { competeId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)

      // Validate payload
      this._validator.validateGetCompete({ competeId })

      // Get compete problems
      const compete = await this._competeService.getCompeteProblems(competeId)
      const { problems } = compete

      // Count progress
      let solved = 0
      const total = problems.length
      for (const problem of problems) {
        const isDone = await this._problemSubmissionService.checkCPIsDone(problem._id, _id)
        if (isDone === 2) solved++
      }

      // Response
      const response = this._response.success(200, 'Berhasil mengecek statistik kemajuan.', { solved, total })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async checkOverallProgress (req, res) {
    const token = req.headers.authorization

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)

      // Get all compete journeys
      const journeys = await this._competeService.getAllJourneys()

      // Count progress
      let solved = 0
      let total = 0

      // Iterate journeys
      for (const journey of journeys) {
        const { problems } = journey
        total += problems.length

        // Iterate problems
        for (const problem of problems) {
          const isDone = await this._problemSubmissionService.checkCPIsDone(problem, _id)
          if (isDone === 2) solved++
        }
      }

      // Count progress as percentage with 2 decimal places
      const progress = parseFloat((solved / total * 100).toFixed(2))

      // Payload
      const payload = {
        progress,
        point: user.point
      }

      // Response
      const response = this._response.success(200, 'Berhasil mengecek kemajuan belajar.', payload)

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async getOverallLeaderboard (req, res) {
    try {
      const users = await this._userService.getTop25Leaderboard()

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan data papan peringkat.', users)

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async joinCompete (req, res) {
    const token = req.headers.authorization
    const { competeId } = req.params
    const { key } = req.body

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)

      // Validate payload
      this._validator.validateJoinCompete({ competeId, key })

      // Join compete
      await this._competeService.joinCompete(competeId, _id, key)

      // Response
      const response = this._response.success(200, 'Berhasil bergabung kompetisi.')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async checkJoinedCompete (req, res) {
    const token = req.headers.authorization
    const { competeId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)

      // Validate payload
      this._validator.validateGetCompete({ competeId })

      // Check joined compete
      const isJoined = await this._competeService.checkJoinedCompete(competeId, _id)

      // Response
      const response = this._response.success(200, 'Berhasil mengecek keikutsertaan kompetisi.', { isJoined })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async getCompeteLeaderboard (req, res) {
    const { competeId } = req.params

    try {
      // Validate payload
      this._validator.validateGetCompete({ competeId })

      // Get all participants in compete
      const { participants, problems } = await this._competeService.getCompeteParticipantsAndCPs(competeId)

      // Iterate participants to get their point in compete
      const leaderboard = []
      for (const participant of participants) {
        let point = 0
        for (const problem of problems) {
          const currentPoint = await this._problemSubmissionService.getCPPoint(participant._id, problem)
          point += currentPoint
        }

        // Push participant to leaderboard
        leaderboard.push({
          username: participant.username,
          avatar: participant.avatar,
          point
        })
      }

      // Sort leaderboard
      leaderboard.sort((a, b) => b.point - a.point)

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan data papan peringkat kompetisi.', { leaderboard })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async getDashboardStats (req, res) {
    const token = req.headers.authorization

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)

      // Get total students and teachers
      const userStatistics = await this._userService.getTotalTeacherAndStudent()

      // Get total problems, competes, and submissions
      const problemStatistics = await this._problemService.getDashboardStats()

      // Statistics payload
      const payload = {
        ...userStatistics,
        ...problemStatistics
      }

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan data statistik dashboard.', payload)
      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async getStudentsData (req, res) {
    const { q, page, limit } = req.query
    const token = req.headers.authorization

    try {
      // Validate payload
      this._validator.validateGetStudentsData({ q, page, limit })

      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid.', 401)

      // Get all students
      const { students, total } = await this._userService.getStudentsData({ q, page, limit })

      // Meta data
      const meta = {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPage: Math.ceil(total / limit)
      }

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan data peserta didik.', students, meta)

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async getStudentProgressData (req, res) {
    const { studentId } = req.params

    try {
      // Get all compete journeys
      const journeys = await this._competeService.getAllJourneys()

      // Count progress
      let solved = 0
      let total = 0

      // Iterate journeys
      for (const journey of journeys) {
        const { problems } = journey
        total += problems.length

        // Iterate problems
        for (const problem of problems) {
          const isDone = await this._problemSubmissionService.checkCPIsDone(problem, studentId)
          if (isDone === 2) solved++
        }
      }

      // Count progress as percentage with 2 decimal places
      const progress = parseFloat((solved / total * 100).toFixed(2))

      // Response
      const response = this._response.success(200, 'Berhasil mengecek kemajuan belajar.', { progress })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      return this._response.error(res, error)
    }
  }

  async initChallengeData () {
    try {
      logger('Start init challenge data')

      // Check if any challenge data is already exist
      logger('Checking any challenge data')
      if (await this._competeService.checkChallengeIsExist()) throw new ClientError('Challenge data is already exist.', 400)

      // Create challenge data
      logger('Creating challenge data')
      const SPECIAL_ID = process.env.SUPER_ID || 'usr-superadmin'
      const payload = {
        challenger: SPECIAL_ID,
        name: 'Challenge',
        start: null,
        end: null,
        description: 'Challenge',
        isLearnPath: false,
        isChallenge: true,
        problems: []
      }
      await this._competeService.createCompete(payload)

      logger('Finish init challenge data')
      logger('--------------------------------')
    } catch (error) {
      logger(error)
    }
  }
}

module.exports = {
  CompeteController
}
