import React, { Component } from 'react';
import './Square.css';

class Square extends Component {
  render() {
    const {
      row,
      col,
      piece,
      showMoveIndicator,
      onClick
    } = this.props;
    const squarePos = {top: row*75, left: col*75};

    return (
      <div className="Square" style={squarePos} onClick={onClick}>
        {showMoveIndicator && <span className="dot"></span>}
        <p>{piece==='O' ? '' : piece}</p>
      </div>
    );
  }
}

export default Square;
