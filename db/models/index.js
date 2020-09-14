const models = {
  League: require('./Leagues'),
  Team: require('./Teams'),
  Game: require('./Games'),
  User: require('./Users'),
  LeagueUpdate: require('./LeagueUpdates'),
  TeamUpdate: require('./TeamUpdates'),
  GameUpdate: require('./GameUpdates'),
  AuthToken: require('./AuthTokens')
}

module.exports = ({ sequelize, DataTypes }) => {
  return Object.keys(models).reduce((sequelized, model) =>
    ({ ...sequelized, [model]: models[model]({ sequelize, DataTypes }) }), {})
}