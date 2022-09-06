const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const env = require('./env');
const { User } = require('@models');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwt_secret,
};

module.exports.useJwtStrategy = () => {
  passport.use(
    new JwtStrategy(options, async function (jwt_payload, done) {
      User.findById(jwt_payload.id)
        .select('-tokens')
        .then(user => {
          if (user) done(null, user);
          else done(null, false);
        })
        .catch(error => done(error, false));
    })
  );
};

module.exports.generateAccessToken = payload => {
  const token = jwt.sign(payload, env.jwt_secret, { expiresIn: eval(env.session_expiry) });
  return `Bearer ${token}`;
};

module.exports.generateRefreshToken = payload =>
  jwt.sign(payload, env.refresh_token_secret, {
    expiresIn: eval(env.refresh_token_expiry),
  });

module.exports.verifyRefreshToken = token => jwt.verify(token, env.refresh_token_secret);

module.exports.COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  secure: env.is_production,
  signed: true,
  maxAge: eval(env.refresh_token_expiry) * 1000,
  sameSite: 'strict',
};
