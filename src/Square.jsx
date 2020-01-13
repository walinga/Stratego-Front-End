import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
  prettyPrint(piece) {
    if (!piece) {
      return piece;
    }
    if (piece === 'x' || piece === '?') {
      return '';
    }
    if (piece.includes('11')) {
      return 'F';
    }
    // TODO (low priority): 10 attacking trap shows up as 10,0
    if (piece.includes('0') && !piece.includes('10')) {
      piece = piece.replace(/0./, 'T');
    }
    if (/^1(r|b)|1(r|b)$/.test(piece) || (piece.includes('1') && !piece.includes('10') && !piece.includes('11'))) {
      piece = piece.replace(/1(r|b)/, 'S');
    }
    return piece.replace(/O/, '').replace('r', '').replace('b', '');
  }

  _fetchImage( name ) {
    return require( `./images/${name}` );
  }

  getStyle(piece) {
    const style = {}
    if (!piece) return;
    if (piece.includes('r') && piece.includes('b')) {
      // Leave revealed pieces blank for now
    } else if (piece.includes('r')) {
      style.color = '#ff5000'; // RED
    } else if (piece.includes('b')) {
      style.color = '#0065ff'; // BLUE
    }
    return style;
  }

  getImage(piece) {
    const back_images = {
      // NOTE: Be careful of 1 vs 10, 11 lol
      0: 'fire.png',
      1: 'assassin.png',
      2: 'wolf.png',
      3: 'dwarf.png',
      4: 'archer.png',
      5: 'ogre.png',
      6: 'sorcerer.png',
      7: 'rider.png',
      8: 'knight.png',
      9: 'wizard.png',
      x: 'barrier.png'
    }

    if (!piece) return false;
    if (piece.includes('?')) {
      return this.props.team === 'r' ? 'blue-team.png' : 'red-team.png'
    }
    if (piece.includes('11')) {
      return 'flag.png'
    } else if (piece.includes('10')) {
      return 'dragon.png'
    }
    const lookup = piece[0] === '(' ? piece[1] : piece[0];
    return back_images[lookup]
  }

  render() {
    const {
      row,
      col,
      piece,
      onClick,
      showMoveIndicator,
      showLastMove,
      showSelectedPiece
    } = this.props;
    const squarePos = {top: row*75, left: col*75};

    return (
      <div className="Square" style={squarePos} onClick={onClick}>
        {this.getImage(piece) && <img src={this._fetchImage(this.getImage(piece))} alt="wolf" className="piece-img"></img>}
        {showSelectedPiece && <span className="selectedPiece"></span>}
        {showMoveIndicator && <span className="possibleMoves"></span>}
        {showLastMove && <span className="lastMove"></span>}
        <p className="piece-name" style={this.getStyle(piece)}>{this.prettyPrint(piece)}</p>
      </div>
    );
  }
}

export default Square;
