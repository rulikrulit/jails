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
    db: 'mongodb://localhost:27017/alfresco'
  },
  staging: {
    crypto: {
      client: 'aes192',
      password: 'some password'
    },
    JAILS: {
      ws: 'ws://ec2-34-209-81-157.us-west-2.compute.amazonaws.com/ws'
    }
  }
}

module.exports = function(app) {
  var env = 'dev';

  // Stab env into all sources
  config[env].env = env;
  config[env].JAILS.env = env;

  return config[env];
};