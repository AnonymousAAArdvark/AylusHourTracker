import React from 'react';
import { StyleSheet, Image, View, ScrollView, Text, TextInput, KeyboardAvoidingView, AsyncStorage, ImageBackground, Platform } from 'react-native';
import {millisecondsToHours} from '../utils/TimerUtils';
import humanToMiliseconds from '../utils/TimerUtils';
import { Ionicons, FontAwesome5} from '@expo/vector-icons';
import background from '../assets/images/back.png'
import AwardModal from '../components/AwardModal'
import ProfileSelector from '../components/ProfileSelector'
import ModalSelector from 'react-native-modal-selector'

const sum = function(items, prop){
    return items.reduce( function(a, b){
        return a + b[prop];
    }, 0);
};

export default class App extends React.Component {
  state = {
      timers: [],
      totalTime: 0,
      bronzeTime: 180000000,
      silverTime: 360000000,
      goldTime: 540000000,
      myNumber: '',
  }
  async componentDidMount() {
    const { timers } = this.state;
    try {
      const timersString = await AsyncStorage.getItem('@SavedEvents');
      if (timersString !== null){
        // AsyncStorage.getAllKeys()
        //   .then(keys => AsyncStorage.multiRemove(keys))
        //   .then(() => alert('success'));
        let caughtTimers = JSON.parse(timersString);
        this.setState({
          timers: caughtTimers,
          totalTime: sum(this.state.timers, 'elapsed')
        })
      }
    } catch (error) {
      console.error(error)
    }
    this.intervalId = setInterval(async () => {
      try {
        const timersString = await AsyncStorage.getItem('@SavedEvents');
        if (timersString !== null){
          // AsyncStorage.getAllKeys()
          //   .then(keys => AsyncStorage.multiRemove(keys))
          //   .then(() => alert('success'));
          let caughtTimers = JSON.parse(timersString);
          this.setState({
            timers: caughtTimers,
            totalTime: sum(this.state.timers, 'elapsed')
          })
        }
      } catch (error) {
        console.error(error)
      }
    }, 500)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timers !== this.state.timers) {
      //this.handleUpdate()      
    }
  }
  componentWillUnmount = () => {
    console.log('screen 3 component umounted')
    clearInterval(this.intervalId);
  }
  setGoldHours(setGoldTime){
    this.setState({
      goldTime: humanToMiliseconds(setGoldTime,0,0)
    })
  }
  setSilverHours(setSilverTime){
    this.setState({
      silverTime: humanToMiliseconds(setSilverTime,0,0)
    })
  }
  setBronzeHours(setBronzeTime){
    this.setState({
      bronzeTime: humanToMiliseconds(setBronzeTime,0,0)
    })
  }
  renderHoursWorked = () => {
    const { totalTime } = this.state
    if(totalTime >= this.state.goldTime){
      return(
        <Text style={[styles.TextComponentStyle]}>
          <Text style={[styles.bold]}>Total hours worked: {millisecondsToHours(totalTime)}.</Text>
          <Text> You qualify for </Text>
          <FontAwesome5 name="medal" size={30} color='goldenrod' />
          <Text style={[styles.goldText, styles.bold]}>Gold!</Text>
        </Text>
      )
    }
    else if(totalTime >= this.state.silverTime){
      return(
        <Text style={[styles.TextComponentStyle]}>
          <Text style={[styles.bold]}>Total hours worked: {millisecondsToHours(totalTime)}.</Text>
          <Text> You qualify for </Text>
          <FontAwesome5 name="medal" size={30} color='lightslategrey' />
          <Text style={[styles.silverText, styles.bold]}>Silver</Text>
          <Text> and need to complete </Text>
          <Text style={[styles.bold]}>{millisecondsToHours(this.state.goldTime-totalTime)}</Text>
          <Text> more hours to reach gold.</Text>
        </Text>
      )
    }
    else if(totalTime >= this.state.bronzeTime){
      return(
        <Text style={[styles.TextComponentStyle]}>
          <Text style={[styles.bold]}>Total hours worked: {millisecondsToHours(totalTime)}.</Text>
          <Text> You qualify for </Text>
          <FontAwesome5 name="medal" size={30} color='#cd7f32' />
          <Text style={[styles.bronzeText, styles.bold]}>Bronze</Text>
          <Text> and need to complete </Text>
          <Text style={[styles.bold]}>{millisecondsToHours(this.state.silverTime-totalTime)}</Text>
          <Text> more hours to reach silver.</Text>
        </Text>
        )
      }
    else {
      return(
        <Text style={[styles.TextComponentStyle]}>
          <Text style={[styles.bold]}>Total hours worked: {millisecondsToHours(totalTime)}.</Text>
          <Text> You need to complete </Text>
          <Text style={[styles.bold]}>{millisecondsToHours(this.state.bronzeTime-totalTime)}</Text>
        <Text> more hours to reach bronze.</Text>
        </Text>
      )
    }
  }

  render() {
    const { timers, totalTime } = this.state;

    return(
      <View style={styles.appContainer}>
        <ImageBackground source={background} style={styles.image} imageStyle={{opacity:0.1}}>
        <KeyboardAvoidingView behavior="padding" style={styles.timerListContainer}>
          <ScrollView style={styles.timerList}>
            <View style={styles.MainContainer}>
                <Text style={[styles.TextComponentStyle]}>About PVSA Rewards</Text>
                <View style={styles.medalContainer}>
                  <FontAwesome5 name="medal" size={40} color='goldenrod' />
                  <Text style={[styles.TextComponentStyle, styles.goldText]}>Gold Award</Text>
                </View>
                <View style={styles.medalContainer}>
                  <FontAwesome5 name="medal" size={40} color='lightslategrey' />
                  <Text style={[styles.TextComponentStyle, styles.silverText]}>Silver Award</Text>
                </View>
                <View style={styles.medalContainer}>
                  <FontAwesome5 name="medal" size={40} color='#cd7f32' />
                  <Text style={[styles.TextComponentStyle, styles.bronzeText]}>Bronze Award</Text>
                </View>

                { this.renderHoursWorked() }
            </View>
            <AwardModal
              getGoldHours={ getGold => this.setGoldHours(getGold)}
              getSilverHours={ getSilver => this.setSilverHours(getSilver)}
              getBronzeHours={ getBronze => this.setBronzeHours(getBronze)}
            />
          </ScrollView>
        </KeyboardAvoidingView>
        </ImageBackground>
      </View>

    )
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
  },
  MainContainer: {

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
  TextComponentStyle: {
    width: '95%',
    borderRadius: 3,
    textAlign: 'left',
    alignSelf: 'center',
    // Set border width.
    borderWidth: 5,
    paddingLeft: Platform.OS === 'ios' ? 5:10,
    paddingTop: Platform.OS === 'ios' ? 0:5,
    paddingRight: Platform.OS === 'ios' ? 0:4,

    // Set border Hex Color Code Here.

    // Adding padding on Text component.
    padding : 2,
    color: 'black',
    fontSize: 25,
    margin: 10
},
  goldText: {
    color: 'goldenrod',
    borderColor: 'goldenrod',
  },
  silverText: {
    color: 'lightslategrey',
    borderColor: 'lightslategrey',
  },
  bronzeText: {
    color: '#cd7f32',
    borderColor: '#cd7f32',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    opacity: 1,
  },
  container: {
    flex: 1,
    flexDirection: "column"
  },
  medalContainer: {
    paddingRight: 45,
    paddingLeft: 20,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  bold: {fontWeight: 'bold'},
  italic: {fontStyle: 'italic'},
  underline: {textDecorationLine: 'underline'}
});