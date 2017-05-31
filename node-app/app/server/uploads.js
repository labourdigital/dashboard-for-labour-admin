'use strict';

/**
 * Dashboard for Labour Admin
 *
 * @file uploads.js
 * @description
 * @module System
 * @author Coders for Labour
 *
 */

const fs = require('fs');
const crypto = require('crypto');
const Config = require('./config');
const Helpers = require('./helpers');
const Logging = require('./logging');
const Storage = require('@google-cloud/storage');
const sb = require('stream-buffers');

const storage = Storage(); // eslint-disable-line new-cap

/* ************************************************************
 *
 * HELPERS
 *
 **************************************************************/
const __createAppDataPath = path => {
  return new Promise((resolve, reject) => {
    fs.mkdir(`${Config.appDataPath}`, err => {
      if (err && err.code !== 'EEXIST') {
        throw err;
      }

      fs.mkdir(`${Config.appDataPath}${path}`, err => {
        if (err && err.code !== 'EEXIST') {
          throw err;
        }
        resolve();
      });
    });
  });
};

/* ************************************************************
 *
 * Uploads
 *
 **************************************************************/
const __initUploads = app => {
  app.post('/api/v1/image-upload', (req, res) => {
    if (!req.user) {
      res.sendStatus(401).json(false);
      return;
    }

    let file = req.body.file;
    let rex = /^data:(\w+\/\w+);base64,(.+)$/;
    if (rex.test(file) === false) {
      res.sendStatus(400).json(false);
      return;
    }

    let matches = rex.exec(file);
    let mimeType = matches[1];
    let data = matches[2];
    let buffer = Buffer.from(data, 'base64');

    let fileType = mimeType.split('/');
    if (fileType[0] !== 'image') {
      res.sendStatus(400).json(false);
      return;
    }

    let hash = crypto.createHash('sha256');
    hash.update(data);
    let digest = hash.digest('hex');

    let fname = `${digest}.${fileType[1]}`;
    let gfile = storage
      .bucket(Config.cdnBucket)
      .file(fname);

    gfile.exists()
      .then(exists => {
        if (exists[0]) {
          Logging.log(`File ${fname} already exists.`);
          return;
        }

        return Helpers.GCloud.Storage.saveBuffer(gfile, buffer, {contentType: `images/${fileType[1]}`});
      })
      .then(() => res.json(fname))
      .catch(Logging.Promise.logError());
  });

  const tasks = [
    __createAppDataPath('/uploads')
  ];

  return Promise.all(tasks);
};

module.exports = {
  init: __initUploads
};
