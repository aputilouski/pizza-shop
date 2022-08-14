const validateMiddleware = require('./validate');
const verifyUser = require('./verify-user');

module.exports = { ...validateMiddleware, verifyUser };
