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
  state = {
    grid: reset(this.props)
  };

  forSurroundingSquares = (x, y, func) => {
    var {width, height} = this.props;
    for (var i = Math.max(x - 1, 0); i < Math.min(x + 2, width); ++i) {
      for (var j = Math.max(y - 1, 0); j < Math.min(y + 2, height); ++j) {
        if (i !== x || j !== y) {
          func(i, j);
        }
      }
    }
  };

  squareColor = (x, y) => {
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
  };

  squareText = (x, y) => {
    if (this.state.grid[x][y] === TURNED) {
      var {grid} = this.state;
      var num = 0;
      this.forSurroundingSquares(x, y, (i, j) => {
        if (grid[i][j] === MINE || grid[i][j] === FLAGMINE) {
          num++;
        }
      });
      if (num) {
        return num.toString();
      }
    }
  };
  checkSquare = (x, y) => {
    var {grid} = this.state;
    var num = 0;
    this.forSurroundingSquares(x, y, (i, j) => {
      if (grid[i][j] === MINE) {
        num++;
      } else if (grid[i][j] === FLAG) {
        num--;
      }
    });
    return num;
  };


  flipSquare = (x, y) => {
    switch (this.state.grid[x][y]) {
      case MINE:
        console.log('Mine at ' + x + ', ' + y);
        return {
          grid: reset(this.props)
        };
      case FLAG:
      case FLAGMINE:
        break;
      default:
        this.state.grid[x][y] = TURNED;
        if (!this.checkSquare(x, y)) {
          this.forSurroundingSquares(x, y, (i, j) => (!this.state.grid[i][j] || this.state.grid[i][j] <= MINE) && this.flipSquare(i, j));
        }
        return this.state;
    }
  };

  squareClicked = (x, y) => {
    this.setState(this.flipSquare(x, y));
  };

  squareRightClicked = (x, y) => {
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
  };

  render() {
    var {width, height, size} = this.props;
    return (
      <div>
        <Grid
          width={width}
          height={height}
          size={size}
          squareColor={this.squareColor}
          squareText={this.squareText}
          onSquareClick={this.squareClicked}
          onSquareRightClick={this.squareRightClicked}
        />
      </div>
    )
  }
}

export default Game;