'use strict';

/**
 * Dashboard for Labour Admin
 *
 * @file users.js
 * @description
 * @module System
 * @author Lighten
 *
 */

const Logging = require('./logging');
const Rhizome = require('rhizome-api-js');
const Cache = require('./cache');

/* ************************************************************
 *
 * USERS
 *
 **************************************************************/

class Users {
  init() {
    let team = Cache.Manager.getCache(Cache.Constants.Type.TEAM);
    team.on('cache-data', data => {
      Logging.log('Checking user roles');
      let t = [];

      const __updateUser = (uid, updates) => {
        return () => {
          Logging.log(`Update team member role: ${uid}`);
          return Rhizome.User.update(uid, updates)
            .then(Logging.Promise.logDebug('Updated User:'))
            .catch(Logging.Promise.logError());
        };
      };

      Rhizome.User.getAll()
        .then(users => {
          users.forEach(u => {
            if (!u.auth || u.auth.length < 1) {
              return;
            }

            let found = data.find(user => user.email === u.auth[0].email);
            if (found) {
              let updates = [];

              if (u.teamName != found.teamName) { // eslint-disable-line eqeqeq
                updates.push({
                  path: 'teamName',
                  value: found.teamName
                });
              }
              if (u.teamRole !== found.teamRole) {
                updates.push({
                  path: 'teamRole',
                  value: found.teamRole
                });
              }

              if (updates.length) {
                Logging.log(updates);
                t.push(__updateUser(u.id, updates));
              }
            }
          });

          return t.reduce((p, task) => {
            return p.then(task());
          }, Promise.resolve());
        })
        .catch(Logging.Promise.logError());
    });
  }
}

/* ************************************************************
 *
 * EXPORTS
 *
 **************************************************************/

module.exports = new Users();
