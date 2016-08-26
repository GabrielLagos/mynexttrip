/**
 * Created by gabriel.lagos on 26/08/2016.
 */
import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    Animated,
    Image,
    View
} from 'react-native';

export default class Loading extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Animated.Image style={styles.video} source={require('../images/logo.png')}/>
                <Text>Loading...</Text>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container  : {
        flex           : 1,
        justifyContent : 'center',
        alignItems     : 'stretch',
        backgroundColor: 'white',
    },
    text       : {
        fontSize    : 14,
        height      : 35,
        marginTop   : 3,
        marginBottom: 3,
        color       : '#eee',
        fontFamily  : 'arial'
    },
    video      : {
        flex:1,
        justifyContent: 'center',
        alignItems    : 'stretch',
        resizeMode    : Image.resizeMode.contain,
        width: null,
        height: null
    },
});