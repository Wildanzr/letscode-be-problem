const { model, Schema } = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 15)

const submissionSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `sbm-${nanoid(15)}` }
  },
  code: { type: String, required: true },
  languageCode: { type: Number, required: true },
  // tokens is an array of string
  tokens: { type: [String], required: true, default: [] },
  status: { type: Number, required: true, default: 0 },
  point: { type: Number, required: true, default: 0 },
  submitAt: { type: Date, default: () => { return new Date() } }
})

// Create model
const Submission = model('submissions', submissionSchema)

module.exports = {
  Submission,
  submissionSchema
}
