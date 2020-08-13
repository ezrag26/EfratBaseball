const randomBits = () => Math.random().toString(36).slice(2)

module.exports = {
  addLeague: ({ name }) => {
    return Promise.resolve(randomBits())
  },

  addTeam: ({ name, color }) => {
    return Promise.resolve(randomBits())
  },

  addGame: ({ date, time, away, home }) => {
    return Promise.resolve(randomBits())
  },

  getSchedule: ({ leagueId }) => {
    if (leagueId === '1') {
      return Promise.resolve({
        "2020-06-22": {
          away: { name: 'BMKI', color: 'green', runs: 7 },
          home: { name: 'Ariyot', color: 'yellow', runs: 4 }
        },
        "2020-06-19": {
          away: { name: 'Ariyot', color: 'yellow', runs: 3 },
          home: { name: 'Bombers', color: 'dodgerblue', runs: 5 }
        },
        "2020-06-26": {
          time: '2:30PM',
          away: { name: 'Bombers', color: 'dodgerblue', runs: null },
          home: { name: 'BMKI', color: 'green', runs: null }
        }
      })
    } else {
      return Promise.resolve({
        "2020-08-26": { time: '2:30PM', away: { name: 'Bombers', color: 'dodgerblue', runs: null }, home: { name: 'BMKI', color: 'green', runs: null } },
        "2020-08-22": { away: { name: 'Ariyot', color: 'yellow', runs: 3 }, home: { name: 'Bombers', color: 'dodgerblue', runs: 8 } },
        "2020-08-19": { away: { name: 'BMKI', color: 'green', runs: 2 }, home: { name: 'Ariyot', color: 'yellow', runs: 11 } }
      })
    }
  },

  getStandings: ({ leagueId }) => {
    return Promise.resolve({
      2: { name: 'Ariyot', wins: 5, loses: 3, ties: 0, RS: 63, RA: 37 },
      3: { name: 'Bombers', wins: 4, loses: 3, ties: 1, RS: 62, RA: 46 },
      1: { name: 'MBKI', wins: 2, loses: 5, ties: 1, RS: 34, RA: 76 }
    })
  }
}