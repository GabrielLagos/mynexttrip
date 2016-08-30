/**
 * Created by gooba on 27/08/2016.
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    AppState,
    UIManager,
    TouchableOpacity,
    LayoutAnimation,
    Dimensions,
    Keyboard,
    Image,
    View
} from 'react-native';
const Platform = require('Platform');

import {lightFont} from '../common/styles';
import moment from 'moment';
import {getJourneys} from '../services/silverrail'
import WatchView from './watchview'
import {parseJourneyPlan} from '../services/parseJourneyPlan';
import {IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager';
import Icon from 'react-native-vector-icons/FontAwesome';

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
        console.log(`got new props with stops: ${JSON.stringify(newProps, null, 4)}\n\n\nstate: ${JSON.stringify(this.state, null, 4)}`);
        this.setState({settings: newProps.stops});
        this.stops = newProps.stops;
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    componentDidMount() {
        this.stops = this.props.stops || null;
        //this.setState({stops: settings});
        this.sleep(800).then(() => this.updateDepartureTimes());
        //update departure times every 5 minutes
        this.timer = setInterval(this.updateDepartureTimes.bind(this), FIVE_MINUTES);
        AppState.addEventListener('change', this.handleAppStateChange.bind(this));
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    handleAppStateChange(currentAppState) {
        if (currentAppState == 'active') {
            console.log("app has woken up! starting departureTimes updater (runs every 5 minutes)...");
            this.sleep(800).then(() => this.updateDepartureTimes());
            //update departure times every 5 minutes
            this.timer = setInterval(this.updateDepartureTimes.bind(this), FIVE_MINUTES);
        } else {
            console.log("countdownviews: app minimising.");
            if (this.timer) {
                clearInterval(this.timer);
            }
        }
    }

    updateDepartureTimes() {
        this.stops = this.state.stops || this.props.stops;
        if (this.stops == null || this.stops.morning == null || this.stops.evening == null) {
            //console.log(`no stops passed in! ${JSON.stringify(this.state, null, 4)}`);
            this.sleep(10000).then(() => this.updateDepartureTimes());
            return;
        }
        var midday = new Date();
        midday.setHours(12, 0, 0, 0);
        var departureTime = new moment().subtract(15, 'minutes');

        this.maxTime = new moment().add(59, 'minutes');

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

        this.origin = fromStop;
        this.destination = toStop;

        if (this.title == null) {
            this.updateTitle({
                position:0
            })
        }

        var from = (fromStop.SupportedModes.toLowerCase() == 'Bus') ?
            fromStop.Position :
            fromStop.StopUid;

        var to = (toStop.SupportedModes.toLowerCase() == 'Bus') ?
            toStop.Position :
            toStop.StopUid;

        var formatted = departureTime.format("YYYY-MM-DDTHH:mm");
        getJourneys(formatted, from, to)
            .then((response) => parseJourneyPlan(response))
            .then((departureTimes) => this.setState({
                page1: {
                    title: key1,
                    departureTimes: departureTimes
                }
            }))
            .then(() => getJourneys(formatted, to, from))
            .then((response) => parseJourneyPlan(response))
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

    clockFilter(departureTime) {
        return departureTime.isBetween(moment(), moment().add(59, 'minutes'));
    }

    modeFilter(mode, includeRail, includeBus, includeFerry) {
        if (mode == null) {
            return true;
        }
        var m = mode.toLowerCase();
        var rail = (includeRail && m.indexOf('rail') > -1);
        var bus = (includeBus && m.indexOf('bus') > -1);
        var ferry = (includeFerry && m.indexOf('ferry') > -1);
        var other = m.indexOf('rail') < 0 && m.indexOf('bus') < 0 && m.indexOf('ferry') < 0;

//        console.log(`${m} = Include rail: ${rail}-${includeRail}, bus: ${bus}, ferry: ${ferry}, other: ${other}`)
        return rail || bus || ferry || other;
    }

    gotoSettings() {
        console.log("gotoSettings");
        this.props && this.props.onSettingsPressed && this.props.onSettingsPressed();
    }

    updateTitle(event) {
        if (event.position==0) {
            this.setState({title: `${this.origin.Description} to ${this.destination.Description}`});
        } else {
            this.setState({title: `${this.destination.Description} to ${this.origin.Description}`});
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    }

    render() {
        var title1 = this.state && this.state.page1 && this.state.page1.title;
        var departures1 = this.state && this.state.page1 && this.state.page1.departureTimes;
        var title2 = this.state && this.state.page2 && this.state.page2.title;
        var departures2 = this.state && this.state.page2 && this.state.page2.departureTimes;


        var title = this.state.title ||  "";
        var marginTop = Platform.OS==='ios'? 32 : 0;
        return (
            <View style={{
                flex: 1,
                marginTop: marginTop,
                backgroundColor: 'white',
            }}>
                <View style={{
                    flexDirection : 'row',
                    alignItems: 'center',
                    backgroundColor: '#999',
                    height: 35,
                    paddingLeft: 3,
                    justifyContent: 'space-between'
                }}>
                    <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress={this.gotoSettings.bind(this)}>
                        <Icon name="bars" size={30} color="#ccc"/>
                    </TouchableOpacity>
                    <Text style={{
                        flex: 1,
                        textAlign : 'center',
                        fontFamily: lightFont,
                        color: '#fff'
                    }}>{title.toUpperCase()}</Text>
                </View>


                <IndicatorViewPager
                    initialPage={0}
                    onPageSelected={this.updateTitle.bind(this)}
                    style={styles.indicatorView}
                    indicator={this._renderDotIndicator()}>

                    <View style={styles.container}>
                        <WatchView title={title1} departureTimes={departures1}
                                   clockfaceFilter={this.clockFilter.bind(this)}
                                   modeFilter={this.modeFilter.bind(this)}/>
                    </View>
                    <View style={styles.container}>
                        <WatchView title={title2} departureTimes={departures2}
                                   clockfaceFilter={this.clockFilter.bind(this)}
                                   modeFilter={this.modeFilter.bind(this)}/>
                    </View>

                </IndicatorViewPager>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    indicatorView: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});