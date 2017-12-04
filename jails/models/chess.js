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
        self.properties = {board: [
          [
            {color: 'white', figure: 'tower'},
            {color: 'white', figure: 'horse'},
            {color: 'white', figure: 'officer'},
            {color: 'white', figure: 'queen'},
            {color: 'white', figure: 'king'},
            {color: 'white', figure: 'officer'},
            {color: 'white', figure: 'horse'},
            {color: 'white', figure: 'tower'}
          ],
          [
            {color: 'white', figure: 'pawn'},
            {color: 'white', figure: 'pawn'},
            {color: 'white', figure: 'pawn'},
            {color: 'white', figure: 'pawn'},
            {color: 'white', figure: 'pawn'},
            {color: 'white', figure: 'pawn'},
            {color: 'white', figure: 'pawn'},
            {color: 'white', figure: 'pawn'}
          ],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [
            {color: 'black', figure: 'pawn'},
            {color: 'black', figure: 'pawn'},
            {color: 'black', figure: 'pawn'},
            {color: 'black', figure: 'pawn'},
            {color: 'black', figure: 'pawn'},
            {color: 'black', figure: 'pawn'},
            {color: 'black', figure: 'pawn'},
            {color: 'black', figure: 'pawn'}
          ],
          [
            {color: 'black', figure: 'tower'},
            {color: 'black', figure: 'horse'},
            {color: 'black', figure: 'officer'},
            {color: 'black', figure: 'queen'},
            {color: 'black', figure: 'king'},
            {color: 'black', figure: 'officer'},
            {color: 'black', figure: 'horse'},
            {color: 'black', figure: 'tower'}
          ]
        ],
        removed: [],
        history: []}
      },
      move: function(req) {
        var from = req.from,
            to = req.to,
            figure = self.properties.board[from[0]][from[1]];

        if (self.properties.board[to[0]][to[1]]) {
          self.properties.removed.push({
            color: self.properties.board[to[0]][to[1]].color,
            figure: self.properties.board[to[0]][to[1]].figure
          });
        }

        self.properties.board[from[0]][from[1]] = null;
        self.properties.board[to[0]][to[1]] = figure;
        self.properties.history.push(req.user + ':' + 'ABCDEFGH'[from[1]] + (from[0] + 1) + '->' + 'ABCDEFGH'[to[1]] + (to[0] + 1));
      }
    };
  }
}