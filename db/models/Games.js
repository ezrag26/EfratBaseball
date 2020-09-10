const MINS_DAY = 1440
const Game = ({ sequelize, DataTypes }) => {

  return sequelize.define('game', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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

module.exports = Game