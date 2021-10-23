'use strict';
let JAILS;
module.exports = {
  name: 'Tanks',
  description: 'Bot for all tanks processes',
  init: function(jails) {
    console.log('TANKS BOT INITED!', jails);
    JAILS = jails;

    const botsSchedule = {};

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateBotSchedule() {
      const directions = ['left', 'right', 'top', 'bottom'];
      const time = getRandomInt(20, 200);
      const direction = directions[getRandomInt(0, 3)];

      return {
        time: time,
        direction: direction
      };
    }

    function checkIllegalMove(direction, position) {
      const fieldDimentions = {
        left: 0,
        right: 600,
        top: 0,
        bottom: 600
      };
      const boundary = fieldDimentions[direction];

      let illegalMove = false;

      switch (direction) {
        case 'left':
          illegalMove = position[0] <= boundary;
          break;
        case 'right':
          illegalMove = position[0] >= boundary;
          break;
        case 'top':
          illegalMove = position[1] <= boundary;
          break;
        case 'bottom':
          illegalMove = position[1] >= boundary;
          break;
      }

      return illegalMove;

    }

    setInterval(() => {
      const controllers = JAILS.modelInstances['TANKS0'].properties.controllers;
      const players = Object.keys(controllers);
      const bots = JAILS.modelInstances['TANKS0'].properties.bots;
      const bullets = JAILS.modelInstances['TANKS0'].properties.bullets;


      bots && bots.forEach(bot => {
        if (!botsSchedule[bot.name] || botsSchedule[bot.name].time <= 0) {
          botsSchedule[bot.name] = generateBotSchedule();
        }

        const schedule = botsSchedule[bot.name];
        const direction = schedule.direction;
        schedule.time--;

        const illegalMove = checkIllegalMove(direction, bot.position);

        if (!illegalMove) {
          jails.methods.updateModel({
            server: jails.server,
            conn: 'bot',
            data: {'model':'TANKS0','method':'move','data':{'type': 'bots', 'name':bot.name, 'direction': direction}}
          });
        }

      });

      bullets && bullets.forEach(bullet => {
        const direction = bullet.direction;

        const illegalMove = checkIllegalMove(direction, bullet.position);

        if (illegalMove) {
          jails.methods.updateModel({
            server: jails.server,
            conn: 'bot',
            data: {'model':'TANKS0','method':'removeBullet','data':{'type': 'bullets', 'name':bullet.name}}
          });
        } else {
          jails.methods.updateModel({
            server: jails.server,
            conn: 'bot',
            data: {'model':'TANKS0','method':'move','data':{'type': 'bullets', 'name':bullet.name, 'direction': direction}}
          });
        }

      });

      players && players.forEach(p => {
        const actions = controllers[p].actions;
        const actionNames = Object.keys(actions);
        actionNames.forEach(action => {
          switch (action) {
            case 'move':
              const direction = actions[action];
              const tank = JAILS.modelInstances['TANKS0'].properties.players.find(t => t.name === p);
              const illegalMove = checkIllegalMove(direction, tank.position);

              if (!illegalMove) {
                jails.methods.updateModel({
                  server: jails.server,
                  conn: 'bot',
                  data: {'model':'TANKS0','method':'move','data':{'type': 'players', 'name':p, 'direction': actions[action]}}
                });
              }
              break;
            default:
              console.log(action + ' is not implemented!');
          }
        });
      });
    }, 40);

  },
  get: function(msg) {
    // This is bot getting data from app callback
    // console.log('bot recieved', msg);
  }
}