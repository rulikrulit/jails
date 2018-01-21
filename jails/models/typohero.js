/* SAMPLE MODEL
* Should have following properties:
* methods - additional model methods
* properties - global model properties
* instanceMethods - methods for each modal instance
* instanceProperties - default instance properties
*
*/
'use strict';
const boardSize = [10, 25];
module.exports = {
  methods: {},
  properties: {},
  instanceProperties: {
    position: [0, 0],
    bullets: []
  },
  instanceMethods: function(self) {
    return {
      move: function(params) {
        let response;
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        function fireBullet(direction) {
          self.properties.bullets = self.properties.bullets || [];
          let bullet = {
            position: [
              self.properties.position[0],
              self.properties.position[1]
            ],
            direction: direction
          };
          self.properties.bullets = [bullet];
        }
        switch (params.direction) {
          case 'left':
            self.properties.position[1]--;
            break;
          case 'right':
            self.properties.position[1]++;
            break;
          case 'top':
            self.properties.position[0]++;
            break;
          case 'bottom':
            self.properties.position[0]--;
            break;
          case 'jump':
            self.properties.position[0] += getRandomInt(-2, 2);
            self.properties.position[1] += getRandomInt(-2, 2);
            response = self.properties.position;
            break;
          case 'fire left':
            fireBullet('left');
            break;
          case 'fire right':
            fireBullet('right');
            break;
          case 'fire top':
            fireBullet('top');
            break;
          case 'fire bottom':
            fireBullet('bottom');
            break;
        }
        if (self.properties.position[0] > (boardSize[0] - 1)) {
          self.properties.position[0] = boardSize[0] - 1;
        }
        if (self.properties.position[0] < 0) {
          self.properties.position[0] = 0;
        }
        if (self.properties.position[1] > (boardSize[1] - 1)) {
          self.properties.position[1] = boardSize[1] - 1;
        }
        if (self.properties.position[1] < 0) {
          self.properties.position[1] = 0;
        }
        return response;
      },
      moveBullet: function(params) {
        let bulletIndex = params.index;
        let bullet = self.properties.bullets[bulletIndex];

        if (!bullet) {
          return false;
        }
       
        switch (bullet.direction) {
          case 'left':
            bullet.position[1]--;
            break;
          case 'right':
            bullet.position[1]++;
            break;
          case 'top':
            bullet.position[0]++;
            break;
          case 'bottom':
            bullet.position[0]--;
            break;
        }
        if (bullet.position[0] > (boardSize[0] - 1) ||
            bullet.position[0] < 0 ||
            bullet.position[1] > (boardSize[1] - 1) ||
            bullet.position[1] < 0) {
          self.properties.bullets.splice(bulletIndex, 1);
        }
      }
    };
  }
}