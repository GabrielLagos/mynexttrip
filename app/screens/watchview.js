/**
 * Created by gabriel.lagos on 26/08/2016.
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    LayoutAnimation,
    Text,
    UIManager,
    ScrollView,
    View
} from 'react-native';
import WatchFace from '../components/watchface/watchface';
import DepartureDots from '../components/departuredots/departuredots'
import DeparturesList from './departurelist';
import Countdown from './countdown';

export default class WatchView extends Component {
    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental &&   UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentDidMount() {
        this.setState({
            departureTimes : []
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        console.log(`got new props in watchview [${this.props.title}] ${JSON.stringify(nextProps, null, 4)}`);
        this.setState({
            departureTimes: nextProps.departureTimes,
            title : nextProps.title
        });
    }


    render() {
        var minutes = [];
        var nextDepartures = this.state && this.state.departureTimes? this.state.departureTimes : [];

        if (this.state && this.state.departureTimes) {
            minutes = this.state.departureTimes.map((element) => {
                console.log(`element is ${JSON.stringify(element, null, 4)}`);
                return element.departTime.get("minutes");
            });
        }

        var title = this.state && this.state.title || "";
        return (
            <View style={styles.container}>
                <Text>{title}</Text>
                <Countdown departures={nextDepartures}/>
                <WatchFace size={300} style={styles.watchFace}>
                    <DepartureDots size={300} dots={minutes}/>
                </WatchFace>
                <DeparturesList departures={nextDepartures}/>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex           : 1,
        justifyContent : 'center',
        alignItems     : 'center',
        backgroundColor: '#F5FCFF',
    },
    watchFace: {
        paddingBottom: 50
    },
});