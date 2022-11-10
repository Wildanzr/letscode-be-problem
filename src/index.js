require('dotenv').config()

// Database
const mongoose = require('mongoose')

// Cors
const cors = require('cors')

// Init express
const express = require('express')
const app = express()

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

// Simple route
app.get('/api/v1/problems', (req, res) => {
  res.send('Hello World')
})

const PORT = process.env.PORT || 5003
// Listen to port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
