const request = require('request-promise-native')
// const { DEV_HOST } = process.env
const DEV_HOST = 'dev.efratbaseball.com:8010'
module.exports = {
  register: ({first, last, email, carrier, phone, password }) => request({
    method: 'POST',
    url: `http://${DEV_HOST}/register`,
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