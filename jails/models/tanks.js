/* SAMPLE MODEL
* Should have following properties:
* methods - additional model methods
* properties - global model properties
* instanceMethods - methods for each modal instance
* args:
* - request - obj
* - response - available only on FE, result of instanceMethod. If instanceMethod doesn't return anything it's false
* instanceProperties - default instance properties
*
*/
module.exports = {
  methods: {},
  properties: {},
  instanceProperties: {},
  instanceMethods: function(self) {
    return {
      reset: function() {
        self.properties = {
          field: {},
          bots: [
            {
              type: 'bots',
              position: [0, 0],
              name: 'bot1',
              speed: 2,
              direction: 'bottom'
            },
            {
              type: 'bots',
              position: [0, 0],
              name: 'bot2',
              speed: 2,
              direction: 'bottom'
            },
            {
              type: 'bots',
              position: [0, 0],
              name: 'bot3',
              speed: 2,
              direction: 'bottom'
            },
            {
              type: 'bots',
              position: [0, 0],
              name: 'bot4',
              speed: 5,
              direction: 'bottom'
            },
            {
              type: 'bots',
              position: [0, 0],
              name: 'bot5',
              speed: 5,
              direction: 'bottom'
            }
          ],
          players: [],
          bullets: [],
          controllers: {},
          meta: {
            lastBulletId: 0,
            lastBotId: 5,
          }
        }
      },
      move: function(req) {
        var name = req.name,
            direction = req.direction,
            type = req.type;

        var entity = self.properties[type].find(e => name === e.name);

        switch (direction) {
          case 'left':
            entity.position[0] -= entity.speed;
            entity.direction = direction;
            break;
          case 'right':
            entity.position[0] += entity.speed;
            entity.direction = direction;
            break;
          case 'top':
            entity.position[1] -= entity.speed;
            entity.direction = direction;
            break;
          case 'bottom':
            entity.position[1] += entity.speed;
            entity.direction = direction;
            break;
          // default:
          //   console.log('unexpected direction for tank model', direction);
        }
      },
      addBullet: function(req) {
        var type = req.type,
            tank = self.properties[type].find(t => t.name === req.name),
            position = [...tank.position],
            direction = tank.direction;

        const id = self.properties.meta.lastBulletId++;

        self.properties.bullets.push({
          position: position,
          owner: tank,
          speed: 10,
          direction: direction,
          name: id
        });
      },
      removeBullet: function(req) {
        var name = req.name;

        const bulletIndex = self.properties.bullets.findIndex(b => b.name === "name");

        if (bulletIndex) {
          self.properties.bullets.splice(bulletIndex, 1);
        }
      },
      addTank: function(req) {
        var name = req.name,
            type = req.type,
            position = [0, 0];

        self.properties[type].push({
          type: type,
          position: position,
          name: name,
          speed: 1,
          direction: 'bottom'
        });

        if (type === 'players') {
          self.properties.controllers[name] = {
            actions: {}
          }
        }
      },
      scheduleControllerAction: function(req) {
        var name = req.name,
            action = req.action,
            value = req.value;

        self.properties.controllers[name].actions[action] = value;
      }
    };
  }
}