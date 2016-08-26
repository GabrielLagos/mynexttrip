/**
 * Created by gabriel.lagos on 26/08/2016.
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    Image,
    View
} from 'react-native';

import store from 'react-native-simple-store';
import {IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import MorningScreen from '../screens/morning';
import EveningScreen from '../screens/evening';

export default class Onboarding extends Component {
    _renderDotIndicator() {
        return <PagerDotIndicator pageCount={3} />;
    }

    render() {
        return (
            <View style={{flex:1}}>
                <IndicatorViewPager
                    initialPage={this.props.initialPage}
                    style={{flex:1}}
                    indicator={this._renderDotIndicator()}>
                    <View  style={styles.container}>
                        <Text style={styles.title}>Welcome to SilverTock</Text>
                        <Text style={styles.description}>
                            Never be late to catch your bus, train, ferry or gondola again.
                            SilverTock lets you know how much time you have before you need to go
                            with little to no interaction
                        </Text>

                        <Text style={[styles.description, {color: '#ddd'}]}>To get started you'll need to enter your morning and evening
                        stations/stops. Let's take care of that now.</Text>

                        <Text style={[styles.description, {marginTop:20,fontWeight : 'bold', color: '#fff'}]}>Swipe left to continue.</Text>

                    </View>
                    <View style={{backgroundColor: 'cornflowerblue'}}>
                        <MorningScreen onSelectMorningStop={this.props.onSelectMorningStop}/>
                    </View>
                    <View style={{backgroundColor: '#1AA094'}}>
                        <EveningScreen onComplete={this.props.onComplete}
                            onSelectEveningStop={this.props.onSelectEveningStop}/>
                    </View>
                </IndicatorViewPager>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    container  : {
        flex           : 1,
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems     : 'stretch',
        backgroundColor: '#2dc84d',
        padding:10,
    },
    description : {
        fontSize: 22,
        textAlign: 'center',
        color: 'white',
        marginBottom: 10,
    },
    title       : {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        fontSize    : 24,
        height: 100,
        marginTop   : 3,
        borderRadius : 10,
        alignSelf : 'stretch',
        textAlign: 'center',
        fontWeight : 'bold',
        color       : '#ccc',
        fontFamily  : 'arial',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding:14,

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