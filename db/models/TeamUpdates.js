const TeamUpdates = ({ sequelize, DataTypes }) => {

  return sequelize.define('teamUpdate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },

    teamId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    color: {
      type: DataTypes.STRING,
      allowNull: true
    }
  })
}

module.exports = TeamUpdates