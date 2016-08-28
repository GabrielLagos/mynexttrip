/**
 * Created by gooba on 27/08/2016.
 */
import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    LayoutAnimation,
    UIManager,
    TextInput,
    Image,
    View
} from 'react-native';
import moment from 'moment';

export default class Countdown extends Component {
    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental &&   UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    updateCountdown() {
        var departures = this.state ? this.state.departures : [];
        var now = new moment();
        console.log(`now: ${now.format("HH:mm")}`);
        var next = departures.reduce((current, element) => {
            console.log(`current time: ${element.departTime.format("HH.mm")}`)
            if (current == null && element.departTime.isAfter(now)) {
                console.log(`found next time ${element.departTime.format("HH.mm")}`);
                return element.departTime;
            }
            return current;
        }, null);

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.state && this.setState({
            next : next
        });
        now = new moment();
        var ms = ((60-now.seconds())*1000) - now.milliseconds();
        console.log(`ms = ${ms}`);
        this.timer = setTimeout(this.updateCountdown.bind(this), ms);
    }

    componentDidMount() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.updateCountdown();
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        //console.log(`got new props ${JSON.stringify(nextProps, null, 4)}`);
        this.setState({departures: nextProps.departures});
        this.sleep(300).then(() => this.updateCountdown());
    }

    render() {
        var departures = this.state ? this.state.departures : [];
        if (departures.length == 0) {
            console.log("no departures")
            return (
                <View></View>
            );
        }

        return (
            <View style={styles.container}>
                <Text style={styles.results}>Departs {this.state.next && this.state.next.fromNow()}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        height: 150,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    results: {
        textAlign : 'center',
        alignSelf: 'stretch',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        fontFamily : 'sans-serif-light',
        fontSize: 40,
    }
});