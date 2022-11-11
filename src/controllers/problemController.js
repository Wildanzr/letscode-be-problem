const { ClientError } = require('../errors')

class ProblemController {
  constructor (problemService, validator, response, tokenize) {
    this.name = 'ProblemController'
    this._problemService = problemService
    this._validator = validator
    this._response = response
    this._tokenize = tokenize

    // Bind the methods
    this.createProblem = this.createProblem.bind(this)
  }

  async createProblem (req, res) {
    const token = req.headers.authorization
    const payload = req.body

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._problemService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Validate payload
      payload.challenger = _id
      this._validator.validateCreateProblem(payload)

      // Create problem
      const problem = await this._problemService.createProblem(payload)

      // Response
      const response = this._response.success(200, 'Problem created', { problem })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }
}

module.exports = {
  ProblemController
}
