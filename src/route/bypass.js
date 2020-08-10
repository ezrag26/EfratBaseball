const express = require('express')

const router = express.Router()

const getSchedule = ({ leagueId }) => {
  return Promise.resolve({
    1: { date: '19 Jun 2020', time: 'F', away: 'Ariyot', home: 'Bombers', awayColor: 'yellow', homeColor: 'dodgerblue' },
    2: { date: '22 Jun 2020', time: 'F', away: 'BMKI', home: 'Ariyot', awayColor: 'green', homeColor: 'yellow' },
    3: { date: '26 Jun 2020', time: '2:30PM', away: 'Bombers', home: 'BMKI', awayColor: 'dodgerblue', homeColor: 'green' }
  })
}

const getStandings = ({ leagueId }) => {
  return Promise.resolve({
    2: { name: 'Ariyot', wins: 5, loses: 3, ties: 0, RS: 63, RA: 37 },
    3: { name: 'Bombers', wins: 4, loses: 3, ties: 1, RS: 62, RA: 46 },
    1: { name: 'MBKI', wins: 2, loses: 5, ties: 1, RS: 34, RA: 76 }
  })
}

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