import React from 'react';
import PropTypes from 'prop-types';
import Square from './Square';

class Row extends React.Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    row: PropTypes.string.isRequired,
    modes: PropTypes.object.isRequired,
    squares: PropTypes.object.isRequired,
    onSquareClick: PropTypes.func.isRequired
  }

  render() {
    const row = [];
    for (let i = 0; i < this.props.size; i++) {
      row.push(<Square
        key={`${this.props.row}-s${i}`}
        square={`${this.props.row}-s${i}`}
        modes={this.props.modes}
        squares={this.props.squares[`${this.props.row}-s${i}`]}
        onSquareClick={this.props.onSquareClick}
      />)
    }

    return (
      <div className="board-row">
        {row}
      </div>
    );
  }

}

export default Row;
