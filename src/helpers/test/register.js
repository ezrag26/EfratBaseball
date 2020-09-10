const request = require('request-promise-native')

const HOSTNAME = 'localhost:8010'

module.exports = {
  register: ({first, last, email, carrier, phone, password }) => request({
    method: 'POST',
    url: `http://${HOSTNAME}/register`,
    json: true,
    resolveWithFullResponse: true,
    body: {
      "first-name": first,
      "last-name": last,
      email,
      carrier,
      phone,
      password
    }
  }),
}