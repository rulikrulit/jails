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
      currentSpell: ''
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
    let self = this,
      cellModel;
    return Array.apply(null, {length: nCols}).map(function(a, currentCol) {
      let className = 'board__cell';

      if (currentCol === 5 && currentRow === 8) {
        className += ' marked';
      }
      if (self.hero && (currentCol === self.hero.properties.position[1]) && (9 - currentRow) === self.hero.properties.position[0]) {
        cellModel = Artur();
      }
      if (self.robot && (currentCol === self.robot.properties.position[1]) && (9 - currentRow) === self.robot.properties.position[0]) {
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

  render() {
    let self = this;

    const board = self.boardHtml();
    return (
      <div className="Typohero">
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
    console.log('TypoheroModel', TypoheroModel);
    TypoheroModel.on('create', function(hero) {
      console.log('hero create');
      loadHero(hero);
    });
    TypoheroModel.on('getModel', function(hero) {
      console.log('getting hero', hero);
      if (hero.id === options.id) { // hero id hardcoded
        loadHero(hero);
      } else {
        TypoheroModel.methods.create({
          position: [9, 24]
        });
      }
    });
    function loadHero(hero) {
      self[options.type] = hero;
      self.setState({hero: hero.properties});
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
      console.log('board create');
      board.on('setDependencies', function(board) {
        loadBoard(board);
      });
      board.methods.setDependencies({
        botId: 0,
        heroId: 1
      });
    });
    Typoheroboard.on('getModel', function(board) {
      console.log('getting board', board);
      board.on('setDependencies', function(board) {
        loadBoard(board);
      });
      if (board.id === 1) { // board id hardcoded
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
        type: 'robot',
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

    Typoheroboard.methods.getModel({id: 1}); // chat id hardcoded
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