require('./register-module-aliases');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { strategies, env } = require('@config');
strategies.useJwtStrategy();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(env.cookie_secret));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);

module.exports = app;
