import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import Game from './Game.jsx'

class App extends Component {
  constructor() {
    super();
    this.state = {
      setupDone: false
    };
    this.sendSetup = this.sendSetup.bind(this);
  }

  // TODO: Figure out a way to determine which team plays which colour
  sendSetup() {
    this.setState({setupDone: true});
  }

  render() {
    const {setupDone} = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h2>Stratego Ice&Fire</h2>
          <h3>By Matthew Walinga</h3>
        </div>
        <div className="Game-stage">
          <Game setupdone={setupDone ? 1 : 0}/>
          <button className="submit-btn" onClick={this.sendSetup}>
            Submit Setup
          </button>
        </div>
      </div>
    );
  }
}

export default App;
