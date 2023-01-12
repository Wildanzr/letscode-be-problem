class CompeteRoutes {
  constructor (express, competeController) {
    this.name = 'CompeteRoutes'
    this.router = express.Router()

    this.router.post('/', competeController.createCompete)
    this.router.get('/', competeController.getCompetes)
    this.router.get('/journey-progress', competeController.checkOverallProgress)
    this.router.get('/overall-leaderboard', competeController.getOverallLeaderboard)
    this.router.get('/join/:competeId', competeController.checkJoinedCompete)
    this.router.post('/join/:competeId', competeController.joinCompete)
    this.router.get('/statistics', competeController.getDashboardStats)
    this.router.get('/:competeId', competeController.getCompete)
    this.router.put('/:competeId', competeController.updateCompete)
    this.router.delete('/:competeId', competeController.deleteCompete)
    this.router.get('/:competeId/problems', competeController.getCompeteProblems)
    this.router.get('/:competeId/challenges', competeController.searchCompeteProblems)
    this.router.get('/:competeId/progress', competeController.checkCompeteProgress)
    this.router.get('/:competeId/leaderboard', competeController.getCompeteLeaderboard)

    this.router.get('/cp/:competeProblemId', competeController.getCompeteProblem)
    this.router.post('/:competeId/problems', competeController.createCompeteProblem)
    this.router.put('/:competeId/problems/:competeProblemId', competeController.updateCompeteProblem)
    this.router.delete('/:competeId/problems/:competeProblemId', competeController.deleteCompeteProblem)
  }
}

module.exports = {
  CompeteRoutes
}
