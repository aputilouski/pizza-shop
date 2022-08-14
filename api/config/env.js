const debug = require('debug')('api:server');

const config = {
  is_production: process.env.NODE_ENV === 'production',
  is_development: process.env.NODE_ENV === 'development',

  // DB
  postgres_db: process.env.POSTGRES_DB,
  postgres_user: process.env.POSTGRES_USER,
  postgres_user_password: process.env.POSTGRES_PASSWORD,
  postgres_host: process.env.POSTGRES_HOST,
  postgres_port: process.env.POSTGRES_PORT || 5432,

  // JWT
  jwt_secret: process.env.JWT_SECRET,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  session_expiry: process.env.SESSION_EXPIRY,
  refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY,
  cookie_secret: process.env.COOKIE_SECRET,
};

debug(config);

Object.keys(config).forEach(key => {
  if (config[key] === undefined) throw new Error(`Need to set value for environment variable: ${key}`);
});

module.exports = config;
