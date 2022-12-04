const { model, Schema } = require('mongoose')
const { nanoid } = require('nanoid')

const competeLeaderboardSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `clb-${nanoid(15)}` }
  },
  userId: { type: Schema.Types.String, ref: 'users' }
})

// Create model
const CompeteLeaderboard = model('competeLeaderboards', competeLeaderboardSchema)

module.exports = {
  CompeteLeaderboard,
  competeLeaderboardSchema
}
