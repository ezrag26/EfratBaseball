const express = require('express')
const path = require('path')
const fs = require('fs').promises
const bypass = require('./route/bypass')

require('dotenv').config()
const { PORT } = process.env

const app = express()

const authenticate = (req, res, next) => {
  next()
}

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

app.get('/', (req, res, next) => {
  console.log('GET /')
  next()
})

app.use('/bypass', bypass)

app.get('/:leagueId/schedule', authenticate, (req, res, next) => {
  const { leagueId } = req.param

  console.log(`GET /${leagueId}/schedule`)
  getSchedule({ leagueId })
    .then(schedule => {
      res.send(schedule)
    })
})

app.get('/:leagueId/standings', authenticate, (req, res, next) => {
  const { leagueId } = req.param

  console.log(`GET /${leagueId}/standings`)
  getStandings({ leagueId })
    .then(standings => {
      res.send(standings)
    })
})

app.use(express.static(path.join(__dirname, "..", "public")))

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))