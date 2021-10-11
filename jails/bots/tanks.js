'use strict';
let JAILS;
module.exports = {
  name: 'Tanks',
  description: 'Bot for all tanks processes',
  init: function(jails) {
    console.log('TANKS BOT INITED!', jails);
    JAILS = jails;

    setInterval(() => {
      const controllers = JAILS.modelInstances['TANKS0'].properties.controllers;
      const players = Object.keys(controllers);
      jails.methods.updateModel({
        server: jails.server,
        conn: 'bot',
        data: {'model':'TANKS0','method':'move','data':{'type': 'bots', 'name':'bot1', 'direction': 'right'}}
      });

      players.forEach(p => {
        const actions = Object.keys(controllers[p].actions);
        const actionNames = Object.keys(actions);
        actionNames.forEach(action => {
          switch (action) {
            case 'move':
            jails.methods.updateModel({
              server: jails.server,
              conn: 'bot',
              data: {'model':'TANKS0','method':'move','data':{'type': 'players', 'name':p, 'direction': actions[action].value}}
            });
              break;
            default:
              console.log(action + ' is not implemented!');
          }
        });
      });
    }, 40);

  },
  get: function(msg) {
    console.log('bot recieved', msg);
  }
}