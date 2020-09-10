const validator = require('validator')

module.exports = {
  validate: (req, res, next) => {
    const { 'first-name': firstName, 'last-name': lastName, email, carrier, phone, password } = req.body
    if (
      !firstName ||
      !lastName ||
      !email ||
      !validator.isEmail(email) ||
      !carrier ||
      !phone ||
      !password
    ) return res.sendStatus(400)

    next()
  }
}