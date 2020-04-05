'use strict';

// requires:
// authorization module
var fs = require('fs');
var getBots = require('./jails-bots.js');
var DefaultModel = require('../models/DefaultModel.js');
console.log('DefaultModel', DefaultModel);

const synchInterval = 10000;

module.exports = function(app) {

  var MongoClient = require('mongodb').MongoClient;

  var ws = require('nodejs-websocket');
  var cookieParser = require('cookie-parser');

  // getBots.then(function(bots) {
  //   bots.forEach(function(bot) {
  //     console.log('testing bot', bot.name);
  //     bot.get(bot.name, ' is working properly');
  //   });
  // });

  var broadcast = function (server, msg) {
    getBots.then(function(bots) {
      bots.forEach(function(bot) {
        bot.get(msg);
      });
    });
    server.connections.forEach(function (conn) {
        conn.sendText(msg);
    });
  };

  var feModelsString = '';

  var JAILS = {
    models: {}, // Stores model constructors
    modelInstances: {}, // Stores all model instances in format "modelName" + id
    index: {} // Stores array of model ids in format modelName: [1, 2, ..., id]
  };

  JAILS.registerModel = function(modelName, data) {
    var defaults = function(modelName) {
        return {
          create: function(data) {
            var lastId, id, dataKeys;

            data = data || {};
            dataKeys = Object.keys(data);

            if (!Array.isArray(JAILS.index[modelName])) { // Set model index to array if it wasn't
              JAILS.index[modelName] = [];
            }

            if (JAILS.index[modelName].length > 0) {
              lastId = JAILS.index[modelName][JAILS.index[modelName].length - 1]; // last item in index
              id = lastId + 1;
            } else {
              id = 0;
            }
            JAILS.index[modelName].push(id);

            JAILS.modelInstances[modelName + id] = {
              id: id,
              instanceOf: modelName
            };

            JAILS.modelInstances[modelName + id].methods = JAILS.models[modelName].instanceMethods(JAILS.modelInstances[modelName + id]);
            JAILS.modelInstances[modelName + id].properties = JAILS.models[modelName].instanceProperties; // setting default properties

            JAILS.modelInstances[modelName + id].properties = data; // bottom overriding should be fixed sometime;
            // dataKeys.forEach(function(key) { // overwriting default properties with ones from data for create
            //   JAILS.modelInstances[modelName + id].properties[key] = data[key];
            // });

            return JAILS.modelInstances[modelName + id];
          },
          update: function(data) {},
          delete: function(data) {},
          find: function(data) {}
        };
      },
      defaultKeys = Object.keys(defaults);

    // Exit if model already exists
    if (JAILS.models[modelName]) {
      console.warn('Model ' + model + ' already exists! Make sure you use unique names for models');
      return;
    }

    JAILS.models[modelName] = data;
    JAILS.models[modelName].methods = defaults(modelName);

    // defaultKeys.forEach(function(key) { // setting default Model methods;

    //   if (!JAILS.models[modelName].methods.hasOwnProperty(key)) { // no key in model methods, adding default;
    //     JAILS.models[modelName].methods[key] = defaults.key;
    //   } else {
    //     console.warn('Careful! Overwritten default method ' + key + ' for ' + modelName);
    //   }

    // });  

  };

  app.helpers.readFolder('./jails/models/', function(err, data, next, fileName) {
    var modelName = fileName.split('.js')[0]; // remove .js
    if (err) {
      console.log('ERROR registering model ' + modelName, err);
      next();
      return false;
    }
    console.log('registering model ' + modelName);

    feModelsString += data.replace('module.exports', 'MODELS.' + modelName);

    JAILS.registerModel(
      modelName,
      require('../models/' + fileName) // require model object
    );

    next();
  }, function() {
    console.log('model registration complete');
    // Use syncToDb first to reset all the data to default on each start
    // Start the process after all models are loaded to be able to read their methods
    // cleanDb(); // use to clean mess in DB
    syncFromDb();
    setInterval(syncToDb, synchInterval);
  });

  var setConnectionName = function(conn) {

  };

  var syncToDb = function() {
    // TODO: add model if it was missing. Set a flag to check whether it was saved already to avoid find
    var models = Object.keys(JAILS.modelInstances),
      THIS = {};

    console.log('setting models to synch', JSON.stringify(models));
    models.forEach(function(model) {
      MongoClient.connect('mongodb://localhost:27017/alfresco', function(err, db) {
        if (err) {
          throw err;
        }
        db.collection('models').find().toArray(function(err, result) {
          // console.log('all models', result);
        });
        db.collection('models').findAndModify(
          {name: model}, // query
          [['_id','asc']], // sort
          { // update
            $set: {
              properties: JAILS.modelInstances[model].properties,
              id: JAILS.modelInstances[model].id,
              instanceOf: JAILS.modelInstances[model].instanceOf
            }
          },
          {upsert: true} // options (update if exists, write if does not)
        );
        db.close();
      });

    });
  };
  var cleanDb = function() {
    MongoClient.connect('mongodb://localhost:27017/alfresco', function(err, db) {
      db.collection('models').remove();
      db.close();
    });
  }
  var syncFromDb = function() {
    var models = Object.keys(JAILS.modelInstances);
    MongoClient.connect('mongodb://localhost:27017/alfresco', function(err, db) {
      db.collection('models').find().toArray(function(err, result) {
        result.forEach(function(model) {
          JAILS.modelInstances[model.name] = model;
          JAILS.modelInstances[model.name].methods = JAILS.models[model.instanceOf].instanceMethods(model); // load instanceMethods from prototype
        });
        db.close();
      });
    });
    // models.forEach(function(model) {
    //   MongoClient.connect('mongodb://localhost:27017/alfresco', function(err, db) {
    //     db.collection('models').find({name: model}).toArray(function(err, result) {
    //       console.log('syncFromDb', result);
    //       if (result.length === 0) {
    //         db.collection('models').insert({
    //           name: model,
    //           data: JAILS.modelInstances[model].properties
    //         });
    //       }
    //       JAILS.models[model].properties = result[0].properties;
    //       console.log('updating model object', model, JSON.stringify(result));
    //       db.close();
    //     });   
    //   });
    // });
  };

  // Is not supported. May require update
  // var createMissingDocuments = function() {
  //   var models = Object.keys(JAILS.modelInstances),
  //     promises = [],
  //     THIS;
  //   models.forEach(function(model, i) {
  //     MongoClient.connect('mongodb://localhost:27017/alfresco', function(err, db) {
  //       db.collection('models').find({name: model}).toArray(function(err, result) {
  //         if (err) {
  //           throw err;
  //         }
  //         if (result.length === 0) {
  //           db.collection('models').insert({
  //             name: model,
  //             data: JAILS.modelInstances[model].data
  //           });
  //         }
  //         console.log(model, result);
  //         db.close();
  //       });   
  //     });

  //     // if (i === models.length - 1) {
  //     //   THIS.promise
  //     // }
  //   });
  // };

  // Is not supported. May require update
  // var cleanDocuments = function() {
  //   var models = Object.keys(JAILS.models);

  //   models.forEach(function(model) {
  //     MongoClient.connect('mongodb://localhost:27017/alfresco', function(err, db) {
  //       db.collection('models').remove({name: model});
  //       db.close();
  //     });
  //   });

  // };

  var METHODS = {
    broadcast: function(params) {
      broadcast(params.server, params.connection.user + ':' + params.data);
    },
    update: function(params) {
      var server = params.server,
        request = params.data,
        path = request.path,
        newData = request.value,
        obj = DATA;

      console.log('starting update', params.data);
      for (var i = 0; i < path.length; i++) {
        if (i === path.length - 1) {
          obj[path[i]] = newData;
          broadcast(server, '{"method":"update", "data":' + JSON.stringify(DATA) + '}');
        } else {
          if (!obj.hasOwnProperty(path[i])) {
            obj[path[i]] = {};
          }
          obj = obj[path[i]];
        }
      }
    },
    updateModel: function(params) {
      var request = params.data,
        server = params.server,
        method = request.method,
        model = JAILS.modelInstances[request.model],
        data = request.data;
      console.log(request.model, JAILS.modelInstances);
      var result = model.methods[method](data) || false;

      broadcast(server, '{"method":"updateModel", "data":' + JSON.stringify(request) + ', "serverData":' + JSON.stringify(result) + '}');
    },
    getModel: function(params) {
      var request = params.data,
        server = params.server,
        model = JAILS.modelInstances[request.model + (request.data ? request.data.id : '')],
        connection = params.connection,
        response = {
          model: request.model,
          data: model ? model : 'no model found!'
        };

      connection.sendText('{"method":"getModel", "data":' + JSON.stringify(response) + ', "req":' + JSON.stringify(request) + '}');
    },
    getIndex: function(params) {
      var request = params.data,
        server = params.server,
        index = JAILS.index,
        connection = params.connection,
        response = {
          index: index,
          user: connection.user
        };

      connection.sendText('{"method":"getIndex", "data":' + JSON.stringify(response) + '}');
    },
    create: function(params) {
      console.log('j', JAILS.models, params.data.model);
      var request = params.data,
        server = params.server,
        model = JAILS.models[request.model],
        properties = request.data,
        connection = params.connection,
        response = {
          model: request.model,
          properties: request.data,
          data: model.methods.create(properties) // Create new model and return its content
        };
      console.log('broadcasting', '{"method":"create", "data":' + JSON.stringify(response) + '}');
      broadcast(server, '{"method":"create", "data":' + JSON.stringify(response) + '}');
    }
  }



  var server = ws.createServer(function (conn) {
      try {
        var cookies = conn.headers.cookie.split('; ');
        var cookie;
        cookies.forEach(function(c) {
          var name = c.split('=')[0];
          var value = c.split('=')[1];

          if (name === 'wsconnection') {
            cookie = value;
          }
        });
        var session = app.modules.crypto.decrypt(cookie);
      } catch (e) {
        if (!app.config.JAILS.allowAnonymousWsConnection) {
          // close unallowed anonymous connection
          console.log('error creating connection session', e);
          conn.close(401, 'Couldn\'t identify session');
        } else {
          console.log('Anonymous connection esteblished. `allowAnonymousWsConnection` is true');
        }
      }

      // set user variables if connection is not anonymous
      if (!app.config.JAILS.allowAnonymousWsConnection) {
        conn.session = cookie;
        conn.user = session.split(':')[0];
        conn.sessionStart = session.split(':')[1];
      }

      conn.on("text", function (str) {
          console.log("Received "+str);

          var request = JSON.parse(str);
          var method = request.method;
          var data = request.data;
          console.log('meth', method);
          METHODS[method]({
            data: data,
            connection: conn,
            server: server
          });
      });
      conn.on("close", function (code, reason) {
          console.log("Connection closed")
      });
      conn.on("error", function (error) {
          console.log("error", error);
      });
  }).listen(8001)

  app.get('/jails.js', function(req, res){
    fs.readFile('./jails/assets/jails.js', 'utf8', function(err, data) {
      res.send('(function(CONFIG) {var MODELS = {};' + feModelsString + ';' + data + '})(' + JSON.stringify(app.config.JAILS) + ');');
    });

  });

  JAILS.server = server;
  JAILS.broadcast = broadcast;
  JAILS.methods = METHODS;

  // TODO: reconfigure bots

  // getBots.then(function(bots) {
  //   JAILS.bots = bots;
  //   bots.forEach(function(bot) {
  //     bot.init(JAILS);
  //   });
  // });


  return JAILS;
};