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

    fs.writeFile(`${Config.appDataPath}/uploads/${digest}.${fileType[1]}`, buffer, 'binary', err => {
      if (err) {
        res.sendStatus(500).json(false);
        return;
      }
      res.json(`${digest}.${fileType[1]}`);
    });
  });

  const tasks = [
    __createAppDataPath('/uploads')
  ];

  return Promise.all(tasks);
};

module.exports = {
  init: __initUploads
};
