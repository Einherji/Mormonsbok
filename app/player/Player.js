import React, { Component } from 'react'
import TrackPlayer from 'react-native-track-player'
import { GuidGenerator } from '../utils'
import audioFiles from '../audio/'

const PlayerContext = React.createContext();

export class PlayerProvider extends Component {

    currentId;

    constructor(props) {
        super(props)

        this.play = this.play.bind(this)
        this.playbackService = this.playbackService.bind(this)

        TrackPlayer.setupPlayer()
        TrackPlayer.registerPlaybackService(() => this.playbackService)
    
        this.pause = this.pause.bind(this)
        this.stop = this.stop.bind(this)
    }

    async play(title, audioKey) {
        
        const currentState = await TrackPlayer.getState()
        if(currentState === TrackPlayer.STATE_PLAYING || currentState === TrackPlayer.STATE_PAUSED){
            await TrackPlayer.stop()
            await TrackPlayer.reset()
        }

        try {
            this.currentId = GuidGenerator();
            await TrackPlayer.add({
                id: GuidGenerator(),
                title,
                url: audioFiles[audioKey]
            })
            await TrackPlayer.play()
        } catch (e) {
            console.log(e)
        }
        
    }

    async playbackService() {
        TrackPlayer.addEventListener('playback-queue-ended', (track) => {
            console.log('playback-queue-ended')
            console.log(track)
        } )
    }

    async pause() {
        await TrackPlayer.pause()
    }

    async stop() {
        await TrackPlayer.stop()
    }
 
    render() {
        const { children } = this.props
        return (
            <PlayerContext.Provider value={{
                play: this.play,
                pause: this.pause,
                stop: this.stop
            }}>
                {children}
            </PlayerContext.Provider>
        )
    }
}

export const withPlayer = Component => props => (
    <PlayerContext.Consumer>
        {value => <Component {...props} player={value} />}
    </PlayerContext.Consumer>
)