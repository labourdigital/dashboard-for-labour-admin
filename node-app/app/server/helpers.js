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

const sb = require('stream-buffers');

/* ************************************************************
*
* GOOGLE CLOUD PLATFORM
*
**************************************************************/
module.exports.GCloud = {
  Storage: {
    saveBuffer: (file, buffer, metadata, isPrivate) => {
      return new Promise((resolve, reject) => {
        const isPublic = isPrivate !== true;

        let sbuffer = new sb.ReadableStreamBuffer();
        sbuffer.put(buffer);
        sbuffer.stop();

        sbuffer.pipe(file.createWriteStream({
          public: isPublic,
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

