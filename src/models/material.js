const { model, Schema } = require('mongoose')
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 15)

const materialSchema = new Schema({
  _id: {
    type: String,
    default: () => { return `mtr-${nanoid(15)}` }
  },
  title: { type: String, required: true, minlength: 3 },
  content: { type: String, required: true }
})

// Add index on title
materialSchema.index({ title: 'text' })

// Create model
const Material = model('materials', materialSchema)

module.exports = {
  Material,
  materialSchema
}
