const { model, Schema } = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 15)

const sampleCasesSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `sc-${nanoid(15)}` }
  },
  input: { type: String, default: null },
  output: { type: String, required: true },
  explanation: { type: String, default: null }
})

// Create model
const SampleCase = model('sampleCases', sampleCasesSchema)

module.exports = {
  SampleCase,
  sampleCasesSchema
}
