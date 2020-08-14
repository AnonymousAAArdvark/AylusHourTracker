import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  AsyncStorage,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
const data = [
  {
    title: 'Hour Tracker',
    text: 'Track hours spent on volunteering events,\n and save them for future reference.',
    image: require('../assets/images/one.png'),
    bg: 'firebrick',
  },
  {
    title: 'Events Summary',
    text: 'Create, edit, and remove saved events.\n Toggle bottom right button for compact or loose view.',
    image: require('../assets/images/two.png'),
    bg: 'lightslategrey',
  },
  {
    title: 'Calculate PVSA Awards',
    text: 'Determine total hours worked, current award earned, and hours needed for the next reward.',
    image: require('../assets/images/three.png'),
    bg: '#b80f30',
  },
];

type Item = typeof data[0];

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "flex-start",
    paddingBottom: 96, // Add padding to offset large buttons and pagination in bottom of page
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  image: {
    //width: '100%',
    resizeMode: 'contain',
    height: '60%',
    marginTop: 15,
    marginBottom: 10,

  },
  title: {
    marginTop: 20,
    fontSize: 35,
    color: 'white',
    textAlign: 'center',
  },
  tutorialScreen: {
    position: "absolute",
    left: 0,
    height: '100%',
    width: '100%',
    bottom: 0,
    zIndex: 9999,
    flex: 1,
  },
});

export default class Tutorial extends React.Component {
  state = {
    showRealApp: false
  }  
  componentDidMount() {
    this.getShowApp()
    console.log(this.state.showRealApp)
  }
  _renderItem = ({item}: {item: Item}) => {

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.bg,
        }}>
        <SafeAreaView style={styles.slide}>
          <Text style={styles.title}>{item.title}</Text>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.text}>{item.text}</Text>
        </SafeAreaView>
      </View>
    );
  };
  async componentDidUpdate(prevState) {

    if (prevState.showRealApp !== this.state.showRealApp) {
      try {
        await AsyncStorage.setItem('@showRealApp',JSON.stringify(this.state.showRealApp));
        console.log(this.state.showRealApp)
      } catch (error) {
        console.error(error)
      }     
    }
  }
  _onDone = async () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({ showRealApp: true });
  }
  getShowApp = async () => {
    const showAppString = await AsyncStorage.getItem('@showRealApp');
    if (showAppString !== null){
      // AsyncStorage.getAllKeys()
      //   .then(keys => AsyncStorage.multiRemove(keys))
      //   .then(() => alert('success'));
      let caughtAppString = JSON.parse(showAppString);
      this.setState({
        showRealApp: caughtAppString
      })
    }
  }
  _keyExtractor = (item: Item) => item.title;
  render() {
    if (this.state.showRealApp) {
      return null;
    } else {
      return(
        <View style={[styles.tutorialScreen]}>
          <StatusBar translucent backgroundColor="transparent" />
          <AppIntroSlider
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            data={data}
            onDone={this._onDone}
          />
      </View>
      )
    }
  }
}
