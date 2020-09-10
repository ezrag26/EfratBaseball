const { fetchGetJson, fetchPostJson } = require('./request')
// const { DEV_HOST } = process.env
const DEV_HOST = 'dev.efratbaseball.com:8010'
module.exports = {
  addLeague: ({ name }) => {
    return fetchPostJson({
      url: `/admin/leagues`,
      body: {
        name
      }
    })
      .then(res => res.json())
  },

  editLeague: ({ leagueId, name }) => {
    return fetchPostJson({
      url: `/admin/leagues/${leagueId}`,
      body: {
        name
      }
    })
      .then(res => res.json())
  },

  fetchLeagues: () => {
    return fetchGetJson({ url: `http://${DEV_HOST}/leagues?sort=name` })
      .then(res => res.json())
    // return XMLHttpRequestAsPromise({
    //   method: 'GET',
    //   url: `http://${DEV_HOST}/leagues?sort=name`,
    //   options: {
    //     responseType: 'json'
    //   }
    // })
  },

  fetchStats: ({ leagueId }) => {
    return fetchGetJson({url: `http://${DEV_HOST}/leagues/${leagueId}/stats`})
      .then(res => res.json())
    // return XMLHttpRequestAsPromise({
    //   method: 'GET',
    //   url: `http://${DEV_HOST}/leagues/${leagueId}/stats`,
    //   options: {
    //     responseType: 'json'
    //   }
    // })
  },

  addGame: ({ leagueId, date, time, awayId, homeId }) => {
    return fetchPostJson({
      url: `http://${DEV_HOST}/admin/leagues/${leagueId}/schedule`,
      body: {
        date,
        time,
        awayId,
        homeId
      }
    })
      .then(res => res.json())
  },

  fetchSchedule: ({ leagueId }) => {
    return fetchGetJson({ url: `http://${DEV_HOST}/leagues/${leagueId}/schedule` })
      .then(res => res.json())
    // return XMLHttpRequestAsPromise({
    //   method: 'GET',
    //   url: `http://${DEV_HOST}/leagues/${leagueId}/schedule`,
    //   options: {
    //     responseType: 'json'
    //   }
    // })
  },

  addTeam: ({ leagueId, name, color }) => {
    return fetchPostJson({
      url: `/admin/leagues/${leagueId}/teams`,
      body: {
        name,
        color
      }
    })
      .then(res => res.json())
  },

  editTeam: ({ teamId, name, color }) => {
    return fetchPostJson({
      url: `/admin/teams/${teamId}`,
      body: {
        name,
        color
      }
    })
      .then(res => res.json())
  },

  fetchTeams: ({ leagueId }) => {
    return fetchGetJson({ url: `http://${DEV_HOST}/leagues/${leagueId}/teams` })
      .then(res => res.json())
    // return XMLHttpRequestAsPromise({
    //   method: 'GET',
    //   url: `http://${DEV_HOST}/leagues/${leagueId}/teams`,
    //   options: {
    //     responseType: 'json'
    //   }
    // })
  },
}