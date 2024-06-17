require('dotenv').config()

const cron = require('node-cron')
const { logger } = require('./utils/logger')

// Init express
const express = require('express')
const app = express()

// Database
const mongoose = require('mongoose')

// Cors
const cors = require('cors')

// Services
const { ProblemService, SampleCaseService, TestCaseService, CompeteService, CompeteProblemService, UserService, ProblemSubmissionService, SubmissionService, MaterialService } = require('./services')
const problemService = new ProblemService()
const sampleCaseService = new SampleCaseService()
const testCaseService = new TestCaseService()
const competeService = new CompeteService()
const competeProblemService = new CompeteProblemService()
const userService = new UserService()
const problemSubmissionService = new ProblemSubmissionService()
const submissionService = new SubmissionService()
const materialService = new MaterialService()

// Utils
const { Response, Tokenize } = require('./utils')
const response = new Response()
const tokenize = new Tokenize()

// Validator
const { Validator } = require('./validators')
const validator = new Validator()

// Controllers
const { ProblemController, CompeteController, CompeteProblemController, MaterialController } = require('./controllers')
const problemController = new ProblemController(problemService, sampleCaseService, testCaseService, validator, response, tokenize)
const competeController = new CompeteController(competeService, competeProblemService, problemSubmissionService, problemService, testCaseService, sampleCaseService, userService, validator, response, tokenize)
const competeProblemController = new CompeteProblemController(competeProblemService, problemSubmissionService, submissionService, userService, validator, response, tokenize)
const materialController = new MaterialController(materialService, validator, response, tokenize)

// Routes
const { ProblemRoutes, CompeteRoutes, CompeteProblemRoutes, MaterialRoutes } = require('./routes')
const problemRoutes = new ProblemRoutes(express, problemController)
const competeRoutes = new CompeteRoutes(express, competeController)
const competeProblemRoutes = new CompeteProblemRoutes(express, competeProblemController)
const materialRoutes = new MaterialRoutes(express, materialController)

// Use body parser
app.use(express.json())

// Use cors
app.use(cors())

const DB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/letscode'

// Connect to mongodb
mongoose.connect(DB_URL, {
  useNewURLParser: true,
  useUnifiedTopology: true
}).then(logger.info('Connected to database'))
  .catch(err => logger.error(err))

// Use routes
app.use('/api/v1/problems', problemRoutes.router)
app.use('/api/v1/competes', competeRoutes.router)
app.use('/api/v1/compete-problems', competeProblemRoutes.router)
app.use('/api/v1/materials', materialRoutes.router)

// Init challenge data
competeController.initChallengeData()

// Cron job update student progress
const task = cron.schedule('0 0 * * *', () => {
  logger.info('Start cron job update student progress')
  competeController.cronJobUpdateStudentProgress()
}, {
  scheduled: true,
  timezone: 'Asia/Jakarta'
})
task.start()

const PORT = process.env.PORT || 5003
// Listen to port
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
