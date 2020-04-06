import React, {Component} from 'react'
import { Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import structure from '../../structure.json'
import { Actions } from 'react-native-router-flux'


const Item = ({item}) => {
    const openBook = () => Actions.book({item})
    return (
    <TouchableOpacity style={styles.item} onPress={openBook}>
        <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
    )
}

export default class Overview extends Component {

    constructor(props) {
        super(props)
    }

    render () {
        let i = 0;
        return (
            <SafeAreaView>
                <FlatList 
                    data={structure}
                    renderItem={({item}) => <Item item={item} />}
                    keyExtractor={(item, index) => item.key + index}
                />
            </SafeAreaView>
        );
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