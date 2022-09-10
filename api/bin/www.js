#!/usr/bin/env node

const { normalize } = require('path');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const path = normalize(`${__dirname}/../../${process.env.NODE_ENV === 'production' ? '.env' : '.env.local'}`);
require('dotenv').config({ path });

const debug = require('debug')('api:server');
debug('NODE_ENV:', process.env.NODE_ENV);
debug('ENV FILE:', path);

const app = require('../index');

const port = normalizePort(process.env.API_PORT || '9000');

app(port, onError, onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = this.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
