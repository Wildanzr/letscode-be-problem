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
    let { page, limit, q } = query

    if (q === '' || q === undefined) q = ''
    if (page === '' || page === undefined) page = 1
    if (limit === '' || limit === undefined) limit = 10

    // Query config
    const config = {
      title: { $regex: q, $options: 'i' }
    }

    const materials = await Material.find(config)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ title: 1 })
      .select('_id title')
      .exec()

    const total = await Material.countDocuments(config)

    return { materials, total }
  }

  async updateMaterialById (id, payload) {
    return await Material.findByIdAndUpdate(id, payload, { new: true })
  }

  async deleteMaterialById (_id) {
    return await Material.findByIdAndDelete(_id)
  }

  async addParticipant (materialId, userId) {
    const material = await this.getMaterialById(materialId)
    const setParticipant = new Set(material.participants)

    if (setParticipant.has(userId)) {
      return null
    } else {
      setParticipant.add(userId)
      material.participants = Array.from(setParticipant)
      return await material.save()
    }
  }

  async checkAlreadyParticipant (materialId, userId) {
    return await Material.findOne({ _id: materialId, participants: userId })
  }
}

module.exports = {
  MaterialService
}
