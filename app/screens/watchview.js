/**
 * Created by gabriel.lagos on 26/08/2016.
 */

import React, {Component} from 'react';
import CheckBox from 'react-native-checkbox';

import {
    StyleSheet,
    LayoutAnimation,
    Text,
    Image,
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
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentDidMount() {
        this.setState({
            departureTimes: [],
            includeRail : true,
            includeBus : true,
            includeFerry: true
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        //console.log(`got new props in watchview [${this.props.title}] ${JSON.stringify(nextProps, null, 4)}`);
        this.setState({
            departureTimes: nextProps.departureTimes,
            title: nextProps.title
        });
    }

    includeRailMode(checked) {
        this.setState({includeRail: !this.state.includeRail});
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    includeBusMode(checked) {
        this.setState({includeBus: !this.state.includeBus});
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    includeFerryMode(checked) {
        this.setState({includeFerry: !this.state.includeFerry});
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    render() {
        var minutes = [];
        var departures = [];
        var nextDepartures = this.state && this.state.departureTimes ? this.state.departureTimes : [];

        var includeRail = this.state && this.state.includeRail;
        var includeBus = this.state && this.state.includeBus;
        var includeFerry = this.state && this.state.includeFerry;
        if (this.state && this.state.departureTimes) {
            minutes = this.state.departureTimes
                .filter(
                    (element) => this.props.modeFilter ?
                        this.props.modeFilter(element.mode, includeRail, includeBus, includeFerry) : true)
                .filter(
                    (element) => this.props.clockfaceFilter ?
                        this.props.clockfaceFilter(element.departTime) : true)
                .map((element) => {
                    //console.log(`element is ${JSON.stringify(element, null, 4)}`);
                    return element.departTime.get("minutes");
                });

            departures = this.state.departureTimes
                .filter(
                    (element) => {
                        var filter =  this.props.modeFilter ?
                            this.props.modeFilter(element.mode, includeRail, includeBus, includeFerry) : true
                        //console.log(`do we filter ${JSON.stringify(element, null, 4)}? ${filter}`);
                        return filter;
                    });
        }

        var title = this.state && this.state.title || "";

        var view = (
            <View style={styles.subcontainer}>
                <Text>{title}</Text>
                <Countdown departures={departures}/>
                <WatchFace size={300} style={styles.watchFace}>
                    <DepartureDots size={300} dots={minutes}/>
                </WatchFace>
                <View style={styles.filters}>
                    <CheckBox
                        label='Rail'
                        checked={this.state && this.state.includeRail}
                        onChange={this.includeRailMode.bind(this)}
                    />
                    <CheckBox
                        label='Bus'
                        checked={this.state && this.state.includeBus}
                        onChange={this.includeBusMode.bind(this)}
                    />
                    <CheckBox
                        label='Ferry'
                        checked={this.state && this.state.includeFerry}
                        onChange={this.includeFerryMode.bind(this)}
                    />
                </View>
                <DeparturesList departures={departures}/>
            </View>
        );
        return view;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filters: {
        flexDirection : "row",
        marginTop: 10,
        marginBottom: 10,
        alignSelf: 'stretch',
        backgroundColor: 'transparent',
        justifyContent: 'space-around',
    },
    subcontainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    watchFace: {
        flex: 1,
        paddingBottom: 50,
    },
});