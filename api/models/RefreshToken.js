const { DataTypes, Sequelize } = require('sequelize');

const RefreshToken = db => {
  const Model = db.define(
    'refresh_token',
    {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
    },
    { updatedAt: false }
  );

  Model.associate = ({ User }) => {
    Model.belongsTo(User, {
      as: 'user',
      onDelete: 'cascade',
      foreignKey: { name: 'user_id', allowNull: false, unique: false },
    });
  };
  return Model;
};

module.exports = RefreshToken;
