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
        1: {
          date: '19 Jun 2020',
          time: 'F',
          away: {name: 'Ariyot', color: 'yellow'},
          home: {name: 'Bombers', color: 'dodgerblue'}
        },
        2: {
          date: '22 Jun 2020',
          time: 'F',
          away: {name: 'BMKI', color: 'green'},
          home: {name: 'Ariyot', color: 'yellow'}
        },
        3: {
          date: '26 Jun 2020',
          time: '2:30PM',
          away: {name: 'Bombers', color: 'dodgerblue'},
          home: {name: 'BMKI', color: 'green'}
        }
      })
    } else {
      return Promise.resolve({
        1: { date: '19 Aug 2020', time: 'F', away: { name: 'BMKI', color: 'green' }, home: { name: 'Ariyot', color: 'yellow' } },
        2: { date: '22 Aug 2020', time: 'F', away: { name: 'Ariyot', color: 'yellow' }, home: { name: 'Bombers', color: 'dodgerblue' } },
        3: { date: '26 Aug 2020', time: '2:30PM', away: { name: 'Bombers', color: 'dodgerblue' }, home: { name: 'BMKI', color: 'green' } }
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