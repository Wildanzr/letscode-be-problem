class ProblemService {
  constructor () {
    this.name = 'ProblemService'
  }

  test (payload) {
    return `Hello ${payload.name} from test`
  }
}

module.exports = {
  ProblemService
}
