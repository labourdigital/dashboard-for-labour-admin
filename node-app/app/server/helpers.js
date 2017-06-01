'use strict';

/**
 * Dashboard for Labour Admin
 *
 * @file helpers.js
 * @description Helpers
 * @module System
 * @author Lighten
 *
 */

const Storage = require('@google-cloud/storage');
const sb = require('stream-buffers');

const storage = Storage(); // eslint-disable-line new-cap

/* ************************************************************
*
* GOOGLE CLOUD PLATFORM
*
**************************************************************/
module.exports.GCloud = {
  Storage: {
    saveBuffer: (file, buffer, metadata, isPrivate) => {
      return new Promise((resolve, reject) => {
        let sbuffer = new sb.ReadableStreamBuffer();
        sbuffer.put(buffer);
        sbuffer.stop();

        sbuffer.pipe(file.createWriteStream({
          public: !isPrivate ? true : false,
          metadata: metadata
        }))
          .on('finish', resolve)
          .on('err', reject);
      });
    }
  }
};

/* ************************************************************
*
* PROMISE
*
**************************************************************/
module.exports.Promise = {
  prop: prop => (val => val[prop]),
  func: func => (val => val[func]()),
  nop: () => (() => null),
  inject: value => (() => value)
};

