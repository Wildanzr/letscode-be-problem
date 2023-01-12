const { ClientError } = require('../errors')
const {
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
  getStudentDataSchema
} = require('./schema')

class Validator {
  constructor () {
    this.name = 'Validator'
  }

  validateCreateProblem (payload) {
    const { error } = createProblemSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateGetProblem (payload) {
    const { error } = getProblemSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateCreateProblemSampleCase (payload) {
    const { error } = createProblemSampleCaseSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateCreateProblemTestCase (payload) {
    const { error } = createProblemTestCaseSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateGetProblemSampleCase (payload) {
    const { error } = getProblemSampleCaseSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateGetProblemTestCase (payload) {
    const { error } = getProblemTestCaseSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateCreateCompete (payload) {
    const { error } = createCompeteSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateGetCompetes (payload) {
    const { error } = getCompetesSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateGetCompete (payload) {
    const { error } = getCompeteSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateCreateCompeteProblem (payload) {
    const { error } = createCompeteProblemSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateUpdateCompeteProblem (payload) {
    const { error } = updateCompeteProblemSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateGetCompeteProblem (payload) {
    const { error } = getCompeteProblemSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateGetSubmissionInCP (payload) {
    const { error } = getSubmissionInCPSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateGetSubmissionDetail (payload) {
    const { error } = getSubmissionDetailSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateGetLeaderboard (payload) {
    const { error } = getLeaderboardSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateJoinCompete (payload) {
    const { error } = joinCompeteSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }

  validateGetStudentsData (payload) {
    const { error } = getStudentDataSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }
}

module.exports = {
  Validator
}
