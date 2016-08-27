/**
 * Created by gooba on 27/08/2016.
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    ScrollView,
    View
} from 'react-native';
import moment from 'moment';


export default class DepartureList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var results = this.props.departures || [];
        if (results.length > 0) {
            return (
                <View style={styles.results}>
                    {results.map((element, index) => {

                        {/*console.log(`ok: got element ${JSON.stringify(element, null, 4)}`);*/}
                        {/*console.log(`\t\tformatted time: ${element.departTime.format('HH:mm')}`)*/}
                        return (
                            <View style={styles.resultRow} key={index}>
                                <Text>{element.departTime.format('HH:mm')}</Text>
                                <Text style={styles.departureDescription}>{element.description}</Text>
                            </View>
                        )
                    })}
                </View>
            )
        } else {
            return (
                <Text>No journeys in the next hour...</Text>
            )
        }
    }
}

const styles = StyleSheet.create({
    results: {
        flexDirection: 'column',
        backgroundColor: '#aaa',
    },
    resultRow : {
        flexDirection: 'row',
        backgroundColor: '#aaa',

    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    departureDescription: {
        color: 'black',
    }
});