const { ClientError } = require('../errors')

class CompeteProblemController {
  constructor (competeProblemService, problemSubmissionService, submissionService, userService, validator, response, tokenize) {
    this.name = 'competeProblemController'
    this._competeProblemService = competeProblemService
    this._problemSubmissionService = problemSubmissionService
    this._submissionService = submissionService
    this._userService = userService
    this._validator = validator
    this._response = response
    this._tokenize = tokenize

    // Bind methods
    this.getSubmissionsInCP = this.getSubmissionsInCP.bind(this)
    this.getSubmissionDetailInCP = this.getSubmissionDetailInCP.bind(this)
  }

  async getSubmissionsInCP (req, res) {
    const token = req.headers.authorization
    const { competeProblemId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Validate payload
      this._validator.validateGetSubmissionInCP({ competeProblemId })

      // Get submissions list
      const submissions = await this._problemSubmissionService.getSubmissionsInCP(competeProblemId, _id)

      // Response
      const response = this._response.success(200, 'Get submissions list successfully.', submissions)

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }

  async getSubmissionDetailInCP (req, res) {
    const token = req.headers.authorization
    const { submissionId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('There is no auth token.', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._userService.findUserById(_id)
      if (!user) throw new ClientError('Invalid authorization.', 401)
      if (user.role === 0) throw new ClientError('Permission denied.', 403)

      // Validate payload
      this._validator.validateGetSubmissionDetail({ submissionId })

      // Get submissions list
      const submission = await this._submissionService.getSubmissionDetail(submissionId)

      // Response
      const response = this._response.success(200, 'Get submission detail successfully.', { submission })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      console.log(error)
      return this._response.error(res, error)
    }
  }
}

module.exports = {
  CompeteProblemController
}
