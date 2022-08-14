require('pg').defaults.parseInt8 = true;
const { Sequelize } = require('sequelize');
const env = require('./env');
const debug = require('debug')('api:database');

const sequelize = new Sequelize(env.postgres_db, env.postgres_user, env.postgres_user_password, {
  host: env.postgres_host,
  port: env.postgres_port,
  dialect: 'postgres',
  logging: env.is_development ? str => debug(str) : false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const authenticate = () =>
  sequelize
    .authenticate()
    .then(() => debug('Database connected.'))
    .catch(error => debug('DATABASE CONNECTION ERROR', error));

const sync = () =>
  sequelize
    .sync({ alter: true })
    .then(() => debug('All tables were successfully synced.'))
    .catch(err => debug('SYNC ERROR', err));

module.exports = { sequelize, authenticate, sync };
