import React from 'react';
import { StyleSheet, View, ScrollView, Text, KeyboardAvoidingView, TouchableHighlight, Platform, AsyncStorage } from 'react-native';
import EditableTimer from '../components/EditableTimer';
import CompactEditableTimer from '../components/CompactEditableTimer';
import ToggleableTimerForm from '../components/ToggleableTimerForm';
import { newEventTimer } from '../utils/TimerUtils';
import { MaterialIcons } from '@expo/vector-icons'; 
import TimerButton from '../components/TimerButton';
import humanToMiliseconds from '../utils/TimerUtils';

import '../utils/global'
import { ConfirmDialog } from 'react-native-simple-dialogs';


const saveTimers = async (timersArray) => {
  try {
    const timersString = JSON.stringify(timersArray);
    await AsyncStorage.setItem('@SavedEvents',timersString);
  } catch (error) {
    console.error(error)
  }
};
export default class App extends React.Component {
  state = {
    timers: [
      // {
      //   title: 'Feed my Starving Children',
      //   date: '12/65/1999',
      //   id: uuidv4(),
      //   elapsed: 5456099,
      // },
      // {
      //   title: 'Park Cleanup Service',
      //   date: '12/34/2026',
      //   id: uuidv4(),
      //   elapsed: 1273998,
      // }
    ],
    compactMode: false,
    showConfirm: false,
  }
  async componentDidMount() {
    const { timers } = this.state;
    try {
      const timersString = await AsyncStorage.getItem('@SavedEvents');
      const compactString = await AsyncStorage.getItem('@compactMode');
      if (timersString !== null){
        // AsyncStorage.getAllKeys()
        //   .then(keys => AsyncStorage.multiRemove(keys))
        //   .then(() => alert('success'));
        let caughtTimers = JSON.parse(timersString);
        this.setState({
          timers: caughtTimers
        })
      }
      if (compactString !== null){
        // AsyncStorage.getAllKeys()
        //   .then(keys => AsyncStorage.multiRemove(keys))
        //   .then(() => alert('success'));
        let caughtCompact = JSON.parse(compactString);
        this.setState({
          compactMode: caughtCompact
        })
      }
    } catch (error) {
      console.error(error)
    }
    this.intervalId = setInterval(async () => {
      try {
        const timersString = await AsyncStorage.getItem('@SavedEvents');
        const compactString = await AsyncStorage.getItem('@compactMode');
        if (timersString !== null){
          // AsyncStorage.getAllKeys()
          //   .then(keys => AsyncStorage.multiRemove(keys))
          //   .then(() => alert('success'));
          let caughtTimers = JSON.parse(timersString);
          this.setState({
            timers: caughtTimers
          })
        }
        if (compactString !== null){
          // AsyncStorage.getAllKeys()
          //   .then(keys => AsyncStorage.multiRemove(keys))
          //   .then(() => alert('success'));
          let caughtCompact = JSON.parse(compactString);
          this.setState({
            compactMode: caughtCompact
          })
        }
      } catch (error) {
        console.error(error)
      }
    }, 500)
    console.log('screen 2 component mounted')
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.timers !== this.state.timers) {
      this.handleUpdate()      
    }
    if (prevState.compactMode !== this.state.compactMode) {
      try {
        await AsyncStorage.setItem('@compactMode',JSON.stringify(this.state.compactMode));
      } catch (error) {
        console.error(error)
      }     
    }
  }
  componentWillUnmount = () => {
    console.log('screen 2 component umounted')
    clearInterval(this.intervalId);
  }
  openConfirm = (show) => {
    this.setState({ showConfirm: show });
  }
  handleClearPress = () => {
    this.openConfirm(true)
  }
  optionYes = () => {
    this.openConfirm(false);
    // Yes, this is a workaround :(
    // Why? See this https://github.com/facebook/react-native/issues/10471
    setTimeout(
        () => {
          this.removeAllTimers()
        },
        1000,
    );
  }
  removeAllTimers = () => {
    this.setState({
      timers: []
    })
    AsyncStorage.removeItem('@SavedEvents')
  }
  optionNo = () => {
    this.openConfirm(false);
  }
  handleFormSubmit = attrs => {
    const { timers } = this.state;
    this.setState({
      timers: timers.map(timer => {
        if (timer.id === attrs.id) {
          const { title, date, elapsed } = attrs;
          return {
            ...timer,
            title,
            date,
            elapsed: humanToMiliseconds(selectHours, selectMinutes, 0),
          }
        } else {
          return timer
        }
      })
    })
    //this.handleUpdate()
  }

  handleRemovePress = timerId => {
    const { timers } = this.state;
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId)
    })
    //this.handleUpdate()
  }
  handleUpdate = () => {
    const { timers } = this.state;
    saveTimers(timers)
  }
  handleCreateSubmit = timer => {
    const { timers } = this.state;
    this.setState({
      timers: [newEventTimer(timer), ...timers]
    })
    //this.handleUpdate()
  }
  handleLayoutSwitch = () => {
    this.setState({
      compactMode: false
    })
  }
  handleCompactSwitch = () => {
    this.setState({
      compactMode: true
    })
  }

  renderEditableTimers(){ 
    if (this.state.compactMode){
      return(
        this.state.timers.map(({ title, date, id, elapsed, isRunning}) => (
          <CompactEditableTimer
            key={ id }
            id={id}
            title={title}
            date={date}
            elapsed={elapsed}
            isRunning={isRunning}
            onFormSubmit={this.handleFormSubmit}
            onRemovePress={this.handleRemovePress}
          />
        ))
      );
    }
    else{
      return(
        this.state.timers.map(({ title, date, id, elapsed, isRunning}) => (
          <EditableTimer
            key={ id }
            id={id}
            title={title}
            date={date}
            elapsed={elapsed}
            isRunning={isRunning}
            onFormSubmit={this.handleFormSubmit}
            onRemovePress={this.handleRemovePress}
          />
        ))
      );
    }
  }
  renderLayoutButton() {
    if (this.state.compactMode){
      return(
       <TouchableHighlight style={styles.layoutButton} underlayColor='#00f23a' >
         <MaterialIcons style={styles.layoutIcon} name="view-agenda" size={60} color='white' onPress={this.handleLayoutSwitch}/>
       </TouchableHighlight> 
      )
    }

    return (
     <TouchableHighlight style={styles.layoutButton} underlayColor='#ff1212' >
       <MaterialIcons style={styles.compactIcon} name="view-headline" size={70} color='white' onPress={this.handleCompactSwitch}/>
     </TouchableHighlight> 
    )
  }
  render() {
    const { timers } = this.state;
    return(
      <View style={styles.appContainer}>
        <ScrollView style={styles.timerList}>
          <ToggleableTimerForm isOpen={false} onFormSubmit={this.handleCreateSubmit}/>
          { this.renderEditableTimers() }
          <View style={styles.buttonPadding}>
            <TimerButton title="Remove all Events" color="crimson" onPress={this.handleClearPress}/>
          </View>
        </ScrollView>
        <ConfirmDialog
            title="Remove all Events"
            message="Are you sure you want to remove all events? This will remove all events and their data from this device."
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
              },
            }}
          />
        { this.renderLayoutButton() }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonPadding: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  appContainer: {
    flex: 1,
  },
  timerList: {
    paddingBottom: 100,
  },
  layoutButton: {
    borderRadius: 100,
    width: 85,
    borderWidth: 2,
    height: 85,
    backgroundColor: 'crimson',
    position: 'absolute',
    bottom:12,
    right:12,
  },
  compactIcon: {
    marginLeft: 5,
    marginTop: 5,
  },
  layoutIcon: {
    marginLeft: 11,
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 55,
  },
});