import React, {Component} from 'react'
import { Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { withPlayer } from '../../player/'
import { NumberFormatter } from '../../utils'

class Chapter extends Component {

    constructor(props) {
        super(props)
        
        this.onPress = this.onPress.bind(this)
    }

    onPress() {
        this.props.player.play(this.props.bookKey, this.props.bookKey + NumberFormatter(this.props.number))
    }

    render() {
        const {number} = this.props
        return (
            <TouchableOpacity style={styles.item} onPress={this.onPress}>
                <Text style={styles.title}>{number}</Text>
            </TouchableOpacity>
        )
    }
}

const PlayerChapter = withPlayer(Chapter)

class Book extends Component {

    constructor(props) {
        super(props)
        this.chapters = Array.from(Array(props.item.chapters).keys())
        props.navigation.setParams({
            title: props.item.name
        })
    }

    

    render () {
        return (<FlatList 
            data={this.chapters}
            renderItem={({item}) => <PlayerChapter bookKey={this.props.item.key} number={item + 1} />}
            keyExtractor={(item, index) =>  this.props.item.key + index}
        />)
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        backgroundColor: '#eee',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
})

export default Book