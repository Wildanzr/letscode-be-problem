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

const getProblemSchema = Joi.object({
  problemId: Joi.string().required()
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

const createCompeteSchema = Joi.object({
  name: Joi.string().required(),
  challenger: Joi.string().required(),
  description: Joi.string().required(),
  // languageAllowed is an array of integer
  languageAllowed: Joi.array().items(Joi.number()).required(),
  start: Joi.date().allow(null),
  end: Joi.date().allow(null),
  isLearnPath: Joi.boolean().truthy('true', 'yes', 1, '1').falsy('false', 'no', 0, '0').required()
})

const getCompetesSchema = Joi.object({
  page: Joi.number().min(1).required(),
  limit: Joi.number().min(1).required(),
  isLearnPath: Joi.boolean().truthy('true', 'yes', 1, '1').falsy('false', 'no', 0, '0').allow(''),
  on: Joi.boolean().truthy('true', 'yes', 1, '1').falsy('false', 'no', 0, '0').allow(''),
  q: Joi.string().allow(''),
  participantId: Joi.string().allow(''),
  challengerId: Joi.string().allow('')
})

module.exports = {
  createProblemSchema,
  getProblemSchema,
  createProblemSampleCaseSchema,
  createProblemTestCaseSchema,
  getProblemSampleCaseSchema,
  getProblemTestCaseSchema,
  createCompeteSchema,
  getCompetesSchema
}
