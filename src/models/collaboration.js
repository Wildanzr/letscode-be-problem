const { model, Schema } = require('mongoose')
const { nanoid } = require('nanoid')

const collaborationSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `clb-${nanoid(15)}` }
  },
  competeId: { type: Schema.Types.String, ref: 'competes' },
  problemId: { type: Schema.Types.String, ref: 'problems' },
  codeId: { type: String, required: true },
  driver: { type: Schema.Types.String, ref: 'users' },
  navigator: [{ type: Schema.Types.String, ref: 'users' }]
})

// Create model
const Collaboration = model('collaborations', collaborationSchema)

module.exports = {
  Collaboration,
  collaborationSchema
}
