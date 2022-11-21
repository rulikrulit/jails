'use strict';
let JAILS;
module.exports = {
  name: 'Tanks',
  description: 'Bot for all tanks processes',
  init: function(jails) {
    console.log('TANKS BOT INITED!', jails);
    JAILS = jails;

    const botsSchedule = {};
    const botsFireSchedule = {};

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateBotSchedule() {
      const directions = ['left', 'right', 'top', 'bottom'];
      const time = getRandomInt(10, 150);
      const direction = directions[getRandomInt(0, 3)];

      return {
        time: time,
        direction: direction
      };
    }

    function generateBotFireSchedule() {
      const time = getRandomInt(25, 125);

      return time;
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

    function isObjectWithinRange(position1, position2, distortion) {
      if (Math.abs(position1[0] - position2[0]) < distortion[0] &&
          Math.abs(position1[1] - position2[1]) < distortion[1]
        ) {
        return true;
      }
    }

    setInterval(() => {

      if (!JAILS.modelInstances['TANKS0']) {

        JAILS.models['TANKS'].methods.create();
        jails.methods.updateModel({
          server: jails.server,
          conn: 'bot',
          data: {'model':'TANKS0','method':'reset'}
        });
      }

      const controllers = JAILS.modelInstances['TANKS0'].properties.controllers;
      const players = Object.keys(controllers);
      const playerTanks = JAILS.modelInstances['TANKS0'].properties.players;
      const bots = JAILS.modelInstances['TANKS0'].properties.bots;
      const bullets = JAILS.modelInstances['TANKS0'].properties.bullets;


      bots && bots.forEach(bot => {
        if (!botsSchedule[bot.name] || botsSchedule[bot.name].time <= 0) {
          botsSchedule[bot.name] = generateBotSchedule();
        }

        if (!botsFireSchedule[bot.name] || botsFireSchedule[bot.name] <= 0) {
          jails.methods.updateModel({
            server: jails.server,
            conn: 'bot',
            data: {'model':'TANKS0','method':'addBullet','data':{'type': 'bots', 'name':bot.name}}
          });
          botsFireSchedule[bot.name] = generateBotFireSchedule();
        }

        const schedule = botsSchedule[bot.name];
        const direction = schedule.direction;
        schedule.time--;
        botsFireSchedule[bot.name]--;

        const illegalMove = checkIllegalMove(direction, bot.position);

        if (!illegalMove) {
          jails.methods.updateModel({
            server: jails.server,
            conn: 'bot',
            data: {'model':'TANKS0','method':'move','data':{'type': 'bots', 'name':bot.name, 'direction': direction}}
          });
        } else {
          botsSchedule[bot.name] = generateBotSchedule();
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
          return;
        }

        if (bullet.owner.type === 'players') {
          bots && bots.forEach(bot => {
            const isHit = isObjectWithinRange(bullet.position, [bot.position[0] + 20, bot.position[1] + 20], [20, 20]);

            if (isHit) {
              jails.methods.updateModel({
                server: jails.server,
                conn: 'bot',
                data: {'model':'TANKS0','method':'removeBullet','data':{'type': 'bullets', 'name':bullet.name}}
              });
              jails.methods.updateModel({
                server: jails.server,
                conn: 'bot',
                data: {'model':'TANKS0','method':'removeTank','data':{'type': 'bots', 'name':bot.name}}
              });
              return;
            }
          });
        }

        if (bullet.owner.type === 'bots') {
          playerTanks && playerTanks.forEach(player => {
            const isHit = isObjectWithinRange(bullet.position, [player.position[0] + 20, player.position[1] + 20], [20, 20]);

            if (isHit) {
              jails.methods.updateModel({
                server: jails.server,
                conn: 'bot',
                data: {'model':'TANKS0','method':'removeBullet','data':{'type': 'bullets', 'name':bullet.name}}
              });
              jails.methods.updateModel({
                server: jails.server,
                conn: 'bot',
                data: {'model':'TANKS0','method':'removeTank','data':{'type': 'players', 'name':player.name}}
              });
              return;
            }
          });
        }

        jails.methods.updateModel({
          server: jails.server,
          conn: 'bot',
          data: {'model':'TANKS0','method':'move','data':{'type': 'bullets', 'name':bullet.name, 'direction': direction}}
        });
      });

      players && players.forEach(p => {
        const actions = controllers[p]?.actions;
        if (!actions) {
          return;
        }
        const actionNames = Object.keys(actions);
        actionNames.forEach(action => {
          switch (action) {
            case 'move':
              const direction = actions[action];
              const tank = JAILS.modelInstances['TANKS0'].properties.players.find(t => t.name === p);
              if (!tank) {
                return;
              }
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