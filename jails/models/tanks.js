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
              speed: 2
            },
            {
              type: 'bots',
              position: [0, 0],
              name: 'bot2',
              speed: 2
            },
            {
              type: 'bots',
              position: [0, 0],
              name: 'bot3',
              speed: 2
            },
            {
              type: 'bots',
              position: [0, 0],
              name: 'bot4',
              speed: 5
            },
            {
              type: 'bots',
              position: [0, 0],
              name: 'bot5',
              speed: 5
            }
          ],
          players: [],
          controllers: {}
        }
      },
      move: function(req) {
        var name = req.name,
            direction = req.direction,
            type = req.type;

        var tank = self.properties[type].find(tank => name === tank.name);

        switch (direction) {
          case 'left':
            tank.position[0] -= tank.speed;
            break;
          case 'right':
            tank.position[0] += tank.speed;
            break;
          case 'top':
            tank.position[1] -= tank.speed;
            break;
          case 'bottom':
            tank.position[1] += tank.speed;
            break;
          // default:
          //   console.log('unexpected direction for tank model', direction);
        }
      },
      add: function(req) {
        var name = req.name,
            type = req.type,
            position = [0, 0];

        self.properties[type].push({
          type: type,
          position: position,
          name: name,
          speed: 1
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