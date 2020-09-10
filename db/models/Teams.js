const Team = ({ sequelize, DataTypes }) => {

  return sequelize.define('team', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },

    leagueId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  })
}

module.exports = Team