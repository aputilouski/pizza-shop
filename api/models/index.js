const { sequelize, authenticate, sync } = require('@config/db');

const User = require('./User')(sequelize);
const RefreshToken = require('./RefreshToken')(sequelize);

const models = {
  User,
  RefreshToken,
};

Object.values(models).forEach(Model => {
  if (Model.associate) Model.associate(models);
});

authenticate();

// sync();

module.exports = models;
