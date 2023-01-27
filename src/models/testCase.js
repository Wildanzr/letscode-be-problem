const { model, Schema } = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 15)

const testCasesSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `tc-${nanoid(15)}` }
  },
  input: { type: String, default: null },
  output: { type: String, required: true }
})

// Create model
const TestCase = model('testCases', testCasesSchema)

module.exports = {
  TestCase,
  testCasesSchema
}
