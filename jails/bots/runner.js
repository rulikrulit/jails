'use strict';

module.exports = {
  name: 'Runner',
  description: 'Dummy runner for the game that will use AI in future',
  init: function(jails) {
    console.log('BOT INITED!', jails);
    setInterval(() => {
      console.log('BOT MOVES!');
      const actions = ['left', 'bottom'];
      let randomAction = actions[Math.floor(Math.random() * actions.length)];
      jails.methods.updateModel({
        server: jails.server,
        conn: 'bot',
        data: {"model":"TYPOHERO0","method":"move","data":{"direction":randomAction}}
      });
      // jails.broadcast(jails.server, '{"method":"updateModel", "data":{"model":"TYPOHERO0","method":"move","data":{"direction":"' + randomAction + '"}}, "serverData":false}');
    }, 2000);
  },
  get: function(msg) {
    console.log('bot recieved', msg);
  }
}