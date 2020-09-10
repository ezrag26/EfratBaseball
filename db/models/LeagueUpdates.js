const LeagueUpdates = ({ sequelize, DataTypes }) => {

  return sequelize.define('leagueUpdate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },

    leagueId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    youngestAge: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    oldestAge: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  })
}

module.exports = LeagueUpdates