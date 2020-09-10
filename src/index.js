const express = require('express')
const path = require('path')
const fs = require('fs').promises
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const admin = require('./route/admin')
const { guest, loggedIn } = require('./middleware/authentication/authentication')()
const { validate } = require('./middleware/validation/validate')

const {
  addUser,
  getUserByEmail,
  getLeagues,
  getTeams,
  getSchedule,
  getStats,
} = require('../db')

require('dotenv').config()
const { PORT, SECRET, IN_PROD } = process.env

const app = express()

app.use(session({
  store: new pgSession({ conString: 'postgres://dev:dev@localhost:5432/dev' }),
  name: 'session',
  resave: false,
  saveUninitialized: false,
  secret: SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: true
  }
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/admin', admin)

app.get('/me', loggedIn, (req, res) => {
  console.log('GET /me')
  res.sendStatus(200)
})

app.get('/login', guest, (req, res, next) => {
  console.log('GET /login')
  next()
})

app.post('/login', guest, (req, res) => {
  console.log('POST /login')
  const { email, password } = req.body
  getUserByEmail({ email })
    .then(user => {
      if (user.password === password) {
        req.session.userId = user.id
        res.redirect('/')
      } else {
        res.redirect('/login')
      }
    })
    .catch(err => res.redirect('/login'))
})

app.post('/register', validate, (req, res) => {
  console.log('POST /register')
  const { 'first-name': firstName, 'last-name': lastName, email, carrier, phone, password } = req.body

  getUserByEmail({ email })
    .then(user => {
      if (user) res.sendStatus(200)
      else addUser({ firstName, lastName, email, carrier, phone, password })
        .then(user => res.sendStatus(200))
    })
})

app.get('/', (req, res, next) => {
  console.log('GET /')
  next()
})

app.get('/logout', (req, res) => {
  console.log('GET /logout')
  req.session.destroy(err => {
    if (err) res.sendStatus(403)

    res.clearCookie( 'session')
    res.redirect('/login')
  })
})

app.use(express.static(path.join(__dirname, "..", "public")))

// app.use('/bypass', bypass)

app.get('/leagues', (req, res) => {
  console.log(`GET /leagues`)
  const { sort } = req.query

  getLeagues({ sort })
    .then(leagues => res.send(leagues))
})

// app.post('/leagues', (req, res) => {
//   console.log(`POST /leagues`)
//   const { name, youngestAge, oldestAge } = req.body
//
//   addLeague({ name, youngestAge, oldestAge })
//     .then(league => res.send(league))
// })

// app.post('/leagues/:leagueId/teams', (req, res) => {
//   const { leagueId } = req.params
//   console.log(`POST /leagues/${leagueId}/teams`)
//
//   const { name, color } = req.body
//
//   return addTeam({ leagueId })
//     .then(teamId => editTeam({ teamId, name, color }))
//     .then(team => res.send(team))
// })

app.get('/leagues/:leagueId/teams', (req, res) => {
  const { leagueId } = req.params
  console.log(`GET /leagues/${leagueId}/teams`)

  getTeams({ leagueId })
    .then(teams => res.send(teams))
})

// app.post('/leagues/:leagueId/games', (req, res) => {
//   const { leagueId } = req.params
//   console.log(`POST /leagues/${leagueId}/games`)
//   const { date = null, time = null, awayId, homeId, isFinal = false, awayRS = 0, homeRS = 0 } = req.body
//
//   addGame({ date, time, awayId, homeId, isFinal, awayRS, homeRS })
//     .then(game => res.send(game))
// })

app.get('/leagues/:leagueId/schedule', (req, res) => {
  const { leagueId } = req.params

  console.log(`GET /leagues/${leagueId}/schedule`)
  getSchedule({ leagueId })
    .then(schedule => res.send(schedule))
})

app.get('/leagues/:leagueId/stats', (req, res) => {
  const { leagueId } = req.params

  console.log(`GET /${leagueId}/stats`)
  getStats({ leagueId })
    .then(stats => res.send(stats))
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))