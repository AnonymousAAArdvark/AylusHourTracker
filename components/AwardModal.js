import React, { Component } from "react";
import { Alert, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, Button, TextInput, AsyncStorage} from "react-native";
import Modal from 'react-native-modal';
import ProfileSelector from './ProfileSelector'

const saveSelect = async (bronze, silver, gold) => {
  try {
    const goldString = JSON.stringify(gold);
    const silverString = JSON.stringify(silver);
    const bronzeString = JSON.stringify(bronze);
    await AsyncStorage.setItem('@savedGold', goldString);
    await AsyncStorage.setItem('@savedBronze', bronzeString);
    await AsyncStorage.setItem('@savedSilver', silverString);
  } catch (error) {
    console.error(error)
  }
};

export default class AwardModal extends React.Component {
  state = {
    modalVisible: false,
    awardGold:150,
    awardSilver:100,
    awardBronze:50,
    valueGold:0,
    valueSilver:0,
    valueBronze:0,
    profileOption: 0,
    prevOption: -12,
    customDisabled: true,
    prevProfile: -12,
};
  async componentDidMount() {
    try {
      const goldString = await AsyncStorage.getItem('@savedGold');
      const bronzeString = await AsyncStorage.getItem('@savedBronze');
      const silverString = await AsyncStorage.getItem('@savedSilver');
      if (bronzeString !== null){
        // AsyncStorage.getAllKeys()
        //   .then(keys => AsyncStorage.multiRemove(keys))
        //   .then(() => alert('success'));
        let caughtBronze = JSON.parse(bronzeString);
        this.setState({
          awardBronze: caughtBronze
        })
      }
      if (silverString !== null){
        let caughtSilver = JSON.parse(silverString);
        this.setState({
          awardSilver: caughtSilver
        })
      }
      if (goldString !== null){
        let caughtGold = JSON.parse(goldString);
        this.setState({
          awardGold: caughtGold
        })
      }
    } catch (error) {
      console.error(error)
    }

    if (this.props.getGoldHours) {
        this.props.getGoldHours(this.goldHours(this.state.awardGold));
    }
    if (this.props.getSilverHours) {
        this.props.getSilverHours(this.bronzeHours(this.state.awardSilver));
    }
    if (this.props.getBronzeHours) {
        this.props.getBronzeHours(this.silverHours(this.state.awardBronze));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
        if (this.props.getGoldHours) {
            this.props.getGoldHours(this.goldHours(this.state.awardGold));
        }
        if (this.props.getSilverHours) {
            this.props.getSilverHours(this.silverHours(this.state.awardSilver));
        }
        if (this.props.getBronzeHours) {
            this.props.getBronzeHours(this.bronzeHours(this.state.awardBronze));
        }
        if (prevState.awardGold !== this.state.awardGold) {
          this.handleUpdate()      
        }
        if (prevState.awardSilver !== this.state.awardSilver) {
          this.handleUpdate()      
        }
        if (prevState.awardBronze !== this.state.awardBronze) {
          this.handleUpdate()      
        }
        if (prevState.profileOption !== this.state.profileOption) {
          this.profilePicker()
        }
    }
  }
  handleUpdate = () => {
    const { awardBronze, awardGold, awardSilver } = this.state;
    saveSelect(awardBronze, awardSilver, awardGold)
  }
  goldHours(goldHours) {
    //Check for condition and return value
    return goldHours;
  }
  silverHours(silverHours) {
    //Check for condition and return value
    return silverHours;
  }
  bronzeHours(bronzeHours) {
    //Check for condition and return value
    return bronzeHours;
  }
  setProfileOption(setProfile){
    const {prevProfile} = this.state
    if(prevProfile != setProfile || prevProfile == -12){
      this.state.prevProfile = setProfile
      this.setState({
        profileOption: setProfile,
      })
    }
  }
  setModalVisible = (visible) => {
    const {awardGold, awardBronze, awardSilver} = this.state
    this.setState({ 
        modalVisible: visible,
        valueGold: awardGold,
        valueSilver: awardSilver,
        valueBronze: awardBronze,
    });
  }
  setModalNotVisible = () => {
    const {valueGold, valueBronze, valueSilver} = this.state
    this.setState({ 
        modalVisible: false,
        awardGold: valueGold,
        awardBronze: valueBronze,
        awardSilver: valueSilver,
         });
  }
  setModalCancel = () => {
    this.setState({ 
        modalVisible: false,
         });
  }
  onChanged(text, medal){
    let newText = '';
    let numbers = '0123456789';
    for (var i=0; i < text.length; i++) {
        if(numbers.indexOf(text[i]) > -1 ) {
            newText = newText + text[i];
        }
        else {
            alert("please enter numbers only");
            console.log(newText)
        }
    }
    this.setState({ 
      [medal]: newText,
    });
  }
  profilePicker = () => {
    const {profileOption, prevOption} = this.state
    this.state.prevOption = profileOption
        if(profileOption == 1){
            this.setState({ 
                awardGold: 75,
                awardBronze: 26,
                awardSilver: 50,
                customDisabled: true
            });
        }
        else if(profileOption == 2){
            this.setState({ 
                awardGold: 100,
                awardBronze: 50,
                awardSilver: 75,
                customDisabled: true
            });
        }
        else if(profileOption == 3){
            this.setState({ 
                awardGold: 250,
                awardBronze: 100,
                awardSilver: 175,
                customDisabled: true

            });
        }   
        else if(profileOption == 4){
            this.setState({ 
                awardGold: 500,
                awardBronze: 100,
                awardSilver: 250,
                customDisabled: true
            });
        } 
        else if(profileOption == 5){
            this.setState({ 
                awardGold: 1000,
                awardBronze: 200,
                awardSilver: 500,
                customDisabled: true
            });
        } 
        else if(profileOption == 6){
            this.setState({ 
                customDisabled: false
            });
        } 
  }
  renderEdit = () => {
    if(this.state.customDisabled == false){
        return(
            <TouchableOpacity
              style={{ borderRadius:5, borderColor: "crimson", padding:10, borderWidth:5, marginLeft:10}}
              onPress={() => { this.setModalVisible(true);}}
              >
              <Text style={{color: "crimson", fontSize: 18, fontWeight:'800', textAlign: "center"}}>Edit</Text>
            </TouchableOpacity>
        )
    }
    else{
        return null
    }
  }
  render() {
    return (
      <View>
        <View style={styles.centeredView}>
            <View style={styles.buttonGroup}>
                <ProfileSelector getOptionKey={ getKey => this.setProfileOption(getKey)} />
                {this.renderEdit()}
            </View>
            <Modal
                isVisible={this.state.modalVisible}
                animationType="slide"
                avoidKeyboard={true}
                hasBackdrop={true}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.modalView}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleStyle}>Custom Profile</Text>
                    </View>
                    <Text style={styles.awardText}>Bronze Hours Requirement</Text>
                    <View style={styles.textInputContainer}>
                    <TextInput 
                        style={styles.textInput}
                        defaultValue={this.state.awardBronze + ''}
                        keyboardType='number-pad'
                        onChangeText={(text)=> this.onChanged(text, 'valueBronze')}
                        maxLength={10}  //setting limit of input
                    />
                    </View>
                    <Text style={styles.awardText}>Silver Hours Requirement</Text>
                    <View style={styles.textInputContainer}>
                    <TextInput 
                        style={styles.textInput}
                        defaultValue={this.state.awardSilver + ''}
                        keyboardType='number-pad'
                        onChangeText={(text)=> this.onChanged(text, 'valueSilver')}
                        maxLength={10}  //setting limit of input
                    />
                    </View>
                    <Text style={styles.awardText}>Gold Hours Requirement</Text>
                    <View style={styles.textInputContainer}>
                    <TextInput 
                        style={styles.textInput}
                        defaultValue={this.state.awardGold + ''}
                        keyboardType='number-pad'
                        onChangeText={(text)=> this.onChanged(text, 'valueGold')}
                        maxLength={10}  //setting limit of input
                    />
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={{ ...styles.openButton, borderColor: "crimson"}}
                            onPress={this.setModalCancel}
                            >
                            <Text style={{...styles.textStyle, color:'crimson'}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.openButton, borderColor: "#00ab00", }}
                            onPress={this.setModalNotVisible}
                            >
                            <Text style={{...styles.textStyle, color:'#00ab00'}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputContainer: {
    borderColor: 'darkgrey',
    borderRadius: 2,
    borderWidth: 2,
    marginBottom: 5,
    marginTop: 4,
    height: 45,
    width: '100%',
  },
  textInput: {
    color: 'black',
    height: 40,
    textAlign: 'center',
    padding: 5,
    fontSize: 20,
  },
  modalView: {
    margin: 5,
    backgroundColor: "#e6e6e6",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
  },
  openButton: {
    borderRadius: 4,
    justifyContent: 'center',
    elevation: 2,
    marginLeft: 0,
    width: 100,
    borderWidth:4,
  },
  textStyle: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: "center"
  },
  titleContainer: {
    flex: 0,
    flexDirection: 'row',
    paddingBottom: 7,
  },
  buttonRow: {
    width: '100%',
    height: 50,
    paddingTop: 10,
    justifyContent: "space-between",
    flexDirection: 'row',
  },
  titleStyle: {
    width: '100%',
    color: "black",
    fontWeight: "bold",
    textAlign: "left",
    textDecorationLine: 'underline',
    fontSize: 25,
  },
  awardText: {
    color: "black",
    textAlign: "center",
    fontSize: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between'
  },
});
