/**
 * Created by gabriel.lagos on 24/08/2016.
 */
import React, {Component} from 'react';

import {
    StyleSheet,
    Image,
    Animated,
    Text,
    Easing,
    View
} from 'react-native';

class DepartureDots extends Component {
    constructor(props) {
        console.log("DepartureDots constructor");
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(
            {
                dots: (nextProps && nextProps.departures)
                ||
                (this.props && this.props.departures)
                || []
            });
    }

    renderDots() {
        var index=0;
        return this.props.dots.map((dot) => {
            //console.log(`new dot found ${dot}`);
            var anim                            = new Animated.Value(0);
            var interpolatedRotateDotsAnimation =
                    anim.interpolate({
                        inputRange : [0, 60],
                        outputRange: ['0deg', '360deg']
                    });
            Animated.timing(anim, {
                toValue : dot,
                easing  : Easing.bounce,
                delay   : 200,
                duration: this.state && this.state.firstAnimationDone? 0 : 2000
            }).start((event)=>  {
                if (event.finished) {
                    this.state.firstAnimationDone = true;
                }
            });
            index++;
            return (
                <Animated.Image key={`${dot}-${index}`} style={[styles.dots,
                    {transform: [{rotate: interpolatedRotateDotsAnimation}]},
                    {
                        position : "absolute",
                        width    : 300,
                        height   : 300,
                        alignSelf: 'center',
                    }]}
                                source={require('./images/departure-dot.png')}/>
            )
        })

    }

    componentWillMount() {
        console.log("component will mount");
        this.setState({dots: (this.props && this.props.departures) || []});
    }

    render() {
        var size  = this.props.size || 100;
        var style = [styles.dotContainer, {width: size, height: size}];
        return (
            <View style={[{width: size, height: size}, ...style]}>
                {this.renderDots()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    dotContainer: {
        position : "absolute",
        width    : 100,
        height   : 100,
        alignSelf: 'center',
    },
    dots        : {
        backgroundColor: 'transparent'
    },
});

export default DepartureDots;