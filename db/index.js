const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('postgres://dev:dev@localhost:5432/dev')
const bcrypt = require('bcrypt')

const { League, Team, Game, User, LeagueUpdate, TeamUpdate, GameUpdate, AuthToken } = require('./models')({ sequelize, DataTypes })

League.hasMany(Team)
GameUpdate.belongsTo(Team, { as: 'away' })
GameUpdate.belongsTo(Team, { as: 'home' })
League.hasMany(LeagueUpdate)
Team.hasMany(TeamUpdate)
Game.hasMany(GameUpdate)
AuthToken.belongsTo(User)

// sequelize.query('CREATE TABLE "session" (  "sid" varchar NOT NULL COLLATE "default", "sess" json NOT NULL, "expire" timestamp(6) NOT NULL)WITH (OIDS=FALSE);ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;')

// League.sync({ force: true })
//   .then(() => LeagueUpdate.sync({ force: true }))
//   .then(() => Team.sync({ force: true }))
//   .then(() => TeamUpdate.sync({ force: true }))
//   .then(() => Game.sync({ force: true }))
//   .then(() => GameUpdate.sync({ force: true }))
// User.sync({ force: true })
//   .then(() => AuthToken.sync({ force: true }))
//   .then(() => bcrypt.hash('admin', 10))
//   .then(hashedPassword =>
//     User.create({ role: 'superadmin', firstName: '', lastName: '', email: 'admin@efratbaseball.com', password: hashedPassword, carrier: '', phone: '' })
//   )

const gameStats = ({ runs, oppRS }) => {
  const thisOtherRunDiff = runs - oppRS

  return { wins: +(thisOtherRunDiff > 0), losses: +(thisOtherRunDiff < 0), ties: +(thisOtherRunDiff === 0), rs: runs, ra: oppRS }
}

const addStats = ({ accumulated = {}, current }) => {
  const { wins, losses, ties, rs, ra } = accumulated

  return {
    wins: wins + current.wins,
    losses: losses + current.losses,
    ties: ties + current.ties,
    rs: rs + current.rs,
    ra: ra + current.ra
  }
}

const defaultStats = ({ teams }) => teams.reduce((reduced, team) => ({
  ...reduced,
  [team.id]: { wins: 0, losses: 0, ties: 0, rs: 0, ra: 0 }
}), {})

module.exports = {
  addAuthTokenByUserId: ({ userId }) => AuthToken.create({
    token: '1',
    userId
  }),

  getUserIdByAuthToken: ({ token }) => AuthToken.findOne({ where: { token }, attributes: ['userId'] }),

  getUserByEmail: ({ email }) => User.findOne({ where: { email } }),

  getUserById: ({ id }) => User.findOne({ where: { id } }),

  addUser: ({ firstName, lastName, email, carrier, phone, password }) =>
    User.create({ firstName, lastName, email, carrier, phone, password, role: 'user' }),

  addLeague: () =>
    League.create()
      .then(({ id }) => id),

  editLeague: ({ leagueId, name, youngestAge, oldestAge }) =>
    LeagueUpdate.create({ leagueId, name, youngestAge, oldestAge })
      .then(({ leagueId, name, youngestAge, oldestAge }) => ({ id: leagueId, name, youngestAge, oldestAge })),

  getLeagues: ({ sort }) => League.findAll({ attributes: [ 'id' ] })
    .then(leagues => Promise.all(leagues.map(({ id }) => LeagueUpdate.findOne({ where: { leagueId: id }, order: [['createdAt', 'DESC']] })))
      .then(leagues => leagues.map(({ leagueId, name, youngestAge, oldestAge }) => ({ id: leagueId, name, youngestAge, oldestAge })))),

  addTeam: ({ leagueId }) =>
    Team.create({ leagueId })
      .then(({ id }) => id),

  editTeam: ({ teamId, name, color }) =>
    TeamUpdate.create({ teamId, name, color })
      .then(({ teamId, name, color }) => ({ id: teamId, name, color })),

  getTeams: ({ leagueId }) => Team.findAll({ raw: true, where: { leagueId }, attributes: [ 'id' ] })
    .then(teams => Promise.all(teams.map(team => TeamUpdate.findOne({ order: [['createdAt', 'DESC']], where: { teamId: team.id }, attributes: [ 'teamId', 'name', 'color' ] }))))
    .then(teams => teams.reduce((reduced, team) => ({
          ...reduced,
          [team.teamId]: {
            name: team.name,
            color: team.color
          }
        }), {})),

  addGame: ({ date, time, isFinal, awayId, homeId, awayRS, homeRS }) =>
    Game.create({ })
      .then(({ id: gameId }) => GameUpdate.create({ gameId, date, time, isFinal, awayId, homeId, awayRS, homeRS }))
      .then(({ gameId, date, time, isFinal, awayId, homeId, awayRS, homeRS }) =>
        ({ gameId, date, time, isFinal, awayId, homeId, awayRS, homeRS })),

  editGame: ({ gameId, date, time, isFinal, awayId, homeId, awayRS, homeRS }) =>
    GameUpdate.create({ gameId, date, time, isFinal, awayId, homeId, awayRS, homeRS })
      .then(({ gameId, date, time, isFinal, awayId, homeId, awayRS, homeRS }) =>
        ({ gameId, date, time, isFinal, awayId, homeId, awayRS, homeRS })),

  getSchedule: ({ leagueId, options: { groupByDate, sortDateAscending } = {} }) =>
    Promise.all([
      Team.findAll({ where: { leagueId }, attributes: ['id'] }),
      Game.findAll({ attributes: ['id'] }),
      GameUpdate.findAll({ raw: true, order: [ ['createdAt', 'DESC']/*, ['date', 'ASC'], ['time', 'ASC']*/ ] })
    ])
      .then(([ teams, games, gameUpdates ]) =>
        games.map(game => gameUpdates.find(gameUpdate => game.id === gameUpdate.gameId))
          .filter(game => teams.some(team => team.id === game.awayId || team.id === game.homeId))
          .reduce((schedule, game) => {
            const { date, createdAt, updatedAt, deletedAt, ...details } = game

            schedule[date] = schedule[date] || []
            schedule[date].push(details)

            return schedule
          }, {})
      ),

  getStats: ({ leagueId }) =>
    Promise.all([
      Team.findAll({ where: { leagueId }, attributes: ['id'] }),
      Game.findAll({ attributes: ['id'] }),
      GameUpdate.findAll({ raw: true, order: [ ['createdAt', 'DESC']/*, ['date', 'ASC'], ['time', 'ASC']*/ ] })
    ])
      .then(([ teams, games, gameUpdates]) =>
        games.map(game => gameUpdates.find(gameUpdate => game.id === gameUpdate.gameId))
          .filter(game => game.isFinal)
          .filter(game => teams.some(team => team.id === game.awayId || team.id === game.homeId))
          .reduce((accumStats, game) => {
            const { awayId, homeId, awayRS, homeRS } = game

            return {
              ...accumStats,
              [awayId]: addStats({ accumulated: accumStats[awayId], current: gameStats({ runs: awayRS, oppRS: homeRS}) }),
              [homeId]: addStats({ accumulated: accumStats[homeId], current: gameStats({ runs: homeRS, oppRS: awayRS}) })
            }
          }, defaultStats({ teams }))
      )
}