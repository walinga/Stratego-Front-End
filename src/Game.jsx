import React, { Component } from 'react';

import Board from './Board.jsx'

export const herokuUrl = "https://stratego-ice-and-fire.herokuapp.com"// "http://localhost:8051"

/*
 * A wrapper around the Board Component that handles the logic and API calls
 */
class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      piecePositions: {},
      possibleMoves: [],
      revealedPieces: null,
      powerUsers: null,
      lastMove: null
    };

    this.onClickPiece = this.onClickPiece.bind(this);
    this.swapPieces = this.swapPieces.bind(this);
    this.movePiece = this.movePiece.bind(this);
  }

  componentDidMount() {
    const team = this.props.team;
    // TODO: Def should be a GET. Figure out how to parse URL params in Java
    fetch(`${herokuUrl}/getBoard`, {method: "POST", body: team})
    .then(response =>{
      console.log(response); // DEBUG
      return response.text(); // TODO: Jsonify here eventually
    }).then(data => {
      console.log("data:"); // DEBUG
      console.log(data);
      const positions = this.parseBoard(data);
      console.log(positions); // DEBUG
      this.setState({piecePositions: positions});
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.startNewGame === prevProps.startNewGame) return;
    const team = this.props.team;
    fetch(`${herokuUrl}/newGame`, {method: "POST", body: team})
    .then(response =>{
      return response.text(); // TODO: Jsonify here eventually
    }).then(data => {
      const positions = this.parseBoard(data);
      this.setState({piecePositions: positions});
    })
  }

  onClickPiece(i,j) {
    const team = this.props.team;
    fetch(`${herokuUrl}/getValidMoves`, {method: "POST", body: `${i},${j} ${team}`})
    .then(response =>{
      return response.json();
    }).then(data => {
      console.log("data:"); // DEBUG
      console.log(data);
      const positions = this.parseBoard(data.boardState);
      const lastMove = data.lastMove || null;
      this.setState({
        possibleMoves: data.validMoves,
        piecePositions: positions,
        lastMove: lastMove
      });
    })
  }

  swapPieces(i1, j1, i2, j2) {
    console.log(i1, j1, i2, j2); //  DEBUG
    const team = this.props.team;
    fetch(`${herokuUrl}/swapPieces`, {method: "POST", body: `${i1},${j1} ${i2},${j2} ${team}`})
    .then(response =>{
      console.log(response); // DEBUG
      return response.text(); // TODO: Jsonify here eventually
    }).then(data => {
      console.log("data:"); // DEBUG
      console.log(data);
      const positions = this.parseBoard(data);
      console.log(positions); // DEBUG
      this.setState({piecePositions: positions});
    })
  }

  movePiece(i1, j1, i2, j2) {
    console.log("move piece!");
    console.log(i1, j1, i2, j2); //  DEBUG
    const team = this.props.team;
    fetch(`${herokuUrl}/makeMove`, {method: "POST", body: `${i1},${j1} ${i2},${j2} ${team}`})
    .then(response =>{
      console.log(response); // DEBUG
      return response.json();
    }).then(data => {
      console.log("data:"); // DEBUG
      console.log(data);
      if (data.Winner) {
        this.props.onGameOver(data.Winner === "r" ? 'Red' : 'Blue');
      } else {
        const rawBoard = data.boardState;
        console.log(rawBoard); // DEBUG
        const positions = this.parseBoard(rawBoard);
        const revealedPiece = data.revealedPiece || null;
        console.log(revealedPiece);
        const powerUser = data.lastPowerUser || null;
        console.log(powerUser);
        const lastMove = data.lastMove || null;
        console.log(lastMove);

        this.setState({
          piecePositions: positions,
          possibleMoves: [],
          revealedPieces: revealedPiece,
          powerUsers: powerUser,
          lastMove: lastMove
        });
      }
    })
  }

  parseBoard(data) {
    let positions = {};
    let pieceData = data.split(/\s+/).map(x => x.trim());
    if (this.props.team === 'r') {
      pieceData = pieceData.reverse().slice(1); // trailing newline
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 10; j++) {
        if (positions[i]) {
          positions[i][j] = pieceData[i*10+j];
        } else {
          positions[i] = {};
          positions[i][j] = pieceData[i*10+j];
        }
      }
    }
    return positions;
  }

  render() {
    const {piecePositions, possibleMoves, revealedPieces, powerUsers, lastMove} = this.state;
    const {team, submitted} = this.props;

    return (
      <Board
        piecePositions={piecePositions}
        possibleMoves={possibleMoves}
        revealedPieces={revealedPieces}
        powerUsers={powerUsers}
        lastMove={lastMove}
        onClickPiece={submitted ? this.onClickPiece : () => {}}
        onSecondClick={submitted ? this.movePiece : this.swapPieces}
        team={team}
      />
    );
  }
}

export default Game;
