const debug = require('debug')('api:server');
const path = require('path');

const config = {
  is_production: process.env.NODE_ENV === 'production',
  is_development: process.env.NODE_ENV === 'development',

  mongodb_uri: process.env.MONGODB_URI,

  // JWT
  jwt_secret: process.env.JWT_SECRET,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  session_expiry: process.env.SESSION_EXPIRY,
  refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY,
  cookie_secret: process.env.COOKIE_SECRET,

  media_path: path.join(__dirname, '../../media'),

  // cloudinary
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};

debug(config);

Object.keys(config).forEach(key => {
  if (config[key] === undefined) throw new Error(`Need to set value for environment variable: ${key}`);
});

module.exports = config;
