import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Button, 
    Text,
    TouchableHighlight,
    Vibration,
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

class MyButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let myStyle = {
            backgroundColor: "#4080f0",
            justifyContent: 'center',
            alignItems: 'center',
            height: 35,
            borderRadius: 2,
        };
        //console.log('this.props.style', this.props.styles);
        myStyle = { ...myStyle, ...this.props.style };

        return (
            <TouchableHighlight
                style={ myStyle }
                onPress={ this.props.onPress }
                onLongPress={() => {  }}
            >
                <Text style={{ color: '#f0f0f0', fontWeight: 'bold', fontSize: 16 }}>{ this.props.title }</Text>
            </TouchableHighlight>
        );
    }

}

class ScreenTimer extends React.Component {
    constructor(props) {
        super(props);

        this.startTime = 0;
        this.vibrating = false;
        this.state = {
            countDownCeiling: 5,
            countDown: 5,
        }
    }

    componentDidMount() {
        console.log('componentDidMount()');
        this.timerTask = BackgroundTimer.setInterval(() => {
            if (this.startTime > 0) {
                const now = new Date();
                const diff = Math.floor(parseInt(now - this.startTime) / 1000);
                console.log('diff:', diff);
                const countDown = this.state.countDownCeiling - diff;
                if (countDown >= 0) {
                    this.setState((prevState, props) => ({
                        countDown,
                    }));
                } else {
                    this.startTime = 0;
                    this.vibrateLong();
                }
            }
        }, 200);
    }

    componentWillUnmount(nextProps, nextState) {
        console.log('componentWillUnmount()');
        if (this.timerTask) {
            BackgroundTimer.clearInterval(this.timerTask);
        }
    }
    
    countDownStart() {
        if (this.startTime == 0) {
            this.startTime = new Date();
        }
    }

    countDownStop() {
        this.startTime = 0;
        this.setState((prevState, props) => ({
            countDown: prevState.countDownCeiling,
        }));
    }

    countDownSetCeiling(seconds) {
        this.setState((prevState, props) => ({
            countDownCeiling: seconds,
            countDown: seconds,
        }));
    }

    vibrateShort() {
        let vibs = [0, 100, 100, 100];
        Vibration.vibrate(vibs);
    }

    vibrateLong() {
        let vibs = [0, 500, 1000, 500];
        Vibration.vibrate(vibs, true);
        this.vibrating = true;
        BackgroundTimer.setTimeout(() => {
            if (this.vibrating) {
                this.vibrateCancel();
            }
        }, 20 * 1000);
    }

    vibrateCancel() {
        Vibration.cancel();
        this.vibrating = false;
    }

    doubleIt(num) {
        if (parseInt(num) < 10) {
            return '0' + num;
        } else {
            return '' + num;
        }
    }

    renderCountDownTime() {
        return (
            <Text style={ss.timerText}>
                { this.doubleIt(Math.floor(this.state.countDown / 60)) } : { this.doubleIt(this.state.countDown % 60) }
            </Text>
        );
    }

    render() {
        return (
            <View style={ss.box}>
                { this.renderCountDownTime() }

                <View style={ss.ceilButtonBox}>

                    <View style={ss.ceilButtonLine}>

                        <MyButton style={ss.ceilButton} title="5:00"
                            onPress={() => {
                                this.countDownSetCeiling(5 * 60);
                            }}
                        />

                        <MyButton style={ss.ceilButton} title="10:00"
                            onPress={() => {
                                this.countDownSetCeiling(10 * 60);
                            }}
                        />

                        <MyButton style={ss.ceilButton} title="15:00"
                            onPress={() => {
                                this.countDownSetCeiling(15 * 60);
                            }}
                        />

                        <MyButton style={ss.ceilButton} title="20:00"
                            onPress={() => {
                                this.countDownSetCeiling(20 * 60);
                            }}
                        />
                    </View>

                    <View style={ss.ceilButtonLine}>
                        <MyButton style={ss.ceilButton} title="30:00"
                            onPress={() => {
                                this.countDownSetCeiling(30 * 60);
                            }}
                        />

                        <MyButton style={ss.ceilButton} title="40:00"
                            onPress={() => {
                                this.countDownSetCeiling(40 * 60);
                            }}
                        />

                        <MyButton style={ss.ceilButton} title="50:00"
                            onPress={() => {
                                this.countDownSetCeiling(50 * 60);
                            }}
                        />

                        <MyButton style={ss.ceilButton} title="60:00"
                            onPress={() => {
                                this.countDownSetCeiling(60 * 60);
                            }}
                        />

                    </View>

                </View>

                <View style={ss.actionButtonBox}>
                    <MyButton style={ss.actionButton} title="Start"
                        onPress={() => {
                            this.countDownStart();
                        }}
                        color="#4080f0"
                    />

                    <MyButton style={ss.actionButton} title="Stop"
                        onPress={() => {
                            this.countDownStop();
                            this.vibrateCancel();
                        }}
                        color="#4080f0"
                    />
                </View>
            </View>
        );
    }
}

const ss = {
    box: {
        flexDirection: 'column', /* row, column */
        justifyContent: 'space-around',  /* flex-start, center, flex-end, space-around(两端不顶头均分), space-between(两端顶头均分) */
        alignItems: 'center', /* flex-start, center, flex-end, stretch */
        width: '100%',
        height: '100%',
    },

    timerText: {
        fontSize: 80,
    },

    ceilButtonBox: {
        // sub
        flexDirection: 'column', /* row, column */
        justifyContent: 'space-around',  /* flex-start, center, flex-end, space-around(两端不顶头均分), space-between(两端顶头均分) */
        alignItems: 'center', /* flex-start, center, flex-end, stretch */

        width: '100%',
        height: 100,
    },

    ceilButtonLine: {
        // sub
        flexDirection: 'row', /* row, column */
        justifyContent: 'space-around',  /* flex-start, center, flex-end, space-around(两端不顶头均分), space-between(两端顶头均分) */
        alignItems: 'center', /* flex-start, center, flex-end, stretch */
        width: '100%',
    },

    ceilButton: {
        backgroundColor: "#4080f0",
        width: 50,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
    },

    actionButtonBox: {
        width: '100%',

        // sub
        flexDirection: 'row', /* row, column */
        justifyContent: 'space-around',  /* flex-start, center, flex-end, space-around(两端不顶头均分), space-between(两端顶头均分) */
        alignItems: 'center', /* flex-start, center, flex-end, stretch */
    },

    actionButton: {
        width: 120,
    }
};

export default ScreenTimer;

