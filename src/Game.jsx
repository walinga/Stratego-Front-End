import React, { Component } from 'react';

import Board from './Board.jsx'

// TODO: Need some actual URL to hit the server with (Heroku!?)
const herokuUrl = "localhost"

/*
 * A wrapper around the Game Component that handles the logic and API calls
 */
class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      piecePositions: {},
      possibleMoves: [],
      started: false
    };

    this.onClickPiece = this.onClickPiece.bind(this);
    this.swapPieces = this.swapPieces.bind(this);
    this.movePiece = this.movePiece.bind(this);
  }

  onClickPiece(i,j) {
    console.log(i,j); //  DEBUG
    fetch(`http://${herokuUrl}:8051/getValidMoves`, {method: "POST", body: `${i},${j} b`})
    .then(response =>{
      console.log(response); // DEBUG
      return response.text(); // TODO: Jsonify here eventually
    }).then(data => {
      console.log("data:"); // DEBUG
      console.log(data);
      this.setState({possibleMoves: data});
    })
  }

  swapPieces(i1, j1, i2, j2) {
    console.log("swap pieces!");
    console.log(i1, j1, i2, j2); //  DEBUG
    fetch(`http://${herokuUrl}:8051/swapPieces`, {method: "POST", body: `${i1},${j1} ${i2},${j2} b`})
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
    fetch(`http://${herokuUrl}:8051/makeMove`, {method: "POST", body: `${i1},${j1} ${i2},${j2} b`})
    .then(response =>{
      console.log(response); // DEBUG
      return response.text(); // TODO: Jsonify here eventually
    }).then(data => {
      console.log("data:"); // DEBUG
      console.log(data);
      const positions = this.parseBoard(data.slice(data.search(/\?/), -1));
      this.setState({piecePositions: positions, possibleMoves: []});
    })
  }

  sendSubmitTeam(team) {
    fetch(`http://${herokuUrl}:8051/submitTeam`, {method: "POST", body: team})
    .then(response =>{
      console.log(response); // DEBUG
      return response.text(); // TODO: Jsonify here eventually
    }).then(data => {
      const started = data === 'true';
      if (started) this.setState({ started })
    })
  }

  componentDidMount() {
    // TODO: Def should be a GET. Figure out how to parse URL params in Java
    fetch(`http://${herokuUrl}:8051/getBoard`, {method: "POST", body: "b"})
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
    if (this.props.setupdone !== prevProps.setupdone) {
      // TODO: Only send one lol. Just for testing
      // // DEBUG: //
      this.sendSubmitTeam("r");
      this.sendSubmitTeam("b");
    }
  }

  parseBoard(data) {
    // NOTE: Could easily construct this using a list of coords from the server
    let positions = {};
    const pieceData = data.split(/\s+/).map(x => x.trim());
    // NOTE: stuff is orange because of some weird Atom syntax bug
    for (let i=0;i<8;i++) {
      for (let j=0; j<10; j++) {
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
    const {piecePositions, possibleMoves, started} = this.state;

    return (
      <Board
        piecePositions={piecePositions}
        possibleMoves={possibleMoves}
        onClickPiece={started ? this.onClickPiece : () => {}}
        onSecondClick={started ? this.movePiece : this.swapPieces}
      />
    );
  }
}

export default Game;
