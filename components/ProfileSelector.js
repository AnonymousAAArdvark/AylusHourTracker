import React, { Component } from "react";
import { Alert, StyleSheet, Text, TouchableHighlight, View, Button, Platform, AsyncStorage} from "react-native";
import Modal from 'react-native-modal';
import ModalSelector from 'react-native-modal-selector'

const saveSelect = async (key, label) => {
    try {
      const labelString = JSON.stringify(label);
      const keyString = JSON.stringify(key);
      await AsyncStorage.setItem('@savedLabel',labelString);
      await AsyncStorage.setItem('@savedKeySelect',keyString);
    } catch (error) {
      console.error(error)
    }
  };

export default class ProfileSelector extends React.Component {
  state = {
    selectKey: 2,
    selectLabel: 'Teens (11-15)',
  }
  async componentDidMount() {
    try {
      const labelString = await AsyncStorage.getItem('@savedLabel');
      const keyString = await AsyncStorage.getItem('@savedKeySelect');
      if (labelString !== null){
        // AsyncStorage.getAllKeys()
        //   .then(keys => AsyncStorage.multiRemove(keys))
        //   .then(() => alert('success'));
        let caughtLabel = JSON.parse(labelString);
        this.setState({
          selectLabel: caughtLabel
        })
      }
      if (keyString !== null){
        let caughtKey = JSON.parse(keyString);
        this.setState({
          selectKey: caughtKey
        })
      }
    } catch (error) {
      console.error(error)
    }
    if (this.props.getOptionKey) {
      this.props.getOptionKey(this.numOption(this.state.selectKey));
    }
  }
  componentDidUpdate(prevState) {
    if (prevState !== this.state) {
        if (this.props.getOptionKey) {
            this.props.getOptionKey(this.numOption(this.state.selectKey));
        }
        if (prevState.selectKey !== this.state.selectKey) {
            this.handleUpdate()      
        }
    }

  }
  handleUpdate = () => {
    const { selectKey, selectLabel } = this.state;
    saveSelect(selectKey, selectLabel)
  }
  numOption(numOption) {
    //Check for condition and return value
    return numOption;
  }
  handleChange(option) {
      this.setState({
          selectKey: option.key,
          selectLabel: option.label,
      })
  }
  renderSelector() {
    let index = 0;
    const {selectKey, selectLabel} = this.state
    const data = [
        { key: index++, section: true, label: 'Select Age Group' },
        { key: index++, label: 'Kids (5-10)' },
        { key: index++, label: 'Teens (11-15)' },
        { key: index++, label: 'Young Adults (16-25)' },
        { key: index++, label: 'Adults (26 and Up)' },
        { key: index++, label: 'Families & Groups' },
        { key: index++, label: 'Custom' },

    ];
    if(Platform.OS == 'ios'){
      return (
        <View>
          <ModalSelector
              data={data}
              touchableActiveOpacity={.7}
              initValue={'you selected ' + selectLabel + ''}
              initValueTextStyle={{color: "black"}}
              overlayStyle={{ justifyContent: 'flex-end', opacity:1, backgroundColor:'rgba(1,1,1,0.7)' }}
              sectionTextStyle={{color: 'grey', fontSize: 20}}
              cancelTextStyle={{color: '#147EFB', fontSize: 20, fontWeight:'bold'}}
              selectStyle={{borderColor: "black"}}
              optionTextStyle={{color: "black", fontSize: 20}}
              childrenContainerStyle={{ opacity:1}}
              optionContainerStyle={{ opacity:1, backgroundColor:'#e6e6e6', borderRadius:10 }}
              cancelStyle={{backgroundColor:'#e6e6e6', height:50, justifyContent: 'center', borderRadius:10 }}
              sectionStyle={{height:60, justifyContent: 'center'}}
              optionStyle={{height:50, justifyContent: 'center'}}
              cancelText={'Cancel'}
              closeOnChange={true}
              onChange={(option) => {this.handleChange(option)}}
          >
              <TouchableHighlight
                  underlayColor="limegreen"
                  style={{ borderRadius:5, borderColor: "#006cd6", padding:10, borderWidth:5, }}
                  >
                  <Text style={{color: "#006cd6", fontSize: 17, textShadowColor:'#b1b1b1', textShadowRadius:1, textShadowOffset:{width:1.5, height: 1.5}, fontWeight:'800', textAlign: "center"}}>Current Profile: {selectLabel}</Text>
              </TouchableHighlight>
          </ ModalSelector>
        </View>
      )
    }
    else {
      return (
        <View>
          <ModalSelector
              data={data}
              touchableActiveOpacity={.7}
              animationType={'fade'}
              initValue={'you selected ' + selectLabel + ''}
              initValueTextStyle={{color: "black"}}
              overlayStyle={{ justifyContent: 'center', opacity:1, backgroundColor:'rgba(1,1,1,0.7)' }}
              sectionTextStyle={{color: '#1177BB', fontSize: 20}}
              cancelTextStyle={{color: 'crimson', fontSize: 17, fontWeight:'bold'}}
              selectStyle={{borderColor: "black"}}
              optionTextStyle={{color: "black", fontSize: 20}}
              childrenContainerStyle={{ opacity:1}}
              optionContainerStyle={{ opacity:1, margin:'5%', backgroundColor:'white', borderRadius:3, borderBottomLeftRadius:0, borderBottomRightRadius:0 }}
              cancelStyle={{backgroundColor:'white', margin:'5%', marginTop:-10, height:50, borderRadius:3, justifyContent: 'center', borderColor:'lightgrey', borderTopWidth:1, borderTopRightRadius:0, borderTopLeftRadius:0 }}
              sectionStyle={{height:60, justifyContent: 'center'}}
              optionStyle={{height:50, justifyContent: 'center'}}
              cancelText={'CANCEL'}
              closeOnChange={true}
              onChange={(option) => {this.handleChange(option)}}
          >
              <TouchableHighlight
                  underlayColor="limegreen"
                  style={{ borderRadius:5, borderColor: "#006cd6", padding:10, borderWidth:5, }}
                  >
                  <Text style={{color: "#006cd6", fontSize: 17, textShadowColor:'#b1b1b1', textShadowRadius:1, textShadowOffset:{width:1.5, height: 1.5}, fontWeight:'800', textAlign: "center"}}>Current Profile: {selectLabel}</Text>
              </TouchableHighlight>
          </ ModalSelector>
        </View>
      )
    }
  }
  render() {
    return (
        <View style={styles.selectorContainer}>
            {this.renderSelector()}
        </View>
    )
  }
}
const styles = StyleSheet.create({
    selectorContainer: {
        flex:1, 
    },
    openButton: {
      backgroundColor: "crimson",
      borderRadius: 5,
      padding: 10,
    },
    textStyle: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center"
    },
})
