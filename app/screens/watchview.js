/**
 * Created by gabriel.lagos on 26/08/2016.
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    ScrollView,
    View
} from 'react-native';
import WatchFace from '../components/watchface/watchface';
import DepartureDots from '../components/departuredots/departuredots'
import {getJourneys} from '../services/silverrail'
import moment from 'moment';

const FIVE_MINUTES = 1000*60*5;

export default class WatchView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.stops = this.props.stops || null;
        this.updateDepartureTimes();
        this.timer = setInterval(this.updateDepartureTimes.bind(this), FIVE_MINUTES);
    }

    updateDepartureTimes() {
        if (this.stops==null) {
            console.log("no stops passed in!");
            return;
        }
        console.log("we got stops!" + JSON.stringify(this.stops.morning,null,4));
        var midday = new Date();
        midday.setHours(12,0,0,0);
        var departureTime = moment().subtract(15, 'minutes');

        var fromStop = {};
        var toStop = {};

        if (departureTime.isAfter(moment(midday))) {
            fromStop = this.stops.evening.stop;
            toStop = this.stops.morning.stop;
        } else {
            fromStop = this.stops.morning.stop;
            toStop = this.stops.evening.stop;
        }
        var from = (fromStop.SupportedModes.toLowerCase() == 'Bus')?
            fromStop.Position :
            fromStop.StopUid;

        var to = (toStop.SupportedModes.toLowerCase() == 'Bus')?
            toStop.Position :
            toStop.StopUid;

        var formatted = departureTime.format("YYYY-MM-DDTHH:mm");
        getJourneys(formatted, from, to)
            .then((response) => {
                if (response==null || response.Status.Severity!=0) {
                    console.log("Problem getting journey.");
                    return;
                }
                console.log("response:" + JSON.stringify(response,null,4));
                var journeys = response.Journeys;
                var departureTimes = [];
                for (var t=0;t<journeys.length;t++) {
                    var journey = journeys[t];
                    if (journey.Legs == null) {
                        continue;
                    }
                    for (var i=0; i<journey.Legs.length; i++) {
                        var leg = journey.Legs[i];
                        var type = leg["__type"];
                        if (type==null || !type.startsWith("TripLeg")) {
                            continue;
                        }
                        var depart = leg.DepartTime;

                        var description = `${leg.Headsign} service departing from ${leg.DestinationLocationDescription}`;
                    }
                }
            })
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <WatchFace size={300} style={styles.watchFace}>
                    <DepartureDots size={300} dots={[10, 20, 30]}/>
                </WatchFace>
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
});