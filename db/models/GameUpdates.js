const MINS_DAY = 1440
const GameUpdates = ({ sequelize, DataTypes }) => {

  return sequelize.define('gameUpdate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },

    gameId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    time: {
      type: DataTypes.INTEGER,
      allowNull: true,
      min: 0,
      max: (MINS_DAY - 1)
    },

    isFinal: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },

    awayId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    homeId: {
      type: DataTypes.UUID,
      allowNull: false
    },

    awayRS: {
      type: DataTypes.INTEGER,
    },

    homeRS: {
      type: DataTypes.INTEGER,
    }
  })
}

module.exports = GameUpdates