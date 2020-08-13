import React from 'react';
import { StyleSheet, View, ScrollView, Text, KeyboardAvoidingView, AsyncStorage, AppState } from 'react-native';
import uuidv4 from 'uuid/v4';
import moment from 'moment'
import MainEditableTimer from '../components/MainEditableTimer';
import MainToggleableTimerForm from '../components/MainToggleableTimerForm';
import { newTimer } from '../utils/TimerUtils';

const saveTimers = async (timersArray) => {
  try {
    const timersString = JSON.stringify(timersArray);
    await AsyncStorage.setItem('@SavedTimer',timersString);
  } catch (error) {
    console.error(error)
  }
};

export default class App extends React.Component {
  _isMounted = false;
  state = {
    timerOpen: false,
    CURR_TIME: moment(),
    shouldCount: false,
    prevTime: 0,
    timers: [
      // {
      //   title: 'Feed my Starving Children',
      //   date: '12/65/1999',
      //   id: uuidv4(),
      //   elapsed: 5456099,
      // },
    ],
  }
  componentDidMount = async () => {
    this._isMounted = true
    const TIME_INTERVAL = 1000
    console.log('screen 1 component mounted')
    try{
      const timersString = await AsyncStorage.getItem('@SavedTimer');
      const retrievedTimerOpen= await AsyncStorage.getItem('@timerOpen');
      const retrievedCURR_TIME= await AsyncStorage.getItem('@CURR_TIME');
      const retrievedShouldCount= await AsyncStorage.getItem('@shouldCount');
      const retrievedPrevTime= await AsyncStorage.getItem('@prevTime');
      if (retrievedTimerOpen != null && retrievedCURR_TIME != null && retrievedShouldCount && retrievedPrevTime != null){
        this.state.timerOpen = JSON.parse(retrievedTimerOpen)
        this.state.CURR_TIME = JSON.parse(retrievedCURR_TIME)
        this.state.shouldCount = JSON.parse(retrievedShouldCount)
        this.state.prevTime = JSON.parse(retrievedPrevTime)
      }
      if (timersString !== null){
        // AsyncStorage.getAllKeys()
        //   .then(keys => AsyncStorage.multiRemove(keys))
        //   .then(() => alert('success'));
        let caughtTimers = JSON.parse(timersString);
        this.setState({
          timers: caughtTimers
        })
      }
    } catch (error) {
      console.log(error.message)
    }
    this.intervalId = setInterval(() => {
      if (this.state.shouldCount == false) {
        this.state.CURR_TIME=moment()
      }
      if (AppState.currentState == "inactive" || AppState.currentState == "background") {
        AsyncStorage.setItem('@timerOpen', JSON.stringify(this.state.timerOpen));
        AsyncStorage.setItem('@CURR_TIME', JSON.stringify(this.state.CURR_TIME));
        AsyncStorage.setItem('@shouldCount', JSON.stringify(this.state.shouldCount));
        AsyncStorage.setItem('@prevTime', JSON.stringify(this.state.prevTime));
      }
      const { timers } = this.state;
      this.setState({
        timers: timers.map(timer => {
          const { elapsed, isRunning } = timer;
          this.state.shouldCount = true
          if (isRunning == false) {
            this.state.prevTime = elapsed
            this.state.shouldCount = false
            try{
              AsyncStorage.setItem('@timerOpen', JSON.stringify(this.state.timerOpen));
              AsyncStorage.setItem('@CURR_TIME', JSON.stringify(this.state.CURR_TIME));
              AsyncStorage.setItem('@shouldCount', JSON.stringify(this.state.shouldCount));
              AsyncStorage.setItem('@prevTime', JSON.stringify(this.state.prevTime));
              saveTimers(timers)
            } catch (error){
              console.log(error.message)
            }
          }
          return {
            ...timer,
            elapsed: isRunning ? moment().diff(this.state.CURR_TIME) + this.state.prevTime: elapsed
          }
        })
      })
    }, TIME_INTERVAL)
  }

  componentWillUnmount = () => {
    this._isMounted = true
    clearInterval(this.intervalId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timers !== this.state.timers) {
    saveTimers(this.state.timers)
    }
  }

  handleFormSubmit = attrs => {
    const { timers } = this.state;

    this.setState({
      timers: timers.map(timer => {
        if (timer.id === attrs.id) {
          const { title, date } = attrs;

          return {
            ...timer,
            title,
            date,
          }
        } else {
          return timer
        }
      })
    })
  }

  handleRemovePress = timerId => {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId),
      CURR_TIME: moment(),
      shouldCount: false,
      prevTime: 0,
    })
    AsyncStorage.removeItem('@timerOpen')
    this.setState({timerOpen: false})
  }

  handleSaveTimer = async timerId => {
    const { timers } = this.state;
    try {
      const timersString = await AsyncStorage.getItem('@SavedEvents');
      if (timersString !== null){
        let caughtTimers = JSON.parse(timersString);
        caughtTimers.push(timers[0]);
        AsyncStorage.setItem('@SavedEvents', JSON.stringify(caughtTimers));
        this.handleRemovePress(timerId)
      }
      else {
        const exportTimer = JSON.stringify(timers);
        await AsyncStorage.setItem('@SavedEvents', exportTimer);
        this.handleRemovePress(timerId)
      }
    } catch (error) {
      console.error(error)
    }
  }

  handleCreateSubmit = timer => {
    const { timers } = this.state;

    this.setState({
      timers: [newTimer(timer)]
    })
    this.setState({timerOpen: true})
  }

  toggleTimer = timerId => {
    this.setState(prevState => {
      const { timers } = this.state;
      return {
        timers: timers.map(timer => {
          const { id, isRunning } = timer;

          if (id === timerId) {
            return{
              ...timer,
              isRunning: !isRunning,
            };
          }
          return timer;
        })
      }
    })
  }

  renderEditableTimers = () => (
    this.state.timers.map(({ title, date, id, elapsed, isRunning}) => (
      <MainEditableTimer
        key={ id }
        id={id}
        title={title}
        date={date}
        elapsed={elapsed}
        isRunning={isRunning}
        onFormSubmit={this.handleFormSubmit}
        onRemovePress={this.handleRemovePress}
        onStartPress={this.toggleTimer}
        onStopPress={this.toggleTimer}
        onSavePress={this.handleSaveTimer}
      />
    ))
  );
  
  render() {
    const { timerOpen } = this.state;
    const { timers } = this.state;
    if(timerOpen == false) {
      return(
        <View style={styles.appContainer}>
          <KeyboardAvoidingView behavior="padding" style={styles.timerListContainer}>
            <MainToggleableTimerForm onFormSubmit={this.handleCreateSubmit}/>
            { this.renderEditableTimers() }
          </KeyboardAvoidingView>
        </View>
      )
    } else{
      return(
        <View style={styles.appContainer}>
        { this.renderEditableTimers() }
         </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  timerList: {
    paddingBottom: 15,
  },
  timerListContainer: {
    flex: 1,
  }
});
