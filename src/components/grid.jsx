import React, {Component, PropTypes} from 'react';
import Square from './square.jsx';

class Grid extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    size: PropTypes.number,
    onSquareClick: PropTypes.func,
    onSquareRightClick: PropTypes.func,
    squareColor: PropTypes.func,
    squareText: PropTypes.func
  };
  render() {
    var {width, height, size, onSquareClick, onSquareRightClick, squareColor, squareText} = this.props;
    return (
      <div>
        {Array.from({
          length: width
        }, (a, x) => Array.from({
          length: height
        }, (b, y) =>
          <Square x={x} y={y} size={size}
            color={squareColor(x, y)}
            border='1px solid #ccc'
            onClick={onSquareClick}
            onRightClick={onSquareRightClick}
          >
            {squareText(x, y)}
          </Square>
        ))}
      </div>
    )
  }
}

export default Grid;