import React, { Component } from 'react';
import JailsCreator from '../scripts/JailsCreator.js';
import './Typohero.css';
import Chat from '../Chat.js';
import Artur from './heros/Artur.js';

class Typohero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hero: {},
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
    let self = this;
    return Array.apply(null, {length: nCols}).map(function(a, currentCol) {
      let className = 'board__cell';

      if (currentCol === 5 && currentRow === 8) {
        className += ' marked';
        console.log('!!!!');
      }
      if (self.hero && (currentCol === self.hero.properties.position[1]) && (9 - currentRow) === self.hero.properties.position[0]) {
        if (className === 'board__cell marked') {
        }
        return (
          <td className={className} key={currentCol}>{Artur()}</td>
        );
      }
      return (
        <td className={className} key={currentCol}></td>
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

  board() {
    const height = 10;
    const width = 25;

    let self = this;

    return self.renderRows(height, width);
  }

  render() {
    let self = this;

    const board = self.board();
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
            <input autofocus="true" type="text" value={this.state.currentSpell} onChange={this.updateSpell.bind(this)} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }


  loadHero() {
    let self = this;
    let Typohero = this.jail.loadModel('TYPOHERO');
    Typohero.on('create', function(hero) {
      console.log('hero create');
      loadHero(hero);
    });
    Typohero.on('getModel', function(hero) {
      console.log('getting hero', hero);
      if (hero.id === 1) { // hero id hardcoded
        loadHero(hero);
      } else {
        Typohero.methods.create({
          position: [9, 24]
        });
      }
    });
    function loadHero(hero) {
      self.hero = hero;
      self.setState({hero: hero.properties});
      hero.on('move', function(params, resp) {
        if (params.direction === 'jump') {
          let hero = self.state.hero;
          hero.position = resp;
          self.setState({hero: hero});
        } else {
          self.setState({hero: hero.properties});
        }
      });
    }

    Typohero.methods.getModel({id: 1}); // chat id hardcoded
  }

  componentDidMount() {
    let self = this;
    let jailsCreator = new JailsCreator();
    this.jail = jailsCreator.jail;
    jailsCreator.indexPromise.then(() => {
      self.loadHero();
    });
  }
}
export default Typohero;