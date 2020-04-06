import React from 'react'
import { Router, Scene } from 'react-native-router-flux';
import { Overview } from './scenes/overview';
import { Book } from './scenes/book';
import { Player } from './scenes/player';

const Routes = () => (
    <Router>
        <Scene key="root">
            <Scene key="overview" component={Overview} title="Mormonsbok" initial />
            <Scene key="book" component={Book} title="Book" />
            <Scene key="player" component={Player} title="Player" />
        </Scene> 
    </Router>
)

export default Routes

