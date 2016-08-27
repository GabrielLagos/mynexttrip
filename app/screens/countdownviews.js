/**
 * Created by gooba on 27/08/2016.
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
import moment from 'moment';
import {getJourneys} from '../services/silverrail'
import WatchView from './watchview'
import {parseJourneyPlan} from '../services/parseJourneyPlan';
import {IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';

const FIVE_MINUTES = 1000 * 60 * 5;

export default class CountdownViews extends Component {

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        this.state = {
            visibleHeight: Dimensions.get('window').height
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({stops: newProps.stops});
    }

    componentDidMount() {
        this.stops = this.props.stops || null;
        this.updateDepartureTimes();
        //update departure times every 5 minutes
        this.timer = setInterval(this.updateDepartureTimes.bind(this), FIVE_MINUTES);
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    updateDepartureTimes() {
        if (this.stops == null) {
            console.log("no stops passed in!");
            return;
        }
        var midday = new Date();
        midday.setHours(12, 0, 0, 0);
        var departureTime = new moment().subtract(15, 'minutes');

        var maxTime = new moment().add(59, 'minutes');

        var fromStop = {};
        var toStop = {};

        var key1, key2;

        if (departureTime.isAfter(moment(midday))) {
            fromStop = this.stops.evening.stop;
            toStop = this.stops.morning.stop;
            key1 = "evening";
            key2 = "morning";
        } else {
            fromStop = this.stops.morning.stop;
            toStop = this.stops.evening.stop;
            key1 = "morning";
            key2 = "evening";
        }

        var from = (fromStop.SupportedModes.toLowerCase() == 'Bus') ?
            fromStop.Position :
            fromStop.StopUid;

        var to = (toStop.SupportedModes.toLowerCase() == 'Bus') ?
            toStop.Position :
            toStop.StopUid;

        var formatted = departureTime.format("YYYY-MM-DDTHH:mm");
        getJourneys(formatted, from, to)
            .then((response) => parseJourneyPlan(response, maxTime))
            .then((departureTimes) => this.setState({
                page1: {
                    title: key1,
                    departureTimes: departureTimes
                }
            }))
            .then(() => getJourneys(formatted, to, from))
            .then((response) => parseJourneyPlan(response, maxTime))
            .then((departureTimes) => this.setState({
                page2: {
                    title: key2,
                    departureTimes: departureTimes
                }
            }));

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    _renderDotIndicator() {
        return <PagerDotIndicator pageCount={2}/>;
    }

    render() {
        var title1 = this.state && this.state.page1 && this.state.page1.title;
        var departures1 = this.state && this.state.page1 && this.state.page1.departureTimes;
        var title2 = this.state && this.state.page2 && this.state.page2.title;
        var departures2 = this.state && this.state.page2 && this.state.page2.departureTimes;

        return (
            <IndicatorViewPager
                initialPage={0}
                style={styles.indicatorView}
                indicator={this._renderDotIndicator()}>

                <View style={styles.container}>
                    <WatchView title={title1} departureTimes={departures1}/>
                </View>
                <View style={styles.container}>
                    <WatchView title={title2} departureTimes={departures2}/>
                </View>

            </IndicatorViewPager>
        )
    }
}

const styles = StyleSheet.create({
    indicatorView : {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});