// public modules
const express = require('express')
const path = require('path')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const bcrypt = require('bcryptjs') // cross-architecture replacement for bcrypt

// private modules
// setup environment variables before requiring other private modules that use them
const { NODE_ENV } = process.env

require('./env').setup(NODE_ENV)

const admin = require('./route/admin')
const { guest, loggedIn } = require('./middleware/authentication/authentication')()
const { validate } = require('./middleware/validation/validate')

const {
	PORT,
	SESS_SECRET,
	PASS_SALT,
	DB_HOST,
	DB_PORT,
	DB_USER,
	DB_PASS,
	DB_NAME
} = process.env

const {
  addUser,
  getUserByEmail,
  getLeagues,
  getTeams,
  getSchedule,
  getStats,
} = require('../db')

const app = express()

const cookie = {
	maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
	sameSite: true
}

if (NODE_ENV === 'env') {
	cookie.secure = true

	app.set('trust proxy', 1) // trust first proxy
}

app.use(session({
  store: new pgSession({ conString: `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}` }),
  name: 'session',
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie
}))

const cache = {
	schedule: {},
	teams: {},
	stats: {}
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
	res.locals.cache = cache
	next()
})
app.use('/admin', admin)

app.get('/me', loggedIn, (req, res) => {
  console.log('GET /me')
  const { firstName, lastName, email, role } = res.locals.user

  res.send({ firstName, lastName, email, role })
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
      bcrypt.compare(password, user.password)
        .then(isSamePassword => {
          if (isSamePassword) {
            req.session.userId = user.id
            res.redirect('/')
          } else {
            res.redirect('/login')
          }
        })
    })
    .catch(err => res.redirect('/login'))
})

app.post('/register', validate, (req, res) => {
  console.log('POST /register')
  const { 'first-name': firstName, 'last-name': lastName, email, carrier, phone, password } = req.body

  getUserByEmail({ email })
    .then(user => {
      if (user) res.sendStatus(200)
      else bcrypt.hash(password, parseInt(PASS_SALT))
        .then(hashedPassword => addUser({ firstName, lastName, email, carrier, phone, password: hashedPassword }))
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

	if (cache.teams[leagueId]) return res.send(cache.teams[leagueId])

  getTeams({ leagueId })
    .then(teams => {
			cache.teams[leagueId] = teams
			return res.send(teams)
		})
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
  const { leagueId, page, numItems } = req.params

  console.log(`GET /leagues/${leagueId}/schedule`)

	if (cache.schedule[leagueId]) return res.send(cache.schedule[leagueId])

  getSchedule({ leagueId, page, numItems })
		.then(schedule => {
			cache.schedule[leagueId] = schedule
			return res.send(schedule)
		})
})

app.get('/leagues/:leagueId/stats', (req, res) => {
  const { leagueId } = req.params

  console.log(`GET /${leagueId}/stats`)

	if (cache.stats[leagueId]) return res.send(cache.stats[leagueId])

  getStats({ leagueId })
    .then(stats => {
			cache.stats[leagueId] = stats
			return res.send(stats)
		})
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
