'use strict';

/**
 * Dashboard for Labour Admin
 *
 * @file bootstrap.js
 * @description
 * @module System
 * @author Coders for Labour
 *
 */

const os = require('os');
const cluster = require('cluster');
const Config = require('./config');
const Logging = require('./logging');
const Rhizome = require('rhizome-api-js');
const Auth = require('./auth');
const Cache = require('./cache');
const Uploads = require('./uploads');
const Users = require('./users');

const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
// const LevelStore = require('level-session-store')(session);
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');

/* ********************************************************************************
 *
 *
 *
 **********************************************************************************/
const processes = os.cpus().length;
const _workers = [];

/* ********************************************************************************
 *
 * WORKERS
 *
 **********************************************************************************/
const __spawnWorkers = () => {
  Logging.log(`Spawning ${processes} REST Workers`);

  const __spawn = idx => {
    _workers[idx] = cluster.fork();
  };

  for (let x = 0; x < processes; x++) {
    __spawn(x);
  }
};

/* ********************************************************************************
 *
 * WORKER
 *
 **********************************************************************************/
const __initWorker = () => {
  let app = express();
  app.enable('trust proxy', 1);
  app.use(morgan('short'));
  app.use(bodyParser.json({limit: '5mb'}));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(methodOverride());
  app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: Config.auth.sessionSecret,
    store: new RedisStore({
      // url: Config.redis.url,
      logErrors: true
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.listen(Config.listenPort);

  Cache.Manager.create(Cache.Constants.Type.TEAM);
  Auth.init(app);
  Users.init();

  const tasks = [
    Uploads.init(app)
  ];

  return Promise.all(tasks);
};

/* ********************************************************************************
 *
 * MASTER
 *
 **********************************************************************************/
const __initMaster = () => {
  __spawnWorkers();

  return Promise.resolve();
};

/* ************************************************************
 *
 * BOOTSTRAP
 *
 **************************************************************/
const _installApp = app => {
  let p = null;

  Rhizome.init({
    rhizomeUrl: `http://${Config.auth.rhizome.url}/api/v1`,
    appToken: Config.auth.rhizome.appToken
  });

  if (cluster.isMaster) {
    p = __initMaster();
  } else {
    p = __initWorker();
  }

  return p.then(() => cluster.isMaster);
};

module.exports = {
  app: _installApp
};
