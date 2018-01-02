'use strict';

var readFolder = require('./read-folder.js')();

module.exports = new Promise(function(resolve, reject) {
  let bots = [];
  readFolder('./jails/bots', function(err, data, next, fileName) {
    bots.push(require('../bots/' + fileName));
    next();
  }, function() {
    console.log('resolving bots');
    resolve(bots);
  });
});