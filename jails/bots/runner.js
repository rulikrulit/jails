'use strict';
let JAILS;
module.exports = {
  name: 'Runner',
  description: 'Dummy runner for the game that will use AI in future',
  init: function(jails) {
    console.log('BOT INITED!', jails);
    JAILS = jails;
    setInterval(() => {
      console.log('BOT MOVES!');
      const actions = ['left', 'bottom', 'right', 'top', 'jump'];
      let randomAction = actions[Math.floor(Math.random() * actions.length)];
      jails.methods.updateModel({
        server: jails.server,
        conn: 'bot',
        data: {"model":"TYPOHERO0","method":"move","data":{"direction":randomAction}}
      });
      // jails.broadcast(jails.server, '{"method":"updateModel", "data":{"model":"TYPOHERO0","method":"move","data":{"direction":"' + randomAction + '"}}, "serverData":false}');
    }, 8000);
  },
  get: function(msg) {
    console.log('bot recieved', msg);
    if (JAILS.modelInstances['TYPOHERO0'] &&
        JAILS.modelInstances['TYPOHERO0'].properties.position[0] === JAILS.modelInstances['TYPOHERO1'].properties.position[0] &&
        JAILS.modelInstances['TYPOHERO0'].properties.position[1] === JAILS.modelInstances['TYPOHERO1'].properties.position[1]) {
      console.log('ENDING GAME');
      JAILS.methods.updateModel({
        server: JAILS.server,
        conn: 'bot',
        data: {"model":"TYPOHEROBOARD0","method":"endGame"}
      });
      JAILS.modelInstances['TYPOHERO0'].properties.position = [0, 0];
      JAILS.modelInstances['TYPOHERO1'].properties.position = [9, 24];
      jails.methods.updateModel({
        server: jails.server,
        conn: 'bot',
        data: {"model":"TYPOHERO0","method":"move","data":{"direction":"left"}}
      });
    }
  }
}