const { model, Schema } = require('mongoose')
const { nanoid } = require('nanoid')

const testCasesSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `tc-${nanoid(15)}` }
  },
  input: { type: String, required: true },
  output: { type: String, required: true }
})

// Create model
const TestCase = model('testcases', testCasesSchema)

module.exports = {
  TestCase,
  testCasesSchema
}
