const express = require('express')
const router = express.Router()
const path = require('path')
const bcrypt = require('bcryptjs') // cross-architecture replacement for bcrypt
const { guest } = require('../middleware/authentication/authentication')('/admin')

const {
  getUserByEmail,
  getUserById,
  addLeague,
  editLeague,
	getLeagueIdByTeamId,
  addTeam,
  editTeam,
  addGame,
  editGame
} = require('../../db/index')

const admin = (req, res, next) => {
  if (!(process.env.NODE_ENV === 'production') && req.body.bypass) return next()

  getUserById({ id: req.session.userId })
    .then(user => {
      if (user.role !== 'user') return next()
      else res.sendStatus(401)
    })
    .catch(err => res.sendStatus(401))
}

const adminLoggedIn = (req, res, next) => {
  getUserById({ id: req.session.userId })
    .then(user => {
      if (user.role !== 'user') {
        res.locals.user = user
        return next()
      }
      else res.sendStatus(401)
    })
    .catch(err => res.sendStatus(401))
}
//
// router.get('/me', adminLoggedIn, (req, res, next) => {
//   console.log(`GET /admin/me`)
//   const { firstName, lastName, email, role } = res.locals.user
//
//   res.send({ firstName, lastName, email, role })
// })

router.get('/', (req, res, next) => {
  console.log(`GET /admin`)
  next()
})

router.get('/login', guest, (req, res, next) => {
  console.log('GET /admin/login')
  next()
})

router.post('/login', guest, (req, res) => {
  console.log('POST /admin/login')
  const { email, password } = req.body
  getUserByEmail({ email })
    .then(user => {
      bcrypt.compare(password, user.password)
        .then(isSamePassword => {
          if (user.role !== 'user' && isSamePassword) {
            req.session.userId = user.id
            res.redirect('/admin')
          } else {
            res.redirect('login')
          }
        })
    })
    .catch(err => {
      res.redirect('login')
    })
})

// router.use(admin)

router.get('/logout', (req, res) => {
  console.log(`GET /admin/logout`)
  req.session.destroy(err => {
    if (err) res.sendStatus(403)

    res.clearCookie( 'session')
    res.redirect('/admin/login')
  })
})

router.get('/leagues', admin, (req, res) => {
  console.log(`GET /admin/leagues`)
  res.sendFile(path.resolve(__dirname, "..", "..", "site", "admin", "leagues", "index.html"))
})

router.post('/leagues', admin, (req, res) => {
  console.log(`POST /admin/leagues`)
  const { name, youngestAge, oldestAge } = req.body

  return addLeague({ name, youngestAge, oldestAge })
    .then(league => res.send(league))
})

router.post('/leagues/:leagueId', admin, (req, res) => {
  const { leagueId } = req.params
  console.log(`POST /admin/leagues/${leagueId}`)
  const { name, youngestAge, oldestAge } = req.body

  return editLeague({ leagueId, name, youngestAge, oldestAge })
    .then(league => res.send(league))
})

router.get('/teams', admin, (req, res) => {
  console.log(`GET /admin/teams`)
  res.sendFile(path.resolve(__dirname, "..", "..", "site", "admin", "teams", "index.html"))
})

router.post('/leagues/:leagueId/teams', admin, (req, res) => {
  const { leagueId } = req.params
  console.log(`POST /admin/leagues/${leagueId}/teams`)

  const { name, color } = req.body

  return addTeam({ leagueId, name, color })
		.then(team => {
			res.locals.cache.teams[leagueId] = null
			return res.send(team)
		})
})

router.post('/leagues/:leagueId/teams/:teamId', admin, (req, res) => {
  const { leagueId, teamId } = req.params
  console.log(`POST /admin/leagues/${leagueId}/teams/${teamId}`)

  const { name, color } = req.body

  return editTeam({ teamId, name, color })
		.then(team => {
			res.locals.cache.teams[leagueId] = null
			return res.send(team)
		})
})

router.post('/games', admin, (req, res) => {
  console.log(`POST /games`)
  const { date = null, time = null, awayId, homeId, isFinal = false, awayRS = 0, homeRS = 0 } = req.body

  addGame({ date, time, awayId, homeId, isFinal, awayRS, homeRS })
		.then(game => {
			getLeagueIdByTeamId({ teamId: homeId })
			.then(id => {
				res.locals.cache.schedule[id] = null
				res.locals.cache.stats[id] = null
				return res.send(game)
			})
		})
})

router.post('/games/:gameId', admin, (req, res) => {
  const { gameId } = req.params
  console.log(`POST /games/${gameId}`)
  const { date = null, time = null, awayId, homeId, isFinal = false, awayRS = 0, homeRS = 0 } = req.body

  editGame({ gameId, date, time, awayId, homeId, isFinal, awayRS, homeRS })
		.then(game => {
			getLeagueIdByTeamId({ teamId: homeId })
			.then(id => {
				res.locals.cache.schedule[id] = null
				res.locals.cache.stats[id] = null
				return res.send(game)
			})
		})
})

router.get('/schedule', admin, (req, res) => {
  console.log(`GET /admin/schedule`)
  res.sendFile(path.resolve(__dirname, "..", "..", "site", "admin", "schedule", "index.html"))
})

router.get('/gallery', admin, (req, res) => {
  console.log(`GET /admin/gallery`)
  res.sendFile(path.resolve(__dirname, "..", "..", "site", "admin", "gallery", "index.html"))
})

module.exports = router
