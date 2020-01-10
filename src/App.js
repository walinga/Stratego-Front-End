import React, { Component } from 'react';
import './App.css';

import Game from './Game.jsx'
import {herokuUrl} from './Game.jsx'

class App extends Component {
  constructor() {
    super();
    this.state = {
      started: false,
      winner: false,
      newGame: false
    };
    this.sendSubmitTeam = this.sendSubmitTeam.bind(this);
    this.endGame = this.endGame.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
  }

  // TODO: Figure out a way to determine which team plays which colour
  // IDEA: Default is 'r'. Then generate a unique gameId -> send a link which will be 'b'

  sendSubmitTeam() {
    const team = this.getTeam();
    fetch(`${herokuUrl}/submitTeam`, {method: "POST", body: team})
    .then(response =>{
      console.log(response); // DEBUG
      return response.text(); // TODO: Jsonify here eventually
    }).then(data => {
      const started = data === 'true';
      if (started) this.setState({ started })
    })
  }

  startNewGame(team) {
    this.setState({ newGame: true });
    window.location.href += '?team=red';
    // TODO: Display the URL of the opposite team to this user (to send to a friend)
  }

  endGame(team) {
    this.setState({winner: team});
  }

  getTeam() {
    if (window.location.href.includes("?team=blue")) {
      return 'b';
    }
    return 'r';
  }

  render() {
    const {winner, started, newGame} = this.state;

    const displayNewGame = !window.location.href.includes("?team") && !newGame;

    return (
      <div className="App">
        <div className="App-header">
          <h2>Stratego Deluxe Edition</h2>
          <h3>By Matthew Walinga</h3>
          <a
            className="rules-link"
            href="https://www.hasbro.com/common/documents/dad288501c4311ddbd0b0800200c9a66/d15aa64019b9f36910b4ca23616082d8.pdf">Game Rules</a>
        </div>
        <div className="Game-stage">
          {winner && <div className="game-over-banner">
            <p className="game-over-text">Game Over!</p>
            <p>Winner:</p>{winner}
          </div>}
          {displayNewGame && <div className="game-over-banner">
            <h2>Start new game?</h2>
            <button onClick={this.startNewGame}>Yes please</button>
          </div>}
          <Game
            startNewGame={newGame}
            submitted={started}
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
