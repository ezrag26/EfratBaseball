const test = require('ava')
const {
  addLeague,
  addTeam,
  addGame,
  getTeams,
  getSchedule,
  getStats
} = require('./helpers/test/request')

// { name: 'Yankees', color: '#1c2841' }
// { name: 'Pirates', color: '#FDB827' }
// { name: 'Cardinals', color: '#C41E3A' }

const { randomString } = require('./helpers/unique')

const MINS_DAY = 1440

const findIdByTeamName = ({ teams, name }) => {
  return Object.keys(teams).find(teamId => teams[teamId].name === name)
}

const setUpLeagueAndGames = ({ teams, gamesDetails }) => {
  return addLeague({ name: randomString() })
    .then(({ id: leagueId }) => Promise.all(teams.map(team => addTeam({ leagueId, ...team })))
      .then(() => getTeams({ leagueId }))
      .then(teams => gamesDetails.map(({ away, home, ...rest }) => ({
        ...rest,
        awayId: findIdByTeamName({ teams, name: away }),
        homeId: findIdByTeamName({ teams, name: home })
      })))
      .then(games => Promise.all(games.map(game => addGame({ ...game }))))
      .then(games => leagueId)
    )
}

test('adds a league', t => {
  const leagueName = randomString()
  return addLeague({ name: leagueName, youngestAge: 8, oldestAge: 10 })
    .then(({ id, name, youngestAge, oldestAge }) => {
      t.assert(id)
      t.assert(name === leagueName)
      t.assert(youngestAge === 8)
      t.assert(oldestAge === 10)
    })
})

test('adds teams to a league', t => {
  return addLeague({ name: randomString() })
    .then(({ id: leagueId }) => Promise.all([
      { name: 'Rockies', color: '#33006f' },
      { name: 'Angels', color: '#ba0021' },
      { name: 'Tigers', color: '#182d55' }
    ])
      .then(teams => Promise.all(teams.map(team => addTeam({ leagueId, ...team }))))
      .then(teams => {
        teams = teams.map(({ name, color }) => ({ name, color }))
        t.deepEqual(teams[0], { name: 'Rockies', color: '#33006f' })
        t.deepEqual(teams[1], { name: 'Angels', color: '#ba0021' })
        t.deepEqual(teams[2], { name: 'Tigers', color: '#182d55' })
      })
    )
})

test.serial('adds games to a league', t => {
  return addLeague({ name: randomString() })
    .then(({ id: leagueId }) => Promise.all([
      { name: 'Giants', color: '#fd5a1e' },
      { name: 'Rays', color: '#092c5c' },
      { name: 'Padres', color: '#2F241D' }
    ])
      .then(teams => Promise.all(teams.map(team => addTeam({ leagueId, ...team }))))
      .then(teams => Promise.all([
        { date: '2019-05-14', time: 0, awayId: teams[0].id, homeId: teams[1].id },
        { date: '2019-05-14', time: 514, awayId: teams[1].id, homeId: teams[2].id },
        { date: '2019-05-14', time: MINS_DAY - 1, awayId: teams[2].id, homeId: teams[0].id }
      ])
        .then(games => Promise.all(games.map(game => addGame({ ...game }))))
        .then(games => getTeams({ leagueId })
          .then(teams => {
            games = games.map(({ id, gameId, ...rest }) => rest)
            t.deepEqual(games[0], { date: '2019-05-14', time: 0, isFinal: false, awayId: findIdByTeamName({ teams, name: 'Giants' }), homeId: findIdByTeamName({ teams, name: 'Rays' }), awayRS: 0, homeRS: 0 })
            t.deepEqual(games[1], { date: '2019-05-14', time: 514, isFinal: false, awayId: findIdByTeamName({ teams, name: 'Rays' }), homeId: findIdByTeamName({ teams, name: 'Padres' }), awayRS: 0, homeRS: 0 })
            t.deepEqual(games[2], { date: '2019-05-14', time: MINS_DAY - 1, isFinal: false, awayId: findIdByTeamName({ teams, name: 'Padres' }), homeId: findIdByTeamName({ teams, name: 'Giants' }), awayRS: 0, homeRS: 0 })
          })
        )
      )
    )
})

