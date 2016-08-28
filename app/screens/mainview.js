/**
 * Created by gabriel.lagos on 24/08/2016.
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    DeviceEventEmitter,
    Text,
    Dimensions,
    View
} from 'react-native';

import store from 'react-native-simple-store';
import Onboarding from '../screens/onboarding'
import Loading from '../screens/loading'
import CountdownViews from '../screens/countdownviews'
const dismissKeyboard = require('dismissKeyboard')

const defaultOnboarding = {
    complete: false,
    page: 0
};

class MainView extends Component {

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    componentDidMount() {
        this.sleep(2000)
            .then(() => store.get('settings'))
            .then(settings => this.setState({settings: settings || {}}))
            .then(() => store.get('onboarding'))
            .then(onBoarding => this.setState(
                {
                    onBoarding: onBoarding == null ?
                        defaultOnboarding :
                        onBoarding
                })
            )
            .catch((error) => console.warn(error))
    }

    selectMorningStop(stop) {
        dismissKeyboard();
        console.log(`morning Stop = ${JSON.stringify(stop, null, 4)}`);
        store.update('settings', {
            morning: {
                stop: stop
            }
        })
            .then(() => console.log("updated morning stop in app storage."))
    }

    selectEveningStop(stop) {
        dismissKeyboard();
        console.log(`evening Stop = ${JSON.stringify(stop, null, 4)}`);
        store.update('settings', {
            evening: {
                stop: stop
            }
        })
            .then(() => console.log("updated evening stop in app storage."))
    }

    onboardingCompleted() {
        store.update('onboarding', {
            complete: true,
            page: 0
        })
            .then(() => {
                this.setState({
                    onBoarding: {
                        complete: true,
                        page: 0
                    }
                });
                console.log("onboarding complete!");
            })
    }

    render() {
        if (this.state == null || this.state.onBoarding == null) {
            return (<Loading/>)
        }

        if (!this.state.onBoarding.complete) {
            return (<Onboarding
                initialPage={this.state.onBoarding.page}
                onComplete={this.onboardingCompleted.bind(this)}
                onSelectMorningStop={this.selectMorningStop.bind(this)}
                onSelectEveningStop={this.selectEveningStop.bind(this)}
            />);
        } else {
            return (

                <CountdownViews stops={this.state.settings} style={styles.container}/>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#eeeeee',
        marginBottom: 5,
    },
});

export default MainView;