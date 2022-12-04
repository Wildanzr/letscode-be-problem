const { TestCase } = require('../models')

class TestCaseService {
  constructor () {
    this.name = 'TestCaseService'
  }

  async createTestCase (payload) {
    return await TestCase.create(payload)
  }

  async getTestCaseById (testCaseId) {
    return await TestCase.findById(testCaseId)
  }

  async deleteTestCaseById (testCaseId) {
    return await TestCase.findByIdAndDelete(testCaseId)
  }

  async updateTestCaseById (testCaseId, payload) {
    return await TestCase.findByIdAndUpdate(testCaseId, payload, { new: true })
  }
}

module.exports = {
  TestCaseService
}