test.serial('retrieves schedule for specified leagueId', t => {
  return setUpLeagueAndGames({
    teams: [
      { name: 'Royals', color: '#174885' },
      { name: 'Athletics', color: '#003831' },
      { name: 'Reds', color: '#c6011f' }
    ],
    gamesDetails: [
      { date: '2019-05-14', time: 0, away: 'Royals', home: 'Athletics', awayRS: 5, homeRS: 2, isFinal: true },
      { date: '2019-05-14', time: MINS_DAY / 2, away: 'Athletics', home: 'Reds', awayRS: 3, homeRS: 0 },
      { date: '2019-05-14', time: MINS_DAY / 2 + 2, away: 'Reds', home: 'Royals' }
    ]
  })
    .then(leagueId => Promise.all([getSchedule({ leagueId }), getTeams({ leagueId })]))
    .then(([schedule, teams]) => {
      const schedWithoutId = Object.keys(schedule).reduce(( reduced, date) => ({
        ...reduced,
        [date]: schedule[date].map(({ id, gameId, ...game}) => game )
      }), {})
      t.deepEqual(schedWithoutId, {
        '2019-05-14': [
          { time: 0, isFinal: true, awayId: findIdByTeamName({ teams, name: 'Royals' }), homeId: findIdByTeamName({ teams, name: 'Athletics' }), awayRS: 5, homeRS: 2 },
          { time: MINS_DAY / 2, isFinal: false, awayId: findIdByTeamName({ teams, name: 'Athletics' }), homeId: findIdByTeamName({ teams, name: 'Reds' }), awayRS: 3, homeRS: 0 },
          { time: MINS_DAY / 2 + 2, isFinal: false, awayId: findIdByTeamName({ teams, name: 'Reds' }), homeId: findIdByTeamName({ teams, name: 'Royals' }), awayRS: 0, homeRS: 0 }
        ]
      })
    })
})

test.serial('retrieves wins, losses, ties, runs scored, and runs against for each team in a specified leagueId, based on all final games', t => {
  return setUpLeagueAndGames({
    teams: [
      { name: 'Yankees', color: '#1c2841' },
      { name: 'Astros', color: '#eb6e1f' },
      { name: 'Pirates', color: '#FDB827' }
    ],
    gamesDetails: [
      { date: '2019-06-14', time: 0, away: 'Yankees', home: 'Astros', awayRS: 5, homeRS: 2, isFinal: true },
      { date: '2019-06-14', time: 514, away: 'Astros', home: 'Pirates', awayRS: 1, homeRS: 1, isFinal: true },
      { date: '2019-06-14', time: MINS_DAY - 1, away: 'Pirates', home: 'Yankees', awayRS: 2, homeRS: 6, isFinal: true },
      { date: '2019-06-16', time: MINS_DAY / 2, away: 'Yankees', home: 'Astros', awayRS: 5, homeRS: 2, isFinal: true },
      { date: '2019-06-26', time: 0, away: 'Astros', home: 'Pirates', awayRS: 4, homeRS: 5 },
      { date: '2019-06-26', time: 1000, away: 'Pirates', home: 'Yankees' }
    ]
  })
    .then(leagueId => Promise.all([getStats({ leagueId }), getTeams({ leagueId })]))
    .then(([standings, teams]) => {
      t.deepEqual(standings, {
        [findIdByTeamName({ teams, name: 'Yankees' })]: { wins: 3, losses: 0, ties: 0, rs: 16, ra: 6 },
        [findIdByTeamName({ teams, name: 'Astros' })]: { wins: 0, losses: 2, ties: 1, rs: 5, ra: 11 },
        [findIdByTeamName({ teams, name: 'Pirates' })]: { wins: 0, losses: 1, ties: 1, rs: 3, ra: 7 }
      })
    })
})