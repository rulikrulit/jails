var config = {
  dev: {
    crypto: {
      client: 'aes192',
      password: 'some password'
    },
    JAILS: {
      ws: 'ws://localhost:8001/ws',
      allowAnonymousWsConnection: true
    },
    port: 5000,
    db: 'mongodb://localhost:27017/jails'
  },
  staging: {
    crypto: {
      client: 'aes192',
      password: 'some password'
    },
    JAILS: {
      ws: 'ws://18.116.59.253/ws',
      allowAnonymousWsConnection: true
    },
    port: 5000,
    db: 'mongodb://localhost:27017/jails'
  }
}

module.exports = function(app) {
  var env = 'staging';

  // Stab env into all sources
  config[env].env = env;
  config[env].JAILS.env = env;

  return config[env];
};