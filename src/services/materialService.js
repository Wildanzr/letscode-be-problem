const { User } = require('../models')
const { Material } = require('../models/material')

class MaterialService {
  constructor () {
    this.name = 'MaterialService'
  }

  async findUserById (_id) {
    return await User.findById(_id)
  }

  async createMaterial (payload) {
    return await Material.create(payload)
  }

  async getMaterialById (id) {
    return await Material.findById(id)
  }

  async updateMaterialById (id, payload) {
    return await Material.findByIdAndUpdate(id, payload, { new: true })
  }

  async deleteMaterialById (_id) {
    return await Material.findByIdAndDelete(_id)
  }
}

module.exports = {
  MaterialService
}
