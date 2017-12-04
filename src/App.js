import React, { Component } from 'react';
import './App.css';
import Chat from './Chat.js';
import Chess from './chess/Chess.js';
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
          </ul>


          <Route exact path="/" component={Chat}/>
          <Route path="/chat" component={Chat}/>
          <Route path="/chess" component={Chess}/>
        </div>
      </Router>
      );
  }
}

export default App;
