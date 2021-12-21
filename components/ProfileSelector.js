import React, { Component } from "react";
import { Alert, StyleSheet, Text, TouchableHighlight, View, Button, TextInput, AsyncStorage} from "react-native";
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

  render() {
    let index = 0;
    const {selectKey, selectLabel} = this.state
    const data = [
        { key: index++, section: true, label: 'Select Age Group' },
        { key: index++, label: 'Kids (5-10)' },
        { key: index++, label: 'Teens (11-15)' },
        { key: index++, label: 'Young Adults (16-25)' },
        { key: index++, label: 'Adults (26 and Older)' },
        { key: index++, label: 'Families and Groups' },
        { key: index++, label: 'Custom' },

    ];
    return (
        <View style={styles.selectorContainer}>
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
                    style={{ ...styles.openButton, backgroundColor: "#3b3b3b", }}
                    >
                    <Text style={styles.textStyle}>Current Profile: {selectLabel}</Text>
                </TouchableHighlight>
            </ ModalSelector>
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
      borderRadius: 10,
      padding: 10,
      elevation: 2,
    },
    textStyle: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center"
    },
})
