'use strict';
let JAILS;
module.exports = {
  name: 'Runner',
  description: 'Dummy runner for the game that will use AI in future',
  init: function(jails) {
    console.log('BOT INITED!', jails);
    JAILS = jails;
    function moveBot(model, interval) {
      interval = interval || 2000;
      setInterval(() => {
        console.log('BOT MOVES!');
        const actions = ['left', 'bottom', 'right', 'top', 'jump'];
        let randomAction = actions[Math.floor(Math.random() * actions.length)];
        jails.methods.updateModel({
          server: jails.server,
          conn: 'bot',
          data: {"model":model,"method":"move","data":{"direction":randomAction}}
        });
      }, interval);
    }

    function updateBullet(model, interval) {
      interval = interval || 2000;
      let modelInstance = JAILS.modelInstances[model];
      if (modelInstance) {
      }
    }
    setInterval(() => {
      // modelInstance.properties.bullets.forEach(function(bullet, index) {
        jails.methods.updateModel({
          server: jails.server,
          conn: 'bot',
          data: {'model':'TYPOHERO1','method':'moveBullet','data':{'index':0}}
        });
        jails.methods.updateModel({
          server: jails.server,
          conn: 'bot',
          data: {'model':'TYPOHERO0','method':'moveBullet','data':{'index':0}}
        });
      // });
    }, 2000);

    moveBot('TYPOHERO0', 8000);
    // updateBullet('TYPOHERO0', 2000);
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
        data: {'model':'TYPOHERO0','method':'move','data':{'direction':'left'}}
      });
    }
  }
}