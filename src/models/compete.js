const { model, Schema } = require('mongoose')
const { nanoid } = require('nanoid')

const competeSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `compete-${nanoid(15)}` }
  },
  name: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  cover: { type: String, required: true },
  description: { type: String, required: true },
  isLearnPath: { type: Boolean, default: false },
  problems: [{ type: Schema.Types.String, ref: 'competeProblems' }],
  leaderboard: [{ type: Schema.Types.String, ref: 'competeLeaderboards' }]
})

// Add index on name
competeSchema.index({ name: 'text' })

// Add index on isLearnPath
competeSchema.index({ isLearnPath: 1 })

// Create model
const Compete = model('competes', competeSchema)

module.exports = {
  Compete,
  competeSchema
}
