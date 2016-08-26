import React, {Component} from 'react';

import {
    StyleSheet,
    Image,
    Animated,
    Text,
    AppState,
    Easing,
    View
} from 'react-native';

class WatchFace extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rotateHourHandAnim  : new Animated.Value(0),
            rotateMinuteHandAnim: new Animated.Value(0),
            rotateSecondHandAnim: new Animated.Value(0),
        };

    }

    componentWillMount() {
        this.setState({
            rotateHourHandAnim  : new Animated.Value(0),
            rotateMinuteHandAnim: new Animated.Value(0),
            rotateSecondHandAnim: new Animated.Value(0),
        });
    }

    startAnimation(animation, fromValue, toValue, duration, maxDuration, isStarting) {
        if (!isStarting) {
            animation.setValue(fromValue);
        }
        Animated.timing(animation, {
            toValue : isStarting ? fromValue : toValue,
            easing  : isStarting ? Easing.bounce : Easing.linear,
            duration: isStarting ? 1000 : duration
        }).start((event) => {
            if (event.finished) {
                if (isStarting) {
                    this.updateTime();
                    return;
                }
                this.startAnimation(animation, 0, toValue, maxDuration || duration);
            }
        });
    }

    startHourAnimationFromValue(animation, fromValue, isStarting) {
        var minms = 60000 * 60 * 24;
        this.startAnimation(animation, fromValue, 24, minms, 60000 * 60 * 24, isStarting);
    }

    startMinuteAnimationFromValue(animation, fromValue, isStarting) {
        var minms = 60000 * 60;
        this.startAnimation(animation, fromValue, 60,
            minms - (fromValue * 60000), minms, isStarting);
    }

    startSecondAnimationFromValue(animation, fromValue, isStarting) {
        this.startAnimation(animation, fromValue, 60,
            60000 - (fromValue * 1000), 60000, isStarting);
    }

    stopAnimation() {
        if (this.intervalTimer) {
            console.log("stopping timer.");
            clearInterval(this.intervalTimer);
            this.intervalTimer = null;
        }
        if (this.state) {
            console.log("stopping animations...");
            try {
                this.state.rotateHourHandAnim.stopAnimation();
                this.state.rotateMinuteHandAnim.stopAnimation();
                this.state.rotateSecondHandAnim.stopAnimation();
            }
            catch (e) {
                console.warn(e);
            }
        }
    }

    runAnimation(hours, minutes, seconds, isStarting) {
        this.startHourAnimationFromValue(this.state.rotateHourHandAnim, hours, isStarting);
        this.startMinuteAnimationFromValue(this.state.rotateMinuteHandAnim, minutes, isStarting);
        this.startSecondAnimationFromValue(this.state.rotateSecondHandAnim, seconds, isStarting);
    }

    updateTime(isStarting) {

        var now  = new Date(),
            then = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                0, 0, 0),
            diff = now.getTime() - then.getTime(); // difference in milliseconds

        var h = diff / (60000 * 60);
        diff  = diff - (Math.floor(h) * 60000 * 60);
        var m = diff / 60000;
        diff -= (Math.floor(m) * 60000);
        var s = diff / 1000;

        this.runAnimation(h, m, s, isStarting);
    }

    startupAnimation() {
        this.updateTime(true);
    }

    componentDidMount() {
        this.stopAnimation();
        this.intervalTimer = setInterval(this.updateTime.bind(this), 5000);
        this.startupAnimation();
        AppState.addEventListener('change', this.handleAppStateChange.bind(this));
    }

    handleAppStateChange(currentAppState) {
        if (currentAppState == 'active') {
            console.log("app has woken up! starting animation...");
            this.intervalTimer = setInterval(this.updateTime.bind(this), 5000);
            this.updateTime();
        } else {
            console.log("app going away.");
            this.stopAnimation();
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        console.log("watchface unmounting. stopping animation.");
        this.stopAnimation();
    }

    render() {
        var size                                = this.props.size || 100;
        var style                               = [styles.watch, {width: size, height: size}];
        var interpolatedRotateHourHandAnimation =
                this.state.rotateHourHandAnim.interpolate({
                    inputRange : [0, 24],
                    outputRange: ['0deg', '720deg',]
                });

        var interpolatedRotateMinuteHandAnimation =
                this.state.rotateMinuteHandAnim.interpolate({
                    inputRange : [0, 60],
                    outputRange: ['0deg', '360deg']
                });

        var interpolatedRotateSecondHandAnimation =
                this.state.rotateSecondHandAnim.interpolate({
                    inputRange : [0, 60],
                    outputRange: ['0deg', '360deg']
                });

        return (
            <View style={[styles.container, {width: size, height: size}]}>
                {/*watch face*/}
                <Image
                    style={[styles.watchface, ...style]}
                    source={require('./images/watch-face.png')}
                />
                {/*hour hand*/}
                <Animated.Image
                    style={[styles.hourhand,
                        {transform: [{rotate: interpolatedRotateHourHandAnimation}]},
                        ...style]}
                    source={require('./images/hour-hand.png')}/>
                {/*minute hand*/}
                <Animated.Image
                    style={[styles.minutehand,
                        {transform: [{rotate: interpolatedRotateMinuteHandAnimation}]},
                        ...style]}
                    source={require('./images/minute-hand.png')}/>
                {/*second hand*/}
                <Animated.Image style={[styles.minutehand,
                    {transform: [{rotate: interpolatedRotateSecondHandAnimation}]},
                    ...style]} source={require('./images/second-hand.png')}/>

                {this.props.children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flexDirection  : 'column',
        backgroundColor: 'transparent',
        width          : 100,
        height         : 100,
    },
    watch     : {
        position : "absolute",
        width    : 100,
        height   : 100,
        alignSelf: 'center',
    },
    watchface : {
        backgroundColor: 'transparent'
    },
    hourhand  : {
        backgroundColor: 'transparent'
    },
    minutehand: {
        backgroundColor: 'transparent'
    },
});

export default WatchFace;