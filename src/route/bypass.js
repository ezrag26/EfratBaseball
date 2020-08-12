const express = require('express')
const { getSchedule, getStandings } = require('../../db/index')

const router = express.Router()

router.get('/schedule', (req, res, next) => {
  console.log(`GET /bypass/schedule`)
  getSchedule({ leagueId: 'bypass' })
    .then(schedule => {
      res.send(schedule)
    })
})

router.get('/standings', (req, res, next) => {
  console.log(`GET /bypass/standings`)
  getStandings({ leagueId: 'bypass' })
    .then(standings => {
      res.send(standings)
    })
})

module.exports = router