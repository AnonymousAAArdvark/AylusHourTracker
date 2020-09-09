import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { millisecondsToHuman } from '../utils/TimerUtils';
import TimerButton from './TimerButton';

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
    const { onEditPress, compact, } = this.props
    return(
      <View style={compact ? styles.buttonGroup:styles.compactButtonGroup}>
        <TimerButton color="crimson" small title="Edit" onPress={onEditPress}/>
        <TimerButton color="crimson" small title="Remove" onPress={this.handleRemovePress}/>
      </View>
    )
  }
  render(){
    const { title, date, elapsed, aylus, compact} = this.props
    const elapsedString = millisecondsToHuman(elapsed);
    if (!compact) {
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
    else{
      return(
        <View style={styles.compactTimerContainer}>
          <Text style={styles.compactTitle}>{title}</Text>
          <View style={styles.compactInfoContainer}>
            <Text style={styles.compactElapsedTime}>{elapsedString}</Text>
            <Text style={styles.compactElapsedTime}>|</Text>
            <Text style={styles.compactDate}>{date}</Text>
          </View>
          <Text style={styles.compactEvent}>{aylus ? "AYLUS Event":"Not AYLUS Event"}</Text>
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
}

const styles = StyleSheet.create({
  timerContainer: {
    backgroundColor: 'white',
    borderColor: '#d6d7da',
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 3,
    marginTop: 7,
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
    fontSize: 50,
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
  compactTimerContainer: {
    backgroundColor: 'white',
    borderColor: '#d6d7da',
    borderWidth: 2,
    borderRadius: 7,
    padding: 10,
    margin: 15,
    marginBottom: 3,
    marginTop: 7,
  },
  compactTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  compactInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  compactDate: {
    fontSize: 25,
    color: 'black',
  },
  compactEvent: {
    fontSize: 20,
    color: 'black',
  },
  compactElapsedTime: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
  },
  compactButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
})
