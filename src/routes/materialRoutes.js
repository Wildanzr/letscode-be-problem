class MaterialRoutes {
  constructor (express, materialController) {
    this.name = 'MaterialRoutes'
    this.router = express.Router()

    this.router.post('/', materialController.createMaterial)
    this.router.get('/', materialController.getMaterials)
    this.router.get('/:materialId', materialController.getMaterial)
    this.router.put('/:materialId', materialController.updateMaterial)
    this.router.delete('/:materialId', materialController.deleteMaterial)
    this.router.post('/:materialId/register', materialController.registerParticipant)
    this.router.get('/:materialId/check', materialController.checkAlreadyParticipant)
  }
}

module.exports = {
  MaterialRoutes
}
