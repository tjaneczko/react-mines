import React, {Component, PropTypes} from 'react';

class Square extends Component {
  static propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    border: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    onClick: PropTypes.func,
    onRightClick: PropTypes.func
  };

  static propKeys = Object.keys(Square.propTypes);

  static defaultProps = {
    x: 0,
    y: 0
  };

  shouldComponentUpdate(newProps) {
    return Square.propKeys.some(key => this.props[key] !== newProps[key]);
  }

  render() {
    const {size, color, border, x, y, onClick, onRightClick, children} = this.props;
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
      left: x * size,
      top: y * size
    };

    const rightClick = ev => {
      ev.preventDefault();
      onRightClick(x, y);
      return false;
    };

    return (
      <div style={style} onClick={() => onClick(x, y)} onContextMenu={rightClick}>
        {children}
      </div>
    )
  }
}

export default Square;