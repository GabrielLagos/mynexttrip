/**
 * Created by gabriel.lagos on 25/08/2016.
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    View
} from 'react-native';
import {getLocalities} from '../services/silverrail'
import {lightFont} from '../common/styles'

class MorningScreen extends Component {

    componentWillMount() {
    }

    onTextChanged(partial) {
        if (partial.length == 0) {
            this.setState({locations: []});
            return
        }
        if (partial.length < 4) {
            return;
        }
        if (this.timer != null) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.timer = null;

            console.log("getting addresses...");

            getLocalities(partial)
                .then(function (locations) {
                    this.setState({locations: locations});
                }.bind(this));
        }, 1000);
    }

    selectLocation(location) {
        console.log("location selected");
        this.setState({location: location});
        console.log("typeof onselect");
        this.state.locations = [];
        this.props.onSelectMorningStop && this.props.onSelectMorningStop(location);
    }

    render() {
        var results = this.state && this.state.locations && this.state.locations.length && this.state.locations.length > 0 && this.state.locations || [];
        results = results.slice(0, 3);
        console.log("results = " + JSON.stringify(results));
        return (
            <Image style={styles.video} source={require('../images/morning.png')}>
                <View style={styles.container}>
                    <Text style={styles.description}>
                        Enter in the stop you leave from in the morning.
                    </Text>

                    <View style={styles.inputView}>
                        <TextInput
                            placeholder="Morning Departure"
                            placeholderTextColor='#aaa'
                            style={styles.textInput}
                            onChangeText={this.onTextChanged.bind(this)}
                            autoFocus={false}
                        />
                    </View>
                    <View style={styles.resultsView}>
                        {
                            results.map((result) => {
                                console.log(`rendering item ${result.Description}`);
                                return (
                                    <TouchableOpacity key={result.StopUid} onPress={() => this.selectLocation(result)}>
                                        <Text style={styles.text}>
                                            {result.Description}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        }
                    </View>

                    {this.state && this.state.location &&
                    <Text style={[styles.description, {color: '#ddffdd', fontSize: 15}]}>Morning stop
                        is {this.state.location.Description}</Text>}
                </View>
            </Image>
        );
    }
}

export default MorningScreen;

let styles = StyleSheet.create({
    button: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0, 0)',
        top: 10,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        right: 10,
        padding: 10,
        paddingRight: 10,
        elevation: 0,
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 1,
        shadowOffset: {
            height: 0,
            width: 0
        }
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white',
        fontFamily: lightFont,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 30,
    },
    resultsView: {
        alignItems: 'center',
        margin: 2,
        borderRadius: 14,
        paddingLeft: 3,

    },
    text: {
        fontSize: 14,
        height: 35,
        marginTop: 3,
        marginBottom: 3,
        color: '#eee',
        fontFamily: 'arial'
    },
    video: {
        justifyContent: 'center',
        alignItems: 'stretch',
        resizeMode: Image.resizeMode.cover,
        flex: 1,
        width: null,
        height: null
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'rgba(0,0,0,.4)',
    },
    inputView: {
        backgroundColor: 'rgba(255,255,255, 0)',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 5,
        padding: 0,
    },
    textInput: {
        backgroundColor: 'rgba(255,255,255, 0)',
        fontSize: 25,
        textAlign: 'center',
        margin: 0,
        height: 40,
        color: 'white'
    }
});