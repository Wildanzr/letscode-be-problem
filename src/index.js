require('dotenv').config()

// Init express
const express = require('express')
const app = express()

// Database
const mongoose = require('mongoose')

// Cors
const cors = require('cors')

// Services
const { ProblemService } = require('./services')
const problemService = new ProblemService()

// Utils
const { Response, Tokenize } = require('./utils')
const response = new Response()
const tokenize = new Tokenize()

// Validator
const { Validator } = require('./validators')
const validator = new Validator()

// Controllers
const { ProblemController } = require('./controllers')
const problemController = new ProblemController(problemService, validator, response, tokenize)

// Routes
const { ProblemRoutes } = require('./routes')
const problemRoutes = new ProblemRoutes(express, problemController)

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

const PORT = process.env.PORT || 5003
// Listen to port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
