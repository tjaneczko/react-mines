import React, {Component} from 'react';
import Grid from './grid.jsx';

const SAFE = 0;
const MINE = 1;
const FLAG = 2;
const FLAGMINE = 3;
const TURNED = 4;

const randomInt = max => Math.floor(Math.random() * max);

const reset = ({width, height, mines}) => {
  var grid = Array.from({length: height}, () => Array.from({length: width}));
  var left = mines;
  while (left) {
    var x = randomInt(width), y = randomInt(height);
    if (!grid[y][x]) {
      grid[y][x] = MINE;
      left--;
    }
  }
  return grid;
};

class Game extends Component {
  constructor(props) {
    super(props);
    var {width, height, mines} = props;
    this.state = {
      grid: reset(props)
    };
    this.flipped = 0;
  }

  squareColor(x, y) {
    switch (this.state.grid[y][x]) {
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
    var {width, height} = this.props;
    var num = 0;
    for (var i = Math.max(y - 1, 0); i < Math.min(y + 2, height); ++i) {
      for (var j = Math.max(x - 1, 0); j < Math.min(x + 2, width); ++j) {
        if (this.state.grid[i][j] === MINE || this.state.grid[i][j] === FLAGMINE) {
          num++;
        }
      }
    }
    return num;
  }
  squareText(x, y) {
    if (this.state.grid[y][x] === TURNED) {
      var num = this.checkSquare(x, y);
      if (num) {
        return num.toString();
      }
    }
  }
  flipSquare(x, y) {
    if (!this.state.grid[y][x]) {
      var {width, height} = this.props;
      this.state.grid[y][x] = TURNED;
      this.flipped++;
      if (!this.checkSquare(x, y)) {
        if (y) {
          this.flipSquare(x, y - 1);
        }
        if (x) {
          this.flipSquare(x - 1, y);
        }
        if (y < height - 1) {
          this.flipSquare(x, y + 1);
        }
        if (x < width - 1) {
          this.flipSquare(x + 1, y);
        }
      }
    }
  }
  squareClicked(x, y, isRight) {
    if (isRight) {
      switch (this.state.grid[y][x]) {
        case TURNED:
          return;
        case FLAG:
        case FLAGMINE:
          this.state.grid[y][x] = this.state.grid[y][x] - 2;
          break;
        case MINE:
        default:
          this.state.grid[y][x] = (this.state.grid[y][x] || 0) + 2;
          break;
      }
      this.setState(this.state);
    } else {
      switch (this.state.grid[y][x]) {
        case MINE:
          console.log('Mine at ' + x + ', ' + y);
          this.setState({
            grid: reset(this.props)
          });
          break;
        default:
          this.flipSquare(x, y);
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