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
import {lightFont} from '../common/styles'

export default class DepartureList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var results = this.props.departures || [];
        if (results.length > 0) {
            return (
                <ScrollView style={styles.results}>
                    {results.map((element, index) => {

                        {/*console.log(`ok: got element ${JSON.stringify(element, null, 4)}`);*/}
                        {/*console.log(`\t\tformatted time: ${element.departTime.format('HH:mm')}`)*/}
                        return (
                            <View style={[styles.resultRow, {opacity: element.departTime.isBefore()? 0.2: 1}]} key={index}>
                                <Text style={styles.departTime}>{element.departTime.format('HH:mm')}</Text>
                                <Text style={styles.departureDescription}>{element.originLocation}</Text>
                            </View>
                        )
                    })}
                </ScrollView>
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
        flex: 1,
    },
    resultRow : {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'stretch',
        height: 40,
        margin: 4,
        flex: 1,
        backgroundColor: 'transparent',

    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    departTime : {
        marginRight: 5,
        textAlign: 'left',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    departureDescription: {
        alignSelf: 'center',
        color: 'black',
        fontFamily : lightFont
    }
});