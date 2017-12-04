import React, { Component } from 'react';
import './Chess.css';
import Chat from '../Chat.js';
import FIGURES from './figures'
class Chess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'Russ',
      board: [],
      history: [],
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
          board: chess.properties.board,
          history: chess.properties.history
        });
      }
      chess.on('move', function(params) {
        self.setState({
          board: chess.properties.board,
          history: chess.properties.history
        });
      });
      chess.on('reset', function(params) {
        self.setState({
          board: chess.properties.board,
          history: chess.properties.history
        });
      });
    }

    Chess.methods.getModel({id: 1}); // chat id hardcoded
  }

  componentDidMount() {
    let self = this;
    this.jail = window.Jails({
      debug: true
    });
    this.jail.on('getIndex', function() {
      self.setBoard();
    });
    this.jail.getIndex();
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
    const board = this.state.board.map((row, i) => (
      <tr key={i} className="row">{renderRow(row, i)}</tr>
    ));
    const history = this.state.history.map((item, i) => (
      <div key={i} className="item">{item}</div>
    ));
    return (
      <div className="chess">
        <button type="button" class="btn" onClick={this.resetChess.bind(this)}>Reset</button>
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
            <Chat jail={this.jail}></Chat>
            <div id="history">{history}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chess;
