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
        function shuffle(a) {
          var j, x, i;
          for (i = a.length - 1; i > 0; i--) {
              j = Math.floor(Math.random() * (i + 1));
              x = a[i];
              a[i] = a[j];
              a[j] = x;
          }
          return a;
        }
        function createColors() {
          var colors = [];
          ['red', 'green', 'orange', 'blue', 'yellow'].forEach(function(color, i) {
            for (let i = 1; i <= 20; i++) {
              colors.push(color);
            }
          });
          return shuffle(colors);
        }

        function setChunks(colors) {
          var i,j,temparray,chunk = 10, result = [];
          for (i = 0, j = colors.length; i < j; i+=chunk) {
              temparray = colors.slice(i,i + chunk);
              result.push(temparray);
          }

          result[4][4] = result[4][5] = result[5][4] = result[5][5] = 'empty';

          return result;
        }

        let colors = createColors();
        let board = setChunks(colors);
        self.properties = {
          board: board,
          active: null,
          removed: [],
          players: [],
          currentPlayer: null,
          gameStarted: false,
          order: []
        };

        return board;
      },
      move: function(req) {

        function validateMove(x, y) {
          let active = self.properties.active;
          let removed = self.properties.removed;

          let move;

          if (self.properties.board[y][x] !== 'empty') {
            return false;
          }

          if (self.properties.board[y][x] !== 'empty') {
            return false;
          }

          if (req.name !== self.properties.currentPlayer) {
            return false;
          }

          // move by x axis left
          if (
              (active.x - x) === 2 &&
              active.y === y
            ) {
            move = {x: active.x - 1, y: active.y};
          }

          // move by x axis right
          if (
              (x - active.x) === 2 &&
              active.y === y
            ) {
            move = {x: active.x + 1, y: active.y};
          }


          // move by y axis top
          if (
              (active.y - y) === 2 &&
              active.x === x
            ) {
            move = {x: active.x, y: active.y - 1};
          }

          // move by y axis bottom
          if (
              (y - active.y) === 2 &&
              active.x === x
            ) {
            move = {x: active.x, y: active.y + 1};
          }

          if (move && !removed.find(item => item.x === move.x && item.y === move.y)) {
            return move;
          }

          return false;
        }
        var x = req.x,
            y = req.y,
            active = self.properties.active,
            removed = validateMove(x, y);
            console.log('REMOVED', removed);

        if (removed) {
          self.properties.board[y][x] = self.properties.board[active.y][active.x];
          self.properties.board[active.y][active.x] = 'empty';
          self.properties.active = {x: x, y: y};
          self.properties.removed.push(removed);
        }
      },
      setActive: function(req) {
        if (self.properties.removed.length === 0 && req.name && req.name === self.properties.currentPlayer) {
          self.properties.active = req;
        }
      },
      finishMove: function(req) {
        if (req.name !== self.properties.currentPlayer) {
          return false;
        }

        self.properties.active = null;
        let currentPlayerObject = self.properties.players.find(player => player.name === self.properties.currentPlayer);
        self.properties.removed.forEach(item => {
          currentPlayerObject.bank[self.properties.board[item.y][item.x]]++;
          self.properties.board[item.y][item.x] = 'empty';
        })
        self.properties.removed = [];

        let currentIndex = self.properties.order.indexOf(self.properties.currentPlayer);
        console.log('currentIndex', currentIndex);
        self.properties.currentPlayer = self.properties.order[currentIndex + 1] || self.properties.order[0];
        self.properties.gameStarted = true;
      },
      join: function(req) {
        if (self.properties.gameStarted || self.properties.order.indexOf(req.name) > -1 || self.properties.order.length > 3 || !req.name) {
          return false;
        }
        self.properties.players.push({
          name: req.name,
          bank: {
            red: 0,
            green: 0,
            orange: 0,
            blue: 0,
            yellow: 0
          }
        });
        self.properties.order.push(req.name);
        if (self.properties.players.length === 1) {
          self.properties.currentPlayer = req.name;
        }
      }
    }
  }
}