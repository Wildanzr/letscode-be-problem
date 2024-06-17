const { ClientError } = require('../errors')
const { logger } = require('../utils/logger')

class MaterialController {
  constructor (materialService, validator, response, tokenize) {
    this.name = 'MaterialController'
    this._materialService = materialService
    this._validator = validator
    this._response = response
    this._tokenize = tokenize

    // Bind the material methods
    this.createMaterial = this.createMaterial.bind(this)
    this.getMaterial = this.getMaterial.bind(this)
    this.getMaterials = this.getMaterials.bind(this)
    this.updateMaterial = this.updateMaterial.bind(this)
    this.deleteMaterial = this.deleteMaterial.bind(this)
    this.registerParticipant = this.registerParticipant.bind(this)
    this.checkAlreadyParticipant = this.checkAlreadyParticipant.bind(this)
  }

  // Material
  async createMaterial (req, res) {
    const token = req.headers.authorization
    const payload = req.body
    console.log('Token: ', token)

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._materialService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak', 403)

      // Validate payload
      this._validator.validateCreateMaterial(payload)

      // Createa Material
      const material = await this._materialService.createMaterial(payload)

      // Response
      const response = this._response.success(200, 'Berhasil membuat materi', { material })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async getMaterial (req, res) {
    const { materialId } = req.params

    try {
      // Validate payload
      this._validator.validateGetMaterial({ materialId })

      // Get material data
      const material = await this._materialService.getMaterialById(materialId)
      if (!material) throw new ClientError('Materi tidak ditemukan', 404)

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan materi', { material })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async getMaterials (req, res) {
    const { page, limit, q } = req.query

    try {
      // Validate payload
      this._validator.validateGetMaterials({ page, limit })

      // Get materials
      const { materials, total } = await this._materialService.getMaterials({ page, limit, q })

      // Meta data
      const meta = {
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit)
      }

      // Response
      const response = this._response.success(200, 'Berhasil mendapatkan materi', { materials }, meta)

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async updateMaterial (req, res) {
    const token = req.headers.authorization
    const payload = req.body
    const { materialId } = req.params

    try {
    // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._materialService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak', 403)

      // Validate payload
      this._validator.validateUpdateMaterial(payload)

      // Update material
      await this._materialService.updateMaterialById(materialId, payload)

      // Response
      const response = this._response.success(200, 'Berhasil memperbarui materi')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async deleteMaterial (req, res) {
    const token = req.headers.authorization
    const { materialId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._materialService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid', 401)
      if (user.role === 0) throw new ClientError('Otorisasi ditolak', 403)

      // Validate payload
      this._validator.validateGetMaterial({ materialId })

      // Get material
      const material = await this._materialService.getMaterialById(materialId)
      if (!material) throw new ClientError('Materi tidak ditemukan', 404)

      // Delete material
      await this._materialService.deleteMaterialById(materialId)

      // Response
      const response = this._response.success(200, 'Berhasil menghapus materi')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async registerParticipant (req, res) {
    const token = req.headers.authorization
    const { materialId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._materialService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid', 401)

      // Validate payload
      this._validator.validateGetMaterial({ materialId })

      // Get material data
      const material = await this._materialService.getMaterialById(materialId)
      if (!material) throw new ClientError('Materi tidak ditemukan', 404)

      // Register participant
      await this._materialService.addParticipant(materialId, _id)

      // Response
      const response = this._response.success(200, 'Berhasil mendaftar sebagai peserta')

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }

  async checkAlreadyParticipant (req, res) {
    const token = req.headers.authorization
    const { materialId } = req.params

    try {
      // Check token
      if (!token) throw new ClientError('Tidak ada otorisasi', 401)

      // Verify token
      const { _id } = await this._tokenize.verify(token)

      // Check user _id
      const user = await this._materialService.findUserById(_id)
      if (!user) throw new ClientError('Otorisasi tidak valid', 401)

      // Validate payload
      this._validator.validateGetMaterial({ materialId })

      // Check already participant
      const participant = await this._materialService.checkAlreadyParticipant(materialId, _id)

      // Response
      const response = this._response.success(200, 'Berhasil memeriksa status peserta', { isDone: !!participant })

      return res.status(response.statusCode || 200).json(response)
    } catch (error) {
      logger.error(error)
      return this._response.error(res, error)
    }
  }
}

module.exports = {
  MaterialController
}
