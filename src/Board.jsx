import React, { Component } from 'react';
import './Board.css';

import Square from './Square.jsx'

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastClick: null
    }
    this.onClick = this.onClick.bind(this);
  }

  onClick(i,j) {
    if (this.state.lastClick) {
      const [i1,j1] = this.state.lastClick;
      this.props.onSecondClick(i1, j1, i,j);
      this.setState({ lastClick: null })
    } else {
      this.props.onClickPiece(i,j);
      this.setState({ lastClick: [i,j]})
    }
  }

  render() {
    const numRows = 8;
    const numCols = 10;
    const {
      piecePositions,
      possibleMoves
    } = this.props;

    let squares = [];

    for (let i=0; i<numRows; i++) {
      for (let j=0; j<numCols; j++) {
        squares.push(<Square
          key={[i,j]}
          row={i}
          col={j}
          piece={piecePositions[i] && piecePositions[i][j]}
          onClick={() => this.onClick(i+1,j+1)}
          showMoveIndicator={possibleMoves.includes(`(${i+1},${j+1})`)}
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
