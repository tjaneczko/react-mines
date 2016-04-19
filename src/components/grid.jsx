import React, {Component} from 'react';
import Square from './square.jsx';

class Grid extends Component {
  render() {
    var {width, height, size, onSquareClick, onSquareRightClick, squareColor, squareText} = this.props;
    return (
      <div>
        {Array.from({
          length: width
        }, (a, x) => Array.from({
          length: height
        }, (b, y) => (
          <Square x={x} y={y} size={size}
            color={squareColor(x, y)}
            border='1px solid #ccc'
            onClick={onSquareClick}
            onRightClick={onSquareRightClick}
          >
            {squareText(x, y)}
          </Square>
        )))}
      </div>
    )
  }
}

export default Grid;