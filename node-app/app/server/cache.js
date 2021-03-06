'use strict';

/**
 * Dashboard for Labour Admin
 *
 * @file cache.js
 * @description Cache library for App Script
 * @module System
 * @author Chris Bates-Keegan
 *
 */

const cluster = require("cluster");
const Config = require("./config");
const EventEmitter = require('events');
const rest = require('restler');
const Logging = require('./logging');
const otp = require('./stotp');
const levelup = require('levelup');

/* ****************************************************************
 *
 * PRIVATE CONSTANTS
 *
 ******************************************************************/
const _Constants = {
  DEFAULT_CACHE_INTERVAL: 5 * 60 * 1000,
  ERROR_CACHE_INTERVAL: 5 * 1000,
  REQUEST_TIMEOUT: 30 * 1000,
  DEFAULTS: {
    team: []
  },
  FUNCTIONS: {
    team: 'team:list'
  },
  URLS: {
    team: Config.api.urls.team
  },
  URL_PARAMS: {
    team: {}
  }
};

/* ****************************************************************
 *
 * PRIVATE CONSTANTS
 *
 ******************************************************************/
const Constants = {
  Type: {
    TEAM: 'team'
  }
};

/* ****************************************************************
 *
 * DB
 *
 ******************************************************************/
const db = levelup(`${Config.appDataPath}/cache-${cluster.isWorker ? cluster.worker.id : 'master'}`);

/* ****************************************************************
 *
 * Cache
 *
 ******************************************************************/
class Cache extends EventEmitter {
  constructor(type) {
    super();

    if (!type || !_Constants.URLS[type]) {
      throw new Error(`Invalid or missing type ${type}`);
    }

    this._type = type;
    this._timeout = false;

    this._otp = otp.create({
      length: 12,
      salt: Config.api.key,
      mode: otp.Constants.Mode.ALPHANUMERIC
    });

    db.get(type, (err, value) => {
      if (err) {
        Logging.logError(err);
        this._data = _Constants.DEFAULTS[this._type];
        this._refresh();
        return;
      }

      this._data = JSON.parse(value);
      // Logging.logDebug(this._data);
      this.emit('cache-data', this._data);
      this._refresh();
    });
  }

  getData() {
    return Promise.resolve(this._data);
  }

  _refresh() {
    return new Promise((resolve, reject) => {
      this._timeout = false;

      const q = {
        token: this._otp.getCode(),
        fn: _Constants.FUNCTIONS[this._type]
      };
      for (let k in _Constants.URL_PARAMS[this._type]) {
        if (!Object.prototype.hasOwnProperty.call(_Constants.URL_PARAMS[this._type], k)) {
          continue;
        }

        q[k] = _Constants.URL_PARAMS[this._type][k];
      }

      Logging.log(`Refreshing Cache ${this._type.toUpperCase()}`, Logging.Constants.LogLevel.INFO);
      rest.get(_Constants.URLS[this._type], {timeout: _Constants.REQUEST_TIMEOUT, query: q})
        .on('success', data => {
          if (data.err === true) {
            Logging.logDebug(`CACHE REFRESH ERROR: ${this._type.toUpperCase()}: ${data.res}`);
            resolve(this._data);
            this._setTimeout(_Constants.ERROR_CACHE_INTERVAL);
            return;
          }

          Logging.log(`Refreshed Cache ${this._type.toUpperCase()}`, Logging.Constants.LogLevel.INFO);

          db.put(this._type, JSON.stringify(data.res), err => {
            if (err) {
              Logging.logError(err);
            }
          });
          this._data = data.res;
          resolve(this._data);
          this.emit('cache-data', this._data);
          this._setTimeout();
        })
        .on('fail', (data, response) => {
          this._setTimeout(_Constants.ERROR_CACHE_INTERVAL);
          Logging.logDebug(`CACHE REFRESH FAILED(${response.statusCode}): ${this._type.toUpperCase()}`);
          resolve(this._data);
        })
        .on('error', err => {
          Logging.logError(err);
          Logging.logDebug(`CACHE REFRESH ERROR(${err.syscall}:${err.code}): ${this._type.toUpperCase()}`);
          this._setTimeout(_Constants.ERROR_CACHE_INTERVAL);
          resolve(this._data);
        })
        .on('timeout', err => {
          Logging.logError(err);
          Logging.logDebug(`CACHE REFRESH TIMED OUT: ${this._type.toUpperCase()}`);
          this._setTimeout(_Constants.ERROR_CACHE_INTERVAL);
          resolve(this._data);
        });
    });
  }

  _setTimeout(timeout) {
    if (timeout === undefined) {
      timeout = _Constants.DEFAULT_CACHE_INTERVAL;
    }

    if (this._timeout) {
      Logging.log('WARNING ***TIMEOUT***', Logging.Constants.LogLevel.WARN);
    }

    const refresh = () => this._refresh();
    clearTimeout(this._timeout);
    Logging.log(`Scheduling Cache Refresh (${this._type.toUpperCase()}) ${timeout / 1000}s`
      , Logging.Constants.LogLevel.INFO);
    this._timeout = setTimeout(refresh, timeout);
  }
}

/* ****************************************************************
 *
 * Cache
 *
 ******************************************************************/
const _CACHES = {};
class CacheManager {
  static create(type) {
    _CACHES[type] = new Cache(type);
    return _CACHES[type];
  }
  static getCache(type) {
    return _CACHES[type];
  }
  static getData(type) {
    return _CACHES[type].getData();
  }
}

module.exports.Constants = Constants;
module.exports.Manager = CacheManager;
