import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { millisecondsToHuman } from '../utils/TimerUtils';
import TimerButton from './TimerButton';
import { ConfirmDialog } from 'react-native-simple-dialogs';
const Pulse = require('react-native-pulse').default;

export default class MainTimer extends React.Component {
  state = {
    showConfirm: false
  }
  openConfirm = (show) => {
    this.setState({ showConfirm: show });
    console.log(this.state.showConfirm)
  }
  handleRemovePress = () => {
    this.openConfirm(true)

  }
  optionYes = () => {
    this.openConfirm(false);
    // Yes, this is a workaround :(
    // Why? See this https://github.com/facebook/react-native/issues/10471
    setTimeout(
        () => {
          const { id, onRemovePress } = this.props;
          onRemovePress(id)
        },
        500,
    );
  }

  optionNo = () => {
    this.openConfirm(false);
  }
  handleStartPress = () => {
    const { id, onStartPress } = this.props;
    onStartPress(id);
  }

  handleStopPress = () => {
    const { id, onStopPress } = this.props;
    onStopPress(id)
  }

  handleSavePress = () => {
    const { id, onSavePress } = this.props;
    onSavePress(id);
  }

  renderActionButton() {
     const { isRunning } = this.props;

     if (isRunning){
       return(
        <View style={styles.container}>
          <Pulse color='#21BA45' numPulses={2} diameter={200} speed={20} duration={1800} />
          <TouchableHighlight style={styles.pauseButton} alignContent='center' underlayColor='#2ed956' onPress={this.handleStopPress}>
            <FontAwesome style={styles.pauseIcon} name="pause" size={95} color='white' />
          </TouchableHighlight> 
        </View>
       )
     }

     return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.resumeButton} alignContent='center' underlayColor='#f73535' onPress={this.handleStartPress}>
          <FontAwesome style={styles.resumeIcon} name="play" size={100} color='white' />
        </TouchableHighlight> 
      </View>
     )
  }
  render(){
    const { isRunning } = this.props;
    const { title, date, aylus, elapsed, onEditPress } = this.props
    const elapsedString = millisecondsToHuman(elapsed);
    return(
      <View style={styles.timerContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={{...styles.date, marginBottom:0}}>{date}</Text>
        <Text style={styles.event}>{aylus ? "AYLUS Event":"Not AYLUS Event"}</Text>
        <Text style={styles.elapsedTime}>{elapsedString}</Text>
        { this.renderActionButton()}
        <View style={styles.buttonGroup}>
          <TimerButton color="crimson" large title="Edit" onPress={onEditPress}/>
          {!isRunning ? <TimerButton color="orange" large title="Save" onPress={this.handleSavePress}/> : null}
          <TimerButton color="crimson" large title="Reset" onPress={this.handleRemovePress}/>
        </View>
        <ConfirmDialog
          title="Reset Timer"
          message="Are you sure you want to reset the timer?"
          onTouchOutside={() => this.openConfirm(false)}
          visible={this.state.showConfirm}
          negativeButton={{
            title: "NO",
            onPress: this.optionNo,
            disabled: false,
          }}
          positiveButton={{
            title: "YES",
            onPress: this.optionYes,
            titleStyle: {
              color: "red",
              colorDisabled: "red",
            },
            style: {
                backgroundColor: "transparent",
                backgroundColorDisabled: "transparent",
            },
          }}
        />
      </View>
    )
   }
}

const styles = StyleSheet.create({
  timerContainer: {
    backgroundColor: 'white',
    borderColor: '#D6D7DA',
    borderWidth: 0,
    borderRadius: 0,
    padding: 15,
    margin: 0,
    width: '100%',
    height: '101%',
    marginBottom: 0,
    marginTop: -4,
  },
  title: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
  },
  date: {
    color: 'black',
    fontSize: 25,
    marginBottom: 3,
  },
  event: {
    color: 'black',
    fontSize: 20,
    marginBottom: 0,
  },
  elapsedTime: {
    fontSize: 70,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: '5%',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
    bottom: 15,
    left:'4%',
  },
  pauseButton: {
    borderRadius: 100,
    borderWidth: 4,
    width: 135,
    height: 135,
    backgroundColor: '#21BA45',
    borderColor:'#178531'
  },
  resumeButton: {
    borderRadius: 100,
    borderWidth: 4,
    width: 135,
    height: 135,
    backgroundColor: '#DB2828',
    borderColor: '#9f1a1a',
  },
  container: {
    position: 'absolute',
    alignSelf: 'center',
    marginBottom: -60,
    bottom: '36%',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: '21%',
  },
  pauseIcon: {
    alignItems: 'stretch',
    justifyContent: 'center',
    marginLeft: 22,
    marginTop: 16,
  },
  resumeIcon: {
    alignItems: 'stretch',
    justifyContent: 'center',
    marginLeft: 32,
    marginTop: 14
  },
})
