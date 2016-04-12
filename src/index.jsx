import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/game.jsx';

ReactDOM.render(
  <Game width={20} height={20} size={30} mines={20} />,
  document.getElementById('content')
);