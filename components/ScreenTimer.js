'use strict';

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
//import KeepAwake from 'react-native-keep-awake';
import Tts from 'react-native-tts';

class MyButton extends React.Component {
    constructor(props) {
        super(props);
        Tts.setDefaultLanguage('zh-CN');
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
        this.periodPrompt = false;
        this.vibrating = false;
        this.state = {
            countDownCeiling: 0,
            countDown: 0,
        }

        this.countDownMoveCeiling = this.countDownMoveCeiling.bind(this);
    }

    componentDidMount() {
        console.log('componentDidMount()');
        this.countDownTask();
    }

    componentWillUnmount(nextProps, nextState) {
        console.log('componentWillUnmount()');
        if (this.timerTask) {
            BackgroundTimer.clearInterval(this.timerTask);
        }
    }

    countDownTask() {
        if (!this.timerTask) {
            this.timerTask = BackgroundTimer.setInterval(() => {
                if (this.startTime > 0) {
                    const now = new Date();
                    const diff = Math.floor(parseInt(now - this.startTime) / 1000);
                    const countDown = this.state.countDownCeiling - diff;
                    if (countDown != this.state.countDown) {
                        console.log('countDown:', countDown);
                        if (this.periodPrompt) {
                            // prompt periodically by vibration
                            let quarter = Math.floor(this.state.countDownCeiling / 4);
                            let promptPoints = [quarter, quarter * 2, quarter * 3];
                            if (promptPoints.indexOf(countDown) >= 0) {
                                console.log('##### vibrateShort');
                                this.vibrateShort();
                            }

                            // prompt by voice at every minute
                            if (countDown != 0 && Math.floor(countDown) % 60 === 0) {
                                let minute = '' + (Math.floor(countDown) / 60);
                                console.log('##### Tts.speak:', minute);
                                Tts.speak(minute);
                            }
                        }
                    }
                    if (countDown >= 0) {
                        this.setState((prevState, props) => ({
                            countDown,
                        }));
                    } else {
                        this.countDownTimeup();
                    }
                }
            }, 100);
        }
    }

    // periodPrompt: true: prompt(vibrate at quarter and voice at every minute); false: not prompt
    countDownStart(periodPrompt) {
        if (this.startTime == 0) {
            this.startTime = new Date();
            this.periodPrompt = periodPrompt;
            //KeepAwake.activate();
        }
    }

    countDownStop() {
        this.startTime = 0;
        this.periodPrompt = false;
        this.setState((prevState, props) => ({
            countDown: prevState.countDownCeiling,
        }));
        //KeepAwake.deactivate();
    }

    countDownTimeup() {
        this.startTime = 0;
        this.periodPrompt = false;
        this.setState((prevState, props) => ({
            countDown: prevState.countDownCeiling,
        }));
        this.vibrateLong();
        //KeepAwake.deactivate();
    }

    countDownSetCeiling(seconds) {
        this.setState((prevState, props) => ({
            countDownCeiling: seconds,
            countDown: seconds,
        }));
    }

    // dir: 1 / -1
    countDownMoveCeiling(dir, seconds) {
        let ceiling = this.state.countDownCeiling + (dir * seconds);
        if (ceiling >= 0) {
            this.countDownSetCeiling(ceiling);
        }
    }

    vibrateShort() {
        let vibs = [0, 300, 100, 300];
        Vibration.vibrate(vibs);
    }

    vibrateLong() {
        let vibs = [0, 500];
        for (let i = 0; i < 10; i++) {
            vibs.push(500);
            vibs.push(500);
        }
        Vibration.vibrate(vibs);
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

    render() {
        return (
            <View style={ss.box}>
                <View style={ss.timerBox}>
                    <View style={ss.timerCellBox}>
                        <MyButton style={ss.ceilButton} title="▲"
                            onPress={() => {
                                this.countDownMoveCeiling(1, 60);
                            }}
                        />
                        <Text style={ss.timerText}>
                            { this.doubleIt(Math.floor(this.state.countDown / 60)) }
                        </Text>
                        <MyButton style={ss.ceilButton} title="▼"
                            onPress={() => {
                                this.countDownMoveCeiling(-1, 60);
                            }}
                        />
                    </View>

                    <Text style={ss.timerText}>
                        :
                    </Text>

                    <View style={ss.timerCellBox}>
                        <MyButton style={ss.ceilButton} title="▲"
                            onPress={() => {
                                this.countDownMoveCeiling(1, 5);
                            }}
                        />
                        <Text style={ss.timerText}>
                            { this.doubleIt(this.state.countDown % 60) }
                        </Text>
                        <MyButton style={ss.ceilButton} title="▼"
                            onPress={() => {
                                this.countDownMoveCeiling(-1, 5);
                            }}
                        />
                    </View>
                </View>

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
                    <MyButton style={ss.actionButtonStart} title="Start"
                        onPress={() => {
                            this.countDownStart(false);
                        }}
                    />

                    <MyButton style={ss.actionButtonStart} title="StartP"
                        onPress={() => {
                            this.countDownStart(true);
                        }}
                    />

                    <MyButton style={ss.actionButtonStop} title="Stop"
                        onPress={() => {
                            this.vibrateCancel();
                            this.countDownStop();
                        }}
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

    timerBox: {
        // sub
        flexDirection: 'row', /* row, column */
        justifyContent: 'center',  /* flex-start, center, flex-end, space-around(两端不顶头均分), space-between(两端顶头均分) */
        alignItems: 'center', /* flex-start, center, flex-end, stretch */
        width: '100%',
    },

    timerCellBox: {
        flexDirection: 'column', /* row, column */
        justifyContent: 'center',  /* flex-start, center, flex-end, space-around(两端不顶头均分), space-between(两端顶头均分) */
        alignItems: 'center', /* flex-start, center, flex-end, stretch */
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
        backgroundColor: "#4080c0",
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

    actionButtonStart: {
        width: '30%',
        backgroundColor: "#208020",
    },

    actionButtonStop: {
        width: '30%',
        backgroundColor: "#802020",
    },
};

export default ScreenTimer;

