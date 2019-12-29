import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
  prettyPrint(piece) {
    if (!piece) {
      return piece;
    }
    if (piece.includes('11')) {
      return 'FLAG';
    }
    if (piece.includes('0') && !piece.includes('10')) {
      return piece.replace(/0./, 'TRAP');
    }
    if (/^1(r|b)/.test(piece)) {
      return 'S';
    }
    return piece.replace(/O/, '');
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
    if (/^1(r|b)/.test(piece) || piece === 'x') {
      style.fontSize = '34px';
      style.marginTop = '16px';
    }
    return style;
  }

  render() {
    const {
      row,
      col,
      piece,
      showMoveIndicator,
      onClick,
      showLastMoveStart,
      showLastMoveEnd
    } = this.props;
    const squarePos = {top: row*75, left: col*75};

    return (
      <div className="Square" style={squarePos} onClick={onClick}>
        {showMoveIndicator && <span className="dot"></span>}
        {showLastMoveStart && <span className="orange-border"></span>}
        {showLastMoveEnd && <span className="orange-border"></span>}
        <p style={this.getStyle(piece)}>{this.prettyPrint(piece)}</p>
      </div>
    );
  }
}

export default Square;
