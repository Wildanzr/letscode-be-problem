const { ClientError } = require('../errors')
const {
  testSchema
} = require('./schema')

class Validator {
  constructor () {
    this.name = 'Validator'
  }

  validateTest (payload) {
    const { error } = testSchema.validate(payload)
    if (error) throw new ClientError(error.message, 400)
  }
}

module.exports = {
  Validator
}
