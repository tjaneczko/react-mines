import React, {Component} from 'react';
import Square from './square.jsx';

class Grid extends Component {
  render() {
    var {width, height, size, onSquareClick, squareColor, squareText} = this.props;
    return (
      <div>
        {Array.from({
          length: height
        }, (a, y) => Array.from({
          length: width
        }, (b, x) => (
          <Square
            x={x * size}
            y={y * size}
            size={size}
            color={squareColor(x, y)}
            border='1px solid #ccc'
            onClick={() => onSquareClick(x, y)}
            onRightClick={() => onSquareClick(x, y, true)}
          >
            {squareText(x, y)}
          </Square>
        )))}
      </div>
    )
  }
}

export default Grid;