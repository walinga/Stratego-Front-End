import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
  prettyPrint(piece) {
    if (!piece) {
      return piece;
    }
    if (piece.includes('11')) {
      return 'F';
    }
    if (piece.includes('0') && !piece.includes('10')) {
      return piece.replace(/0./, 'TRAP');
    }
    if (/^1(r|b)/.test(piece)) {
      return 'S';
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
    if (piece === '?') {
      style.fontSize = '34px';
      style.marginTop = '16px';
      style.position = 'relative';
    }
    return style;
  }

  getImage(piece) {
    const back_images = {
      // NOTE: Be careful of 1 vs 10, 11 lol
      0: 'trap.jpg',
      1: 'assassin.png',
      2: 'wolf.jpg',
      3: 'dwarf.png',
      4: 'archer.svg',
      5: 'hulk.jpg',
      6: 'sorcerer.svg',
      7: 'rider.png',
      8: 'knight.png',
      9: 'wizard.png',
      x: 'fire.png'
    }

    if (!piece) return false;
    if (piece.includes('11')) {
      return 'flag.png'
    } else if (piece.includes('10')) {
      return 'dragon.jpg'
    }
    return back_images[piece[0]]
  }

  render() {
    const {
      row,
      col,
      piece,
      showMoveIndicator,
      onClick,
      showLastMove
    } = this.props;
    const squarePos = {top: row*75, left: col*75};

    return (
      <div className="Square" style={squarePos} onClick={onClick}>
        {this.getImage(piece) && <img src={this._fetchImage(this.getImage(piece))} alt="wolf" className="piece-img"></img>}
        {showMoveIndicator && <span className="dot"></span>}
        {showLastMove && <span className="orange-border"></span>}
        <p className="piece-name" style={this.getStyle(piece)}>{this.prettyPrint(piece)}</p>
      </div>
    );
  }
}

export default Square;
