class ProblemController {
  constructor (problemService, validator, response, tokenize) {
    this.name = 'ProblemController'
    this._problemService = problemService
    this._validator = validator
    this._response = response
    this._tokenize = tokenize

    // Bind the methods
    this.test = this.test.bind(this)
  }

  async test (req, res) {
    const payload = req.body

    try {
      // Validate the payload
      this._validator.validateTest(payload)

      const result = await this._problemService.test(payload)

      // Response
      const response = this._response.success(200, 'Test is clear', { result })

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
