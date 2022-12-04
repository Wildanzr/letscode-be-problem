const { model, Schema } = require('mongoose')
const { nanoid } = require('nanoid')

const logSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `log-${nanoid(15)}` }
  },
  userId: { type: Schema.Types.String, ref: 'users' },
  submissionId: { type: Schema.Types.String, ref: 'submissions' },
  at: { type: Date, default: () => { return new Date() } }
})

// Create model
const Log = model('logs', logSchema)

module.exports = {
  Log,
  logSchema
}
