const { fetchGetJson, fetchPostJson } = require('./request')

module.exports = {
  baseUrl: BASE_API_URL,

  addLeague: ({ name }) => {
    return fetchPostJson({
      url: `${BASE_API_URL}/admin/leagues`,
      body: {
        name
      }
    })
      .then(res => res.json())
  },

  editLeague: ({ leagueId, name }) => {
    return fetchPostJson({
      url: `${BASE_API_URL}/admin/leagues/${leagueId}`,
      body: {
        name
      }
    })
      .then(res => res.json())
  },

  fetchLeagues: () => {
    return fetchGetJson({ url: `${BASE_API_URL}/leagues?sort=name` })
      .then(res => res.json())
  },

  fetchStats: ({ leagueId }) => {
    return fetchGetJson({url: `${BASE_API_URL}/leagues/${leagueId}/stats`})
      .then(res => res.json())
  },

  addGame: ({ date, time, awayId, homeId }) => {
    return fetchPostJson({
      url: `${BASE_API_URL}/admin/games`,
      body: {
        date,
        time,
        awayId,
        homeId
      }
    })
      .then(res => res.json())
  },

  editGame: ({ gameId, edit }) => {
    const { date, time, awayId, homeId, awayRS, homeRS, isFinal } = edit
    return fetchPostJson({
      url: `${BASE_API_URL}/admin/games/${gameId}`,
      body: {
        date,
        time,
        awayId,
        homeId,
        awayRS,
        homeRS,
        isFinal
      }
    })
      .then(res => res.json())
  },

  fetchSchedule: ({ leagueId, page, numItems }) => {
    return fetchGetJson({ url: `${BASE_API_URL}/leagues/${leagueId}/schedule?page=${page}&numItems=${numItems}` })
      .then(res => res.json())
  },

  addTeam: ({ leagueId, name, color }) => {
    return fetchPostJson({
      url: `${BASE_API_URL}/admin/leagues/${leagueId}/teams`,
      body: {
        name,
        color
      }
    })
      .then(res => res.json())
  },

  editTeam: ({ leagueId, teamId, name, color }) => {
    return fetchPostJson({
      url: `${BASE_API_URL}/admin/leagues/${leagueId}/teams/${teamId}`,
      body: {
        name,
        color
      }
    })
      .then(res => res.json())
  },

  fetchTeams: ({ leagueId }) => {
    return fetchGetJson({ url: `${BASE_API_URL}/leagues/${leagueId}/teams` })
      .then(res => res.json())
  },
}
