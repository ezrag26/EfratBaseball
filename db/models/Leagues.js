const League = ({ sequelize, DataTypes }) => {

  return sequelize.define('league', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    }
  })
}

module.exports = League