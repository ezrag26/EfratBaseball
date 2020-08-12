const request = require('request-promise-native')

module.exports = {
  addLeague: ({ name }) => request({
    method: 'POST',
    url: 'http://localhost:8010/leagues',
    json: true,
    body: {
      name
    }
  }),

  addTeam: ({ leagueId, name, color }) => request({
    method: 'POST',
    url: `http://localhost:8010/leagues/${leagueId}/teams`,
    json: true,
    body: {
      name,
      color
    }
  }),

  addGame: ({ leagueId, date, time, away, home }) => request({
    method: 'POST',
    url: `http://localhost:8010/leagues/${leagueId}/games`,
    json: true,
    body: {
      date,
      time,
      away,
      home
    }
  })
}