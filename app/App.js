import React from 'react';
import Routes from './Routes';
import { PlayerProvider } from './player/Player';

const App = () => {
  return (
    <PlayerProvider>
      <Routes />
    </PlayerProvider>
  )
}
export default App;