const { SampleCase } = require('../models')

class SampleCaseService {
  constructor () {
    this.name = 'SampleCaseService'
  }

  async createSampleCase (payload) {
    return await SampleCase.create(payload)
  }

  async getSampleCaseById (sampleId) {
    return await SampleCase.findById(sampleId)
  }

  async deleteSampleCaseById (sampleCaseId) {
    return await SampleCase.findByIdAndDelete(sampleCaseId)
  }

  async updateSampleCaseById (sampleCaseId, payload) {
    return await SampleCase.findByIdAndUpdate(sampleCaseId, payload, { new: true })
  }
}

module.exports = {
  SampleCaseService
}
