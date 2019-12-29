import React, { Component } from 'react';
import './Board.css';

import Square from './Square.jsx'

const numRows = 8;
const numCols = 10;

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastClick: null
    }
    this.onClick = this.onClick.bind(this);
    this.shouldShowMoveIndicator = this.shouldShowMoveIndicator.bind(this);
    this.parseRevealed = this.parseRevealed.bind(this);
    this.isLastMoveStart = this.isLastMoveStart.bind(this);
    this.isLastMoveEnd = this.isLastMoveEnd.bind(this);
  }

  onClick(i,j) {
    if (this.props.team === 'r') {
      i = numRows-i+1;
      j = numCols-j+1;
    }
    if (this.state.lastClick) {
      const [i1,j1] = this.state.lastClick;
      this.props.onSecondClick(i1, j1, i,j);
      this.setState({ lastClick: null })
    } else {
      this.props.onClickPiece(i,j);
      this.setState({ lastClick: [i,j]})
    }
  }

  redCoord(i,j) {
    return `(${numRows-i},${numCols-j})`
  }

  blueCoord(i,j) {
    return `(${i+1},${j+1})`
  }

  shouldShowMoveIndicator(i,j) {
    const {team,possibleMoves} = this.props;
    if (team === 'r') {
      return possibleMoves.includes(this.redCoord(i,j))
    }
    return possibleMoves.includes(this.blueCoord(i,j))
  }

  parseRevealed(i, j) {
    // Assumptions: there will only be one coordinate in the map
    const {team, revealedPieces, powerUsers} = this.props
    const rc = this.redCoord(i,j);
    const bc = this.blueCoord(i,j);
    // NOTE: Order is important here. Revealed pieces (due to attack) should take priority over powers
    if (revealedPieces !== null) {
      // Attacked pieces
      if (team === 'r' && revealedPieces.includes(rc)) {
        return revealedPieces.slice(revealedPieces.search(rc)+rc.length+1, -2);
      } else if (team === 'b' && revealedPieces.includes(bc)) {
        return revealedPieces.slice(revealedPieces.search(bc)+bc.length+1, -2);
      }
    } else if (powerUsers !== null) {
      // Pieces that used powers
      if (team === 'r' && powerUsers.includes(rc)) {
        return "(" + powerUsers.slice(powerUsers.search(rc)+rc.length, -1) + ")";
      } else if (team === 'b' && powerUsers.includes(bc)) {
        return "(" + powerUsers.slice(powerUsers.search(bc)+bc.length, -1) + ")";
      }
    }
  }

  // TODO: Either add a visual difference for start and end squares or collapse into one concept
  // NOTE: It may not be important to distinguish between them now. But may be with powers
  isLastMoveStart(i,j) {
    const {team, lastMove} = this.props;
    if (lastMove === null) return false;
    const rc = this.redCoord(i,j);
    const bc = this.blueCoord(i,j);
    if (team==='r' && lastMove.search(rc) < 4 && lastMove.search(rc) > -1) {
      return true;
    }
    if (team==='b' && lastMove.search(bc) < 4 && lastMove.search(bc) > -1) {
      return true;
    }
  }

  isLastMoveEnd(i,j) {
    const {team, lastMove} = this.props;
    if (lastMove === null) return false;
    if (team==='r' && lastMove.search(this.redCoord(i,j)) > 4) {
      return true;
    }
    if (team==='b' && lastMove.search(this.blueCoord(i,j)) > 4) {
      return true;
    }
  }

  render() {
    const {
      piecePositions
    } = this.props;

    let squares = [];

    for (let i=0; i<numRows; i++) {
      for (let j=0; j<numCols; j++) {
        squares.push(<Square
          key={[i,j]}
          row={i}
          col={j}
          piece={this.parseRevealed(i, j) || (piecePositions[i] && piecePositions[i][j])}
          onClick={() => this.onClick(i+1,j+1)}
          showMoveIndicator={this.shouldShowMoveIndicator(i,j)}
          showLastMoveStart={this.isLastMoveStart(i,j)}
          showLastMoveEnd={this.isLastMoveEnd(i,j)}
        />);
      }
    }

    return (
      <div className="Board">
        {squares}
      </div>
    );
  }
}

export default Board;
