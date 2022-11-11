const { ClientError } = require('../errors')
const {
  createProblemSchema
} = require('./schema')

class Validator {
  constructor () {
    this.name = 'Validator'
  }

  validateCreateProblem (payload) {
    const { error } = createProblemSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }
}

module.exports = {
  Validator
}
