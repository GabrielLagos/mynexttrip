import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import MainView from './app/screens/mainview';

class silvertock extends Component {
  render() {
    return (
        <MainView/>
    );
  }
}

AppRegistry.registerComponent('silvertock', () => silvertock);
