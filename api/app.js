require('./register-module-aliases');

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { strategies, env, db } = require('@config');
strategies.useJwtStrategy();
db.connect();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(env.cookie_secret));
// const path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => res.status(404).end());

module.exports = app;
