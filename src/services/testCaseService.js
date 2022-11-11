const { TestCase } = require('../models')

class TestCaseService {
  constructor () {
    this.name = 'TestCaseService'
  }

  async createTestCase (payload) {
    return await TestCase.create(payload)
  }
}

module.exports = {
  TestCaseService
}
