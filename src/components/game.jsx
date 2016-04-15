import React, {Component} from 'react';
import Grid from './grid.jsx';

const SAFE = 0;
const MINE = 1;
const FLAG = 2;
const FLAGMINE = 3;
const TURNED = 4;

const randomInt = max => Math.floor(Math.random() * max);

const reset = ({width, height, mines}) => {
  var grid = Array.from({length: width}, () => Array.from({length: height}));
  var left = mines;
  while (left) {
    var x = randomInt(width), y = randomInt(height);
    if (!grid[x][y]) {
      grid[x][y] = MINE;
      left--;
    }
  }
  return grid;
};

class Game extends Component {
  forSurroundingSquares(x, y, func) {
    var {width, height} = this.props;
    for (var i = Math.max(x - 1, 0); i < Math.min(x + 2, width); ++i) {
      for (var j = Math.max(y - 1, 0); j < Math.min(y + 2, height); ++j) {
        if (i !== x || j !== y) {
          func(i, j);
        }
      }
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      grid: reset(props)
    };
    this.flipped = 0;
  }

  squareColor(x, y) {
    switch (this.state.grid[x][y]) {
      case FLAG:
      case FLAGMINE:
        return 'blue';
      case TURNED:
        return 'white';
      case MINE:
      default:
        return '#eee';
    }
  }
  checkSquare(x, y) {
    var {grid} = this.state;
    var num = 0;
    this.forSurroundingSquares(x, y, (i, j) => {
      if (grid[i][j] === MINE || grid[i][j] === FLAGMINE) {
        num++;
      }
    });
    return num;
  }
  squareText(x, y) {
    if (this.state.grid[x][y] === TURNED) {
      var num = this.checkSquare(x, y);
      if (num) {
        return num.toString();
      }
    }
  }
  flipSquare(x, y) {
    var num = 0;
    if (!this.state.grid[x][y]) {
      this.state.grid[x][y] = TURNED;
      num ++;
      if (!this.checkSquare(x, y)) {
        this.forSurroundingSquares(x, y, (i, j) => num += this.flipSquare(i, j));
      }
    }
    return num;
  }
  squareClicked(x, y, isRight) {
    if (isRight) {
      switch (this.state.grid[x][y]) {
        case TURNED:
          return;
        case FLAG:
        case FLAGMINE:
          this.state.grid[x][y] = this.state.grid[x][y] - 2;
          break;
        case MINE:
        default:
          this.state.grid[x][y] = (this.state.grid[x][y] || 0) + 2;
          break;
      }
      this.setState(this.state);
    } else {
      switch (this.state.grid[x][y]) {
        case MINE:
          console.log('Mine at ' + x + ', ' + y);
          this.setState({
            grid: reset(this.props)
          });
          break;
        default:
          this.flipped += this.flipSquare(x, y);
          if (this.props.width * this.props.height - this.flipped === this.props.mines) {
            alert('you won!!');
          }
          this.setState(this.state);
          break;
      }
    }
  }
  render() {
    var {width, height, size} = this.props;
    return (
      <div>
        <Grid
          width={width}
          height={height}
          size={size}
          squareColor={(...args) => this.squareColor(...args)}
          squareText={(...args) => this.squareText(...args)}
          onSquareClick={(...args) => this.squareClicked(...args)}/>
      </div>
    )
  }
}

export default Game;