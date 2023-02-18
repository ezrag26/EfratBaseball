const { getUserById } = require('../../../db')

module.exports = (route = '/') => ({
  guest: (req, res, next) => {
    getUserById({ id: req.session.userId })
      .then(user => {
        if (!user) next()

        return res.redirect(route)
      })
      .catch(err => next())
  },

  loggedIn: (req, res, next) => {
    getUserById({ id: req.session.userId })
      .then(user => {
        if (user) {
          res.locals.user = user
          return next()
        }

        return res.sendStatus(401)
      })
      .catch(err => res.sendStatus(401))
  }
})
