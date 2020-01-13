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
      newGame: false,

    };
    this.sendSubmitTeam = this.sendSubmitTeam.bind(this);
    this.endGame = this.endGame.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
    this.hideOppUrl = this.hideOppUrl.bind(this);
  }

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
    // TODO: Generate a gameId in place of the team URL param
    this.setState({
      newGame: true,
      showOppUrl: true,
      oppUrl: window.location.href + '?team=blue'
    });
  }

  continueGame() {
    window.location.href += '?team=red';
  }

  hideOppUrl() {
    this.setState({showOppUrl: false});
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
    const {winner, started, newGame, showOppUrl, oppUrl} = this.state;

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
            <button className="confirm-btn" onClick={this.startNewGame}>Yes please</button>
            <button className="confirm-btn" onClick={this.continueGame}>No thanks, continue!</button>
          </div>}
          {showOppUrl && <div className="game-over-banner">
            <p>Send the following URL to a friend:</p>
            <p>{oppUrl}</p>
            <button onClick={this.hideOppUrl}>Start Game</button>
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
