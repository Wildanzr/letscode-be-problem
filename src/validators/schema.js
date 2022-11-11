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

const createProblemSampleCaseSchema = Joi.object({
  input: Joi.string().required(),
  output: Joi.string().required(),
  explanation: Joi.string().allow('')
})

const createProblemTestCaseSchema = Joi.object({
  input: Joi.string().required(),
  output: Joi.string().required(),
  explanation: Joi.string().allow('')
})

const getProblemSampleCaseSchema = Joi.object({
  sampleCaseId: Joi.string().required()
})

const getProblemTestCaseSchema = Joi.object({
  testCaseId: Joi.string().required()
})

module.exports = {
  createProblemSchema,
  createProblemSampleCaseSchema,
  createProblemTestCaseSchema,
  getProblemSampleCaseSchema,
  getProblemTestCaseSchema
}
