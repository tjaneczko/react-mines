import React, {Component} from 'react';

class Square extends Component {
  render() {
    const {size, color, border, x = 0, y = 0, onClick, onRightClick, children} = this.props;
    const style = {
      backgroundColor: color,
      border,
      width: size,
      height: size,
      lineHeight: size + 'px',
      position: 'absolute',
      boxSizing: 'border-box',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      left: x,
      top: y
    };

    return (
      <div style={style} onClick={onClick} onContextMenu={ev => {
      ev.preventDefault();
      onRightClick();
      return false;
      }}>
        {children}
      </div>
    )
  }
}

export default Square;