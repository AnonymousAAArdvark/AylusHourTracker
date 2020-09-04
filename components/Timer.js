import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { millisecondsToHuman } from '../utils/TimerUtils';
import TimerButton from './TimerButton';
import '../utils/global'

export default class Timer extends React.Component {
  state = {
    showConfirm: false
  }
  openConfirm = (show) => {
    this.setState({ showConfirm: show });
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
  renderTimerContainer = () => {
    const { isCompact } = this.props;
    onStopPress(id)
  }
  renderTimerEdit = () => {
    const { onEditPress, editingTimer } = this.props
    if (!editForm) {
      return(
        <View style={styles.buttonGroup}>
          <TimerButton color="crimson" small title="Edit" onPress={onEditPress}/>
          <TimerButton color="crimson" small title="Remove" onPress={this.handleRemovePress}/>
        </View>
      )
    }
    else {
      return(
        <View style={styles.buttonGroup}>
          <TimerButton color="#f9bfca" small title="Edit" onPress={null} opacity={1} />
          <TimerButton color="crimson" small title="Remove" onPress={this.handleRemovePress}/>
        </View>
      )
    }
  }
  render(){
    const { title, date, elapsed, aylus} = this.props
    const elapsedString = millisecondsToHuman(elapsed);

    return(
      <View style={styles.timerContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.date}>|</Text>
          <Text style={styles.date}>{aylus ? "AYLUS Event":"Not AYLUS Event"}</Text>
        </View>
        <Text style={styles.elapsedTime}>{elapsedString}</Text>
        {this.renderTimerEdit()}
        <ConfirmDialog
          title="Delete Event"
          message="Are you sure you want to delete this event? This will remove all data on this event."
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
    borderColor: '#d6d7da',
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 0
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  date: {
    fontSize: 22,
    color: 'black',
  },
  elapsedTime: {
    fontSize: 55,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 5,
    color: 'black',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
})
