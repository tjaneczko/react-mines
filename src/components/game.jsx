import React, {Component, PropTypes} from 'react';
import Grid from './grid.jsx';
import {List} from 'immutable';

const SAFE = 0;
const MINE = 1;
const FLAG = 2;
const FLAGMINE = 3;
const TURNED = 4;

const reset = ({width, height, mines}) => ({
  grid: (new List(Array.from({length: width * height}, (val, index) => index < mines ? MINE : SAFE))).sortBy(() => Math.random()),
  left: width * height - mines
});

class Game extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    size: PropTypes.number
  };

  state = reset(this.props);

  toIndex = (x, y) => x + y * this.props.height;
  toXY = index => ({
    x: index % this.props.height,
    y: Math.floor(index / this.props.height)
  });

  forSurroundingSquares = (index, func) => {
    var {width, height} = this.props;
    var {x, y} = this.toXY(index);
    for (var i = Math.max(x - 1, 0); i < Math.min(x + 2, width); ++i) {
      for (var j = Math.max(y - 1, 0); j < Math.min(y + 2, height); ++j) {
        if (i !== x || j !== y) {
          func(this.toIndex(i, j));
        }
      }
    }
  };

  squareColor = (x, y) => {
    var {grid} = this.state;
    switch (grid.get(this.toIndex(x, y))) {
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
    var {grid} = this.state;
    var index = this.toIndex(x, y);
    if (grid.get(index) === TURNED) {
      var num = 0;
      this.forSurroundingSquares(index, i => {
        switch (grid.get(i)) {
          case MINE:
          case FLAGMINE:
            num++;
        }
      });
      if (num) {
        return num.toString();
      }
    }
  };

  squareClicked = (x, y) => {
    var index = this.toIndex(x, y);
    var {grid, left} = this.state;
    try {
      grid = grid.withMutations(grid => {
        var checkSquare = index => {
          var num = 0;
          this.forSurroundingSquares(index, i => {
            switch (grid.get(i)) {
              case MINE:
                num++;
                break;
              case FLAG:
                num--;
                break;
            }
          });
          return num;
        };

        var flipSquare = index => {
          switch (grid.get(index)) {
            case MINE:
              throw new Error('Mine!' + this.toXY(index));
            case FLAG:
            case FLAGMINE:
              break;
            case SAFE:
              left--;
              //fall through
            default:
              grid.set(index, TURNED);
              if (!checkSquare(index)) {
                this.forSurroundingSquares(index, i => grid.get(i) <= MINE && flipSquare(i));
              }
              break;
          }
        };
        flipSquare(index);
      });
      this.setState({grid, left}, () => {
        if (!this.state.left) {
          alert('You won!');
          this.setState(reset(this.props));
        }
      });
    } catch (e) {
      console.log(e);
      this.setState(reset(this.props));
    }
  };

  squareRightClicked = (x, y) => {
    var {grid} = this.state;
    var index = this.toIndex(x, y);
    switch (grid.get(index)) {
      case TURNED:
        return;
      case FLAG:
        grid = grid.set(index, SAFE);
        break;
      case FLAGMINE:
        grid = grid.set(index, MINE);
        break;
      case MINE:
        grid = grid.set(index, FLAGMINE);
        break;
      default:
        grid = grid.set(index, FLAG);
        break;
    }
    this.setState({grid});
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