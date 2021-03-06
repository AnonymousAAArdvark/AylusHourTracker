import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableHighlight, AsyncStorage } from 'react-native';
import ExportModal from '../components/ExportModal';
import ToggleableTimerForm from '../components/ToggleableTimerForm';
import { newEventTimer, sortTimers } from '../utils/TimerUtils';
import { MaterialIcons } from '@expo/vector-icons'; 
import TimerButton from '../components/TimerButton';
import humanToMiliseconds from '../utils/TimerUtils';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import DateSection from '../components/DateSection';

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
      //    AsyncStorage.getAllKeys()
      //      .then(keys => AsyncStorage.multiRemove(keys))
      //      .then(() => alert('success'));
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
  removeAllTimers = async () => {
    this.setState({
      timers: []
    })
    await AsyncStorage.removeItem('@SavedEvents')
  }
  optionNo = () => {
    this.openConfirm(false);
  }

  handleRemovePress = timerId => {
    const { timers } = this.state;
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId)
    })
  }
  handleUpdate = () => {
    const { timers } = this.state;
    saveTimers(timers)
  }
  handleCreateSubmit = timer => {
    const { timers } = this.state;
    const sortData = [newEventTimer(timer), ...timers]
    sortData.sort(function(a,b){
        return new Date(b.date) - new Date(a.date);
    });
    this.setState({
      timers: sortData
    })
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
  setTimers(getTimer){
    this.setState({
      timers: getTimer
    })
  }
  renderEditableTimers(){ 
    const { timers } = this.state
    const sortedTimers = sortTimers(timers)
    if (timers.length != 0) {
      return(
        sortedTimers.map(({ date, timers, id }) => (
          <DateSection
            date={date}
            timers={timers}
            fullTimers={this.state.timers}
            key={id}
            isCompact={this.state.compactMode}
            getTimers={ getTimer => this.setTimers(getTimer)} 
          />
          
        ))
      );
    }
    else {
      return(
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Saved events will appear here.</Text>
        </View>
      )
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
          <ExportModal data={timers} />
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
    paddingTop: 5,
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
  placeholder: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  placeholderText: {
    color: '#595959',
    fontSize: 20,
    fontWeight: '700'
  },
});