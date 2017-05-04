'use strict';

/**
 * Businesswise CRM
 *
 * @file helpers.js
 * @description Helpers
 * @module System
 * @author Lighten
 *
 */

module.exports.Promise = {
  prop: prop => (val => val[prop]),
  func: func => (val => val[func]()),
  nop: () => (() => null),
  inject: value => (() => value)
};

