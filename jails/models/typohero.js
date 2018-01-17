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
    position: [0, 0]
  },
  instanceMethods: function(self) {
    return {
      move: function(params) {
        let response;
        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
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
      }
    };
  }
}