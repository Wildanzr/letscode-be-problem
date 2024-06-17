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
  input: Joi.string().allow(''),
  output: Joi.string().required(),
  explanation: Joi.string().allow('' || null)
})

const createProblemTestCaseSchema = Joi.object({
  input: Joi.string().allow(''),
  output: Joi.string().required(),
  explanation: Joi.string().allow('' || null)
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
  isLearnPath: Joi.boolean().truthy('true', 'yes', 1, '1').falsy('false', 'no', 0, '0').required(),
  isChallenge: Joi.boolean().truthy('true', 'yes', 1, '1').falsy('false', 'no', 0, '0').required()
})

const getCompetesSchema = Joi.object({
  page: Joi.number().min(1).required(),
  limit: Joi.number().min(1).max(100).required(),
  isLearnPath: Joi.boolean().truthy('true', 'yes', 1, '1').falsy('false', 'no', 0, '0').allow(''),
  isChallenge: Joi.boolean().truthy('true', 'yes', 1, '1').falsy('false', 'no', 0, '0').allow(''),
  on: Joi.boolean().truthy('true', 'yes', 1, '1').falsy('false', 'no', 0, '0').allow(''),
  q: Joi.string().allow(''),
  participantId: Joi.string().allow(''),
  challengerId: Joi.string().allow('')
})

const getCompeteSchema = Joi.object({
  competeId: Joi.string().required()
})

const createCompeteProblemSchema = Joi.object({
  competeId: Joi.string().required(),
  problemId: Joi.string().required(),
  maxPoint: Joi.number().min(1).max(100).required()
})

const updateCompeteProblemSchema = Joi.object({
  maxPoint: Joi.number().min(1).max(100).required()
})

const getCompeteProblemSchema = Joi.object({
  competeProblemId: Joi.string().required()
})

const getSubmissionInCPSchema = Joi.object({
  competeProblemId: Joi.string().required()
})

const getSubmissionDetailSchema = Joi.object({
  submissionId: Joi.string().required()
})

const getLeaderboardSchema = Joi.object({
  competeProblemId: Joi.string().required(),
  page: Joi.number().min(1).required(),
  limit: Joi.number().min(1).max(100).required()
})

const joinCompeteSchema = Joi.object({
  competeId: Joi.string().required(),
  key: Joi.string().required()
})

const getStudentDataSchema = Joi.object({
  q: Joi.string().allow(''),
  page: Joi.number().min(1).required(),
  limit: Joi.number().min(1).max(100).required()
})

const createMatrialSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required()
})

const getMaterialSchema = Joi.object({
  materialId: Joi.string().required()
})

const getMaterialsSchema = Joi.object({
  page: Joi.number().min(1).required(),
  limit: Joi.number().min(1).max(100).required(),
  q: Joi.string().allow('')
})

const updateMaterialSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required()
})

module.exports = {
  createProblemSchema,
  getProblemSchema,
  createProblemSampleCaseSchema,
  createProblemTestCaseSchema,
  getProblemSampleCaseSchema,
  getProblemTestCaseSchema,
  createCompeteSchema,
  getCompetesSchema,
  getCompeteSchema,
  createCompeteProblemSchema,
  updateCompeteProblemSchema,
  getCompeteProblemSchema,
  getSubmissionInCPSchema,
  getSubmissionDetailSchema,
  getLeaderboardSchema,
  joinCompeteSchema,
  getStudentDataSchema,
  createMatrialSchema,
  getMaterialSchema,
  getMaterialsSchema,
  updateMaterialSchema
}
