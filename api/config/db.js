const env = require('./env');
const debug = require('debug')('api:database');
const mongoose = require('mongoose');

const connect = () =>
  mongoose
    .connect(env.mongodb_uri)
    .then(() => debug('Database connected'))
    .catch(error => debug('DATABASE CONNECTION ERROR', error));

module.exports = { connect };
