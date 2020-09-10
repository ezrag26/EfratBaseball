const AuthTokens = ({ sequelize, DataTypes }) => {

  return sequelize.define('authtoken', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  })
}

module.exports = AuthTokens