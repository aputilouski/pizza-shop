const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const User = db => {
  const Model = db.define('user', {
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false,
      validate: { len: [3, 32] },
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: { len: [3, 50] },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
  });

  Model.publicAttributes = ['uuid', 'username', 'name'];

  Model.prototype.getPublicAttributes = function (attributes = Model.publicAttributes) {
    const user = {};
    attributes.forEach(key => {
      user[key] = this[key];
    });
    return user;
  };

  Model.prototype.confirmPassword = function (string) {
    return bcrypt.compare(string, this.password);
  };

  Model.encryptPassword = async str => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(str, salt);
  };

  Model.associate = ({ RefreshToken }) => {
    Model.hasMany(RefreshToken, {
      as: 'tokens',
      onDelete: 'cascade',
      foreignKey: { name: 'user_id', allowNull: false, unique: false },
    });
  };
  return Model;
};

module.exports = User;
