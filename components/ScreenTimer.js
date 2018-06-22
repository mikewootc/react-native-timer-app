import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Button, 
    Text,
    Vibration,
} from 'react-native';

class ScreenTimer extends React.Component {
    //static defaultProps = {
    //    def1: 'value',
    //};

    constructor(props) {
        super(props);

        this.startTime = 0;
        this.state = {
            countDownStart: 10,
            countDown: 10,
        }
    }

    componentDidMount() {
        console.log('componentDidMount()');
        this.timerTask = setInterval(() => {
            if (this.startTime > 0) {
                const now = new Date();
                const diff = Math.floor(parseInt(now - this.startTime) / 1000);
                console.log('diff:', diff);
                const countDown = this.state.countDownStart - diff;
                if (countDown >= 0) {
                    this.setState((prevState, props) => ({
                        countDown,
                    }));
                } else {
                    this.startTime = 0;
                    Vibration.vibrate([0, 500, 500, 500, 500, 500]);
                }
            }
        }, 1000);
    }

    componentWillUnmount(nextProps, nextState) {
        console.log('componentWillUnmount()');
        if (this.timerTask) {
            clearInterval(this.timerTask);
        }
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
            <Text style={{}}>
                { this.doubleIt(Math.floor(this.state.countDown / 60)) } : { this.doubleIt(this.state.countDown % 60) }
            </Text>
        );
    }

    render() {
        return (
            <View>
                { this.renderCountDownTime() }

                <Button
                    style={{}}
                    title="Start"
                    onPress={() => {
                        this.startTime = new Date();
                    }}
                    color="#4080f0"
                    accessibilityLabel="Button's accessibilityLabel"
                />
            </View>
        );
    }
}

//ClassName.defaultProps = {
//    dkey: 'Default'
//}

const ss = StyleSheet.create({
});

export default ScreenTimer;

