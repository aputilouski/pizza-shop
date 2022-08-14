#!/usr/bin/env node

let debug;
const { normalize } = require('path');

try {
  if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
  const path = normalize(`${__dirname}/../../${process.env.NODE_ENV === 'production' ? '.env' : '.env.local'}`);
  require('dotenv').config({ path });
  debug = require('debug')('api:server');
  debug('NODE_ENV:', process.env.NODE_ENV);
  debug('ENV FILE:', path);
} catch (ex) {
  throw new Error('.env file is not found.');
}

const app = require('../app');
const http = require('http');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.API_PORT || '9000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

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
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
