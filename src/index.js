require('dotenv').config()

// Init express
const express = require('express')
const app = express()

// Database
const mongoose = require('mongoose')

// Cors
const cors = require('cors')

// Services
const { ProblemService, SampleCaseService, TestCaseService, CompeteService, CompeteProblemService } = require('./services')
const problemService = new ProblemService()
const sampleCaseService = new SampleCaseService()
const testCaseService = new TestCaseService()
const competeService = new CompeteService()
const competeProblemService = new CompeteProblemService()

// Utils
const { Response, Tokenize } = require('./utils')
const response = new Response()
const tokenize = new Tokenize()

// Validator
const { Validator } = require('./validators')
const validator = new Validator()

// Controllers
const { ProblemController, CompeteController } = require('./controllers')
const problemController = new ProblemController(problemService, sampleCaseService, testCaseService, validator, response, tokenize)
const competeController = new CompeteController(competeService, competeProblemService, validator, response, tokenize)

// Routes
const { ProblemRoutes, CompeteRoutes } = require('./routes')
const problemRoutes = new ProblemRoutes(express, problemController)
const competeRoutes = new CompeteRoutes(express, competeController)

// Use body parser
app.use(express.json())

// Use cors
app.use(cors())

// Connect to mongodb
mongoose.connect(process.env.DATABASE_URL, {
  useNewURLParser: true,
  useUnifiedTopology: true
}).then(console.log('Connected to database'))
  .catch(err => console.log(err))

// Use routes
app.use('/api/v1/problems', problemRoutes.router)
app.use('/api/v1/competes', competeRoutes.router)

const PORT = process.env.PORT || 5003
// Listen to port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
