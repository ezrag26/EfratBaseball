const request = require('request-promise-native')

const HOSTNAME = 'localhost:8010'

module.exports = {
  addLeague: ({ name, youngestAge, oldestAge }) => request({
    method: 'POST',
    url: `http://${HOSTNAME}/admin/leagues`,
    json: true,
    bypass: true,
    body: {
      name,
      youngestAge,
      oldestAge,
      bypass: true
    }
  }),

  addTeam: ({ leagueId, name, color }) => request({
    method: 'POST',
    url: `http://${HOSTNAME}/admin/leagues/${leagueId}/teams`,
    json: true,
    body: {
      name,
      color,
      bypass: true
    }
  }),

  addGame: ({ leagueId, date, time, awayId, homeId, isFinal, awayRS, homeRS }) => request({
    method: 'POST',
    url: `http://${HOSTNAME}/admin/leagues/${leagueId}/games`,
    json: true,
    body: {
      date,
      time,
      awayId,
      homeId,
      isFinal,
      awayRS,
      homeRS,
      bypass: true
    }
  }),

  getTeams: ({ leagueId }) => request({
    method: 'GET',
    url: `http://${HOSTNAME}/leagues/${leagueId}/teams`,
    json: true
  }),

  getSchedule: ({ leagueId }) => request({
    method: 'GET',
    url: `http://${HOSTNAME}/leagues/${leagueId}/schedule`,
    json: true
  }),

  getStats: ({ leagueId }) => request({
    method: 'GET',
    url: `http://${HOSTNAME}/leagues/${leagueId}/stats`,
    json: true
  })
}