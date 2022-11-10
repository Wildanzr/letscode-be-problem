const { model, Schema } = require('mongoose')
const { nanoid } = require('nanoid')

const competeProblemSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `cp-${nanoid(15)}` }
  },
  competeId: { type: Schema.Types.String, ref: 'competes' },
  problemId: { type: Schema.Types.String, ref: 'problems' },
  submissions: [{ type: Schema.Types.String, ref: 'problemSubmissions' }],
  maxPoint: { type: Number, default: 100 }
})

// Create model
const CompeteProblem = model('competeProblems', competeProblemSchema)

module.exports = {
  CompeteProblem,
  competeProblemSchema
}
