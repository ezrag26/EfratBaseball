const express = require('express')
const path = require('path')
const fs = require('fs').promises
const bodyParser = require('body-parser')
// const bypass = require('./route/bypass')
const {
  addLeague,
  addTeam,
  addGame,
  getSchedule,
  getStandings
} = require('../db/index')

require('dotenv').config()
const { PORT } = process.env

const app = express()

app.use(bodyParser.json())

const authenticate = (req, res, next) => {
  next()
}

app.get('/', (req, res, next) => {
  console.log('GET /')
  next()
})

// app.use('/bypass', bypass)

app.post('/leagues', authenticate, (req, res) => {
  console.log(`POST /leagues`)
  const { name } = req.body

  addLeague({ name })
    .then(id => res.send(id))
})

app.post('/leagues/:leagueId/teams', authenticate, (req, res) => {
  const { leagueId } = req.params
  console.log(`POST /leagues/${leagueId}/teams`)
  const { name, color } = req.body

  addTeam({ name, color })
    .then(id => res.send(id))
})

app.post('/leagues/:leagueId/games', authenticate, (req, res) => {
  const { leagueId } = req.params
  console.log(`POST /leagues/${leagueId}/games`)
  const { date, time, away, home } = req.body

  addGame({ date, time, away, home })
    .then(id => res.send(id))
})

app.get('/leagues/:leagueId/schedule', authenticate, (req, res, next) => {
  const { leagueId } = req.params

  console.log(`GET /leagues/${leagueId}/schedule`)
  getSchedule({ leagueId })
    .then(schedule => {
      res.send(schedule)
    })
})

app.get('/leagues/:leagueId/standings', authenticate, (req, res, next) => {
  const { leagueId } = req.params

  console.log(`GET /${leagueId}/standings`)
  getStandings({ leagueId })
    .then(standings => {
      res.send(standings)
    })
})

app.use(express.static(path.join(__dirname, "..", "public")))

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))