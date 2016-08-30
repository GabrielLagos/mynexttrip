/**
 * Created by gabriel on 30/08/2016.
 */
const Platform = require('Platform');
import {
    StyleSheet,
} from 'react-native';

exports.lightFont = Platform.OS=='ios'? 'Avenir-Light' : 'sans-serif-light';
exports.styles = StyleSheet.create({});