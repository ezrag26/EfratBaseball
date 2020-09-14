
const Game = ({ sequelize, DataTypes }) => {

  return sequelize.define('game', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    }
  })
}

module.exports = Game