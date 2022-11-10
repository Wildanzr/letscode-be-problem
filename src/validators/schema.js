const Joi = require('joi')

const testSchema = Joi.object({
  name: Joi.string().required()
})

module.exports = {
  testSchema
}
