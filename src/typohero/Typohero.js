import React, { Component } from 'react';
import JailsCreator from '../scripts/JailsCreator.js';
import './Typohero.css';
import Chat from '../Chat.js';
import Artur from './heros/Artur.js';
import Robot from './heros/Robot.js';

let TypoheroModel;

class Typohero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hero: {},
      bot: {},
      currentSpell: '',
      gameFinished: false
    };
  }

  updateSpell(event) {
    this.setState({currentSpell: event.target.value});
  }

  castSpell(event) {
    event.preventDefault();
    this.hero.methods.move({
      direction: this.state.currentSpell
    });
    this.setState({currentSpell: ''});
  }

  renderColumns(nRows, nCols, currentRow) {
    let self = this;
    return Array.apply(null, {length: nCols}).map(function(a, currentCol) {
      let className = 'board__cell',
        cellModel;

      if (currentCol === 5 && currentRow === 8) {
        className += ' marked';
      }
      if (self.state.hero.position && (currentCol === self.state.hero.position[1]) && (9 - currentRow) === self.state.hero.position[0]) {
        cellModel = Artur();
      }
      if (self.state.bot.position && (currentCol === self.state.bot.position[1]) && (9 - currentRow) === self.state.bot.position[0]) {
        cellModel = Robot();
      }
      return (
        <td className={className} key={currentCol}>{cellModel || ''}</td>
      );
    });
  }

  renderRows(nRows, nCols) {
    let self = this;
    return Array.apply(null, {length: nRows}).map(function(a, currentRow) {
      const cols = self.renderColumns(nRows, nCols, currentRow);
      return (
        <tr key={currentRow}>{cols}</tr>
      );
    });
  }

  boardHtml() {
    const height = 10;
    const width = 25;

    let self = this;

    return self.renderRows(height, width);
  }

  gameFinishedModalHtml() {
    return(
      <h1>You won!</h1>
    )
  }

  render() {
    let self = this;

    console.log('state', self.state);
    const board = self.boardHtml();
    let gameFinishedModal = null;
    if (self.state.gameFinished) {
      gameFinishedModal = self.gameFinishedModalHtml();
    }
    return (
      <div className="Typohero">
        {gameFinishedModal}
        <table className="typohero-board">
          <tbody>
            {board}
          </tbody>
        </table>
        <form className="spellCaster" id="spellCaster" onSubmit={this.castSpell.bind(this)}>
          <label>
            Spell:&nbsp;
            <input autoFocus="true" type="text" value={this.state.currentSpell} onChange={this.updateSpell.bind(this)} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }


  loadHero(options) {
    console.log('loading hero', options);
    let self = this;
    TypoheroModel = TypoheroModel || this.jail.loadModel('TYPOHERO');
    TypoheroModel.on('create', function(hero) {
      loadHero(hero);
    });
    TypoheroModel.on('getModel', function(hero) {
      if (hero.id === options.id) { // hero id hardcoded
        loadHero(hero);
      }
      if (hero.id === undefined) {
        TypoheroModel.methods.create({
          position: [9, 24]
        });
      }
    });
    function loadHero(hero) {
      self[options.type] = hero;
      let newState = self.state;
      newState[options.type] = hero.properties;
      self.setState(newState);
      hero.on('move', function(params, resp) {
        if (params.direction === 'jump') {
          let hero = self.state[options.type];
          hero.position = resp;
          self.setState({[options.type]: hero});
        } else {
          self.setState({[options.type]: hero.properties});
        }
      });
    }

    TypoheroModel.methods.getModel({id: options.id}); // chat id hardcoded
  }

  loadBoard() {
    let self = this;
    let Typoheroboard = this.jail.loadModel('TYPOHEROBOARD');
    Typoheroboard.on('create', function(board) {
      board.on('setDependencies', function(board) {
        loadBoard(board);
      });
      board.on('endGame', function() {
        self.setState({gameFinished: true});
      });
      board.methods.setDependencies({
        botId: 0,
        heroId: 1
      });
    });
    Typoheroboard.on('getModel', function(board) {
      board.on('setDependencies', function(board) {
        loadBoard(board);
      });
      board.on('endGame', function() {
        self.setState({gameFinished: true});
      });
      if (board.id === 0) { // board id hardcoded
        board.methods.setDependencies({
          botId: 0,
          heroId: 1
        });
      } else {
        Typoheroboard.methods.create();
      }
    });
    function loadBoard(board) {
      console.log('BOARD', board);
      self.board = board;
      self.setState({board: board.properties});
      self.loadHero({
        type: 'hero',
        id: board.heroId
      });
      self.loadHero({
        type: 'bot',
        id: board.botId
      });
      // board.on('assignDependencies', function(params, resp) {
      //   if (params.direction === 'jump') {
      //     let board = self.state.board;
      //     board.position = resp;
      //     self.setState({board: board});
      //   } else {
      //     self.setState({board: board.properties});
      //   }
      // });
    }

    Typoheroboard.methods.getModel({id: 0}); // chat id hardcoded
  }

  componentDidMount() {
    let self = this;
    let jailsCreator = new JailsCreator();
    this.jail = jailsCreator.jail;
    jailsCreator.indexPromise.then(() => {
      self.loadBoard();
    });
  }
}
export default Typohero;