/**
 * Created by gabriel.lagos on 26/08/2016.
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    UIManager,
    LayoutAnimation,
    Dimensions,
    Keyboard,
    Image,
    View
} from 'react-native';

import store from 'react-native-simple-store';
import {IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import MorningScreen from '../screens/morning';
import EveningScreen from '../screens/evening';
import {lightFont} from '../common/styles'

export default class Onboarding extends Component {

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental &&   UIManager.setLayoutAnimationEnabledExperimental(true);
        this.state={
            visibleHeight: Dimensions.get('window').height
        }
    }
    keyboardDidShow (e) {
        let newSize = Dimensions.get('window').height - e.endCoordinates.height
        this.setState({
            visibleHeight: newSize,
        });
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    }

    keyboardDidHide (e) {
        this.setState({
            visibleHeight: Dimensions.get('window').height,
        });
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    }

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this))
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this))
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }

    _renderDotIndicator() {
        return <PagerDotIndicator pageCount={3} />;
    }

    render() {
        return (
            <View style={[{height: Dimensions.get('window').height}, {height: this.state.visibleHeight}]}>
                <IndicatorViewPager
                    initialPage={this.props.initialPage}
                    style={{flex:1}}
                    indicator={this._renderDotIndicator()}>
                    <View  style={styles.container}>
                        <Text style={styles.title}>Welcome to SilverTock</Text>
                        <Text style={[styles.description,{marginTop: 130}]}>
                            Never be late to catch your bus, train, ferry or gondola again.
                            SilverTock lets you know how much time you have before you need to go
                            with little to no interaction
                        </Text>

                        <Text style={[styles.description, {color: '#ddd'}]}>To get started you'll need to enter your morning and evening
                        stations/stops. Let's take care of that now.</Text>

                        <Text style={[styles.description, {paddingTop:160,fontWeight : 'bold', color: '#fff'}]}>Swipe left to continue.</Text>

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
        backgroundColor: '#1d114d',
        padding:10,
    },
    description : {
        fontSize: 22,
        fontWeight: '100',
        fontFamily: lightFont,
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
        fontFamily: lightFont,
        fontWeight : '100',
        color       : '#ccc',
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