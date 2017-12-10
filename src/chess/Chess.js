import React, { Component } from 'react';
import JailsCreator from '../scripts/JailsCreator.js';
import './Chess.css';
import Chat from '../Chat.js';
import FIGURES from './figures'
class Chess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'Russ',
      chess: {
        board: [],
        history: [],
        removed: []
      },
      selectedCell: undefined
    };
  }

  setBoard() {
    let self = this;
    var Chess = this.jail.loadModel('CHESS');
    Chess.on('create', function(chess) {
      setBoard(chess);
    });
    Chess.on('getModel', function(chess) {
      console.log('checss', chess, self.jail);
      if (chess.id === 1) { // Chess id hardcoded
        setBoard(chess);
      } else {
        Chess.methods.create();
      }
    });
    function setBoard(chess) {
      self.chess = chess;
      console.log('chess', chess);
      if (!chess.properties.board) { // new board, need to reset for primary rendering
        chess.methods.reset();
      } else {
        self.setState({
          chess: chess.properties
        });
      }
      chess.on('move', function(params) {
        self.setState({
          chess: chess.properties
        });
      });
      chess.on('reset', function(params) {
        self.setState({
          chess: chess.properties
        });
      });
    }

    Chess.methods.getModel({id: 1}); // chat id hardcoded
  }

  componentDidMount() {
    let self = this;
    let jailsCreator = new JailsCreator();
    this.jail = jailsCreator.jail;
    jailsCreator.indexPromise.then(() => {
      self.setBoard();
    });
  }

  myPosition(i, j) {
    if (this.state.selectedCell) {
      this.chess.methods.move({
        from: this.state.selectedCell,
        to: [i, j],
        user: this.state.user
      })
      this.setState({
        selectedCell: undefined
      });
    } else {
      this.setState({
        selectedCell: [i, j]
      });
    }
  }

  getClass(i, j) {
    if (this.state.selectedCell && this.state.selectedCell[0] === i && this.state.selectedCell[1] === j) {
      return 'cell selected';
    } else {
      return 'cell';
    }
  }

  resetChess() {
    this.chess.methods.reset();
  }

  render() {
    let self = this;
    function renderRow(row, i) {
      return row.map((cell, j) => (
        <td onClick={(e) => self.myPosition(i, j)} key={'' + i + j} className={self.getClass(i, j)}>{cell ? FIGURES[cell.color][cell.figure]() : ''}</td>
      ));
    }
    const board = this.state.chess.board.map((row, i) => (
      <tr key={i} className="row">{renderRow(row, i)}</tr>
    ));
    const history = this.state.chess.history.map((item, i) => (
      <div key={i} className="item">{item}</div>
    ));
    return (
      <div className="chess">
        <button type="button" className="btn" onClick={this.resetChess.bind(this)}>Reset</button>
        <div className="grid grid_float container clearfix">
          <div className="col removed" id="removed">
          </div>
          <div className="board col">
            <table className="chess-board">
              <tbody>
                {board}
              </tbody>
            </table>
          </div>
          <div className="col">
            <Chat></Chat>
            <div id="history">{history}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chess;
