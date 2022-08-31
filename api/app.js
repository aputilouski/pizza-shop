require('./register-module-aliases');

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { strategies, env, db } = require('@config');
strategies.useJwtStrategy();
db.connect();

const { graphqlHTTP } = require('express-graphql');
const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');
const schema = require('./schema');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

app.use(
  '/graphql', //
  graphqlUploadExpress({ maxFileSize: 1024 * 1024 * 10, maxFiles: 10 }),
  graphqlHTTP({ schema, graphiql: env.is_development })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(env.cookie_secret));
app.use('/media', express.static(env.media_path));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => res.status(404).end());

module.exports = app;
