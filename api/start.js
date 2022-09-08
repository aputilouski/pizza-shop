require('./register-module-aliases');

const http = require('http');
const ws = require('ws');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { verifyUser } = require('@middleware');
const { strategies, env, db } = require('@config');
strategies.useJwtStrategy();
db.connect();

const { graphqlHTTP } = require('express-graphql');
const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');
const { useServer } = require('graphql-ws/lib/use/ws');
const schema = require('./schema');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(cookieParser(env.cookie_secret));

app.use(
  '/graphql', //
  (req, res, next) => {
    const authHeader = req.get('authorization');
    if (authHeader) verifyUser(req, res, next);
    else next();
  },
  graphqlUploadExpress({ maxFileSize: 1024 * 1024 * 10, maxFiles: 10 }),
  graphqlHTTP(req => ({
    schema,
    graphiql: env.is_development,
    context: { user: req.user },
  }))
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/media', express.static(env.media_path));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);

app.use((req, res) => res.status(404).end());

module.exports = (port, onError, onListening) => {
  const server = http.createServer(app);

  const wsServer = new ws.Server({ server, path: '/subscriptions' });
  useServer({ schema }, wsServer);

  server.listen(port);

  server.on('error', onError);
  server.on('listening', onListening);
};
