const Joi = require('joi')

const createProblemSchema = Joi.object({
  challenger: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  difficulty: Joi.number().valid(1, 2, 3).required(),
  constraint: Joi.string().required(),
  inputFormat: Joi.string().required(),
  outputFormat: Joi.string().required()
})

module.exports = {
  createProblemSchema
}
