import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import Game from './Game.jsx'
import {herokuUrl} from './Game.jsx'

class App extends Component {
  constructor() {
    super();
    this.state = {
      started: false,
      winner: false
    };
    this.sendSubmitTeam = this.sendSubmitTeam.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  // TODO: Figure out a way to determine which team plays which colour
  // IDEA: Default is 'r'. Then generate a unique gameId -> send a link which will be 'b'

  sendSubmitTeam() {
    const team = this.getTeam();
    fetch(`http://${herokuUrl}:8051/submitTeam`, {method: "POST", body: team})
    .then(response =>{
      console.log(response); // DEBUG
      return response.text(); // TODO: Jsonify here eventually
    }).then(data => {
      const started = data === 'true';
      if (started) this.setState({ started })
    })
  }

  endGame(team) {
    this.setState({winner: team});
  }

  getTeam() {
    // TODO: Before implementing this, probably want gameId on the server
    if (window.location.href.includes("?team=blue")) {
      return 'b';
    }
    return 'r';
  }

  render() {
    const {winner, started} = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h2>Stratego Deluxe Edition</h2>
          <h3>By Matthew Walinga</h3>
        </div>
        <div className="Game-stage">
          {winner && <div className="game-over-banner">
            <p className="game-over-text">Game Over!</p>
            <p>Winner:</p>{winner}
          </div>}
          <Game
            started={started}
            onGameOver={(team) => this.endGame(team)}
            team={this.getTeam()}
          />
          <button className="submit-btn" onClick={this.sendSubmitTeam}>
            Submit Setup
          </button>
        </div>
      </div>
    );
  }
}

export default App;
