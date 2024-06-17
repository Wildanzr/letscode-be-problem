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

  async getMaterials (query) {
    let { page, limit } = query

    if (page === '' || page === undefined) page = 1
    if (limit === '' || limit === undefined) limit = 10

    const materials = await Material.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ _id: -1 })
      .select('_id title content')
      .exec()

    const total = await Material.countDocuments()

    return { materials, total }
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
