const test = require('ava')
const {
  addLeague,
  addTeam,
  addGame
} = require('./helpers/test/request')

const setUpLeagueAndGames = () => {
  return addLeague({ name: 'New League' })
    .then(leagueId => Promise.all([
        { name: 'Yankees', color: 'blue' },
        { name: 'Cardinals', color: 'red' },
        { name: 'Pirates', color: 'yellow' }
      ])
        .then(teams => Promise.resolve(teams.map(({ name, color }) => addTeam({ leagueId, name, color }))))
        .then(teamIds => Promise.all([
            { date: '', time: '', away: teamIds[0], home: teamIds[1] },
            { date: '', time: '', away: teamIds[1], home: teamIds[2] },
            { date: '', time: '', away: teamIds[2], home: teamIds[0] },
          ])
          .then(games => Promise.resolve(games.map(({ date, time, away, home }) => addGame({ leagueId, date, time, away, home }))))
        )
        .then(gameIds => leagueId)
    )
}

test('adds a league', t => {
  return addLeague({ name: 'New League' })
    .then(leagueId => {
      t.assert(leagueId)
    })
})

test('adds teams to a league', t => {
  return addLeague({ name: 'New League' })
    .then(leagueId => Promise.all([
      { name: 'Yankees', color: 'blue' },
      { name: 'Cardinals', color: 'red' },
      { name: 'Pirates', color: 'yellow' }
    ])
      .then(teams => Promise.resolve(teams.map(({ name, color }) => addTeam({ leagueId, name, color }))))
        .then(teamIds => {
          t.assert(teamIds[0])
          t.assert(teamIds[1])
          t.assert(teamIds[2])
        })
    )
})

test('adds games to a league', t => {
  return addLeague({ name: 'New League' })
    .then(leagueId => Promise.all([
      { name: 'Yankees', color: 'blue' },
      { name: 'Cardinals', color: 'red' },
      { name: 'Pirates', color: 'yellow' }
    ])
      .then(teams => Promise.resolve(teams.map(({ name, color }) => addTeam({ leagueId, name, color }))))
      .then(teamIds => Promise.all([
        { date: '', time: '', away: teamIds[0], home: teamIds[1] },
        { date: '', time: '', away: teamIds[1], home: teamIds[2] },
        { date: '', time: '', away: teamIds[2], home: teamIds[0] },
      ])
        .then(games => Promise.resolve(games.map(({ date, time, away, home }) => addGame({ leagueId, date, time, away, home }))))
        .then(gameIds => {
          t.assert(gameIds[0])
          t.assert(gameIds[1])
          t.assert(gameIds[2])
        })
      )
    )
})

test('retrieves schedule for specified leagueId', t => {
  return setUpLeagueAndGames()
    .then(leagueId => {
      t.fail()
      //
    })
})