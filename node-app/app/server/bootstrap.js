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

const Config = require('./config');
const Rhizome = require('rhizome-api-js');
const Auth = require('./auth');
const Cache = require('./cache');
const Uploads = require('./uploads');
const Users = require('./users');

/* ************************************************************
 *
 * BOOTSTRAP
 *
 **************************************************************/
const _installApp = app => {
  Rhizome.init({
    rhizomeUrl: Config.auth.rhizome.url,
    appToken: Config.auth.rhizome.appToken
  });

  Cache.Manager.create(Cache.Constants.Type.TEAM);
  Auth.init(app);
  Users.init(app);

  const tasks = [
    Uploads.init(app)
  ];

  return Promise.all(tasks);
};

module.exports = {
  app: _installApp
};
