const { model, Schema } = require('mongoose')
const { nanoid } = require('nanoid')

const problemSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `pbl-${nanoid(15)}` }
  },
  challenger: { type: Schema.Types.String, ref: 'users' },
  title: { type: String, required: true, unique: true, minlength: 3 },
  description: { type: String, required: true },
  problem: { type: String, required: true },
  difficulty: { type: Number, required: true },
  inputFormat: { type: String, required: true },
  constraint: { type: String, required: true },
  outputFormat: { type: String, required: true },
  sampleCases: { type: Schema.Types.String, ref: 'sampleCases' },
  testCases: { type: Schema.Types.String, ref: 'testCases' },
  languageAllowed: { type: Array, required: true }
})

// Add index on title
problemSchema.index({ title: 'text' })

// Add index on difficulty
problemSchema.index({ difficulty: 1 })

// Create model
const Problem = model('problems', problemSchema)

module.exports = {
  Problem,
  problemSchema
}
