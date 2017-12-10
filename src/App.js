import React, { Component } from 'react';
import './App.css';
import Chat from './Chat.js';
import Chess from './chess/Chess.js';
import Typohero from './typohero/Typohero.js';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/chat">Chat</Link></li>
            <li><Link to="/chess">Chess</Link></li>
            <li><Link to="/typohero">Typohero</Link></li>
          </ul>


          <Route exact path="/" component={Chat}/>
          <Route path="/chat" component={Chat}/>
          <Route path="/chess" component={Chess}/>
          <Route path="/typohero" component={Typohero}/>
        </div>
      </Router>
      );
  }
}

export default App;
