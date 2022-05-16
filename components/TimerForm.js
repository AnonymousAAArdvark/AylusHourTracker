import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableHighlight, TouchableOpacity } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import TimerButton from './TimerButton';
import TimePickerModal from './TimePickerModal';
import getFormattedDate from '../utils/getFormattedDate'
import SwitchSelector from "react-native-switch-selector";
import TimePicker from 'react-native-simple-time-picker';

export default class TimerForm extends React.Component {
   constructor(props) {
     super(props);
     const { id, title, date, aylus, elapsed } = props;
     this.state = {
       title: id ? title : '',
       date: id ? date : '',
       aylus: id ? aylus : true,
       elapsed: id ? elapsed : 0,
       show: false,
       mode: 'date',
       displayFormat: 'DD/MM/YYYY',
       label: 'Date',
       value: '',
       showDuration: false,
     }
   }
   showDateTimePicker = () => {
    // alert('showDateTimePicker');
    this.setState({ show: true });
   }
   hideDateTimePicker = () => {
    this.setState({ show: false });
   }
   showDurationPicker = () => {
    // alert('showDateTimePicker');
    this.setState({ showDuration: true });
   }
   handleDatePicked = value => {
    this.hideDateTimePicker();
    this.setState({ value:value });
    this.setState({ date: getFormattedDate(value)})
   }
   handleTitleChange = title => {
     this.setState({ title });
   }

   setElapsed(getElapsed){
    this.setState({
      elapsed: getElapsed
    })
  }

   handleSubmit = () => {
     const { onFormSubmit , id } = this.props;
     const { title, date, aylus, elapsed } = this.state;
     onFormSubmit({
       id,
       title,
       date,
       aylus,
       elapsed,
     });
   }
   renderDatePicker() {
    const {label, show, mode, displayFormat, value } = this.state;
     return(
      <DateTimePicker
        date={Platform.OS === 'ios' ? (value ? new Date(value) : new Date()):(value ? new Date() : new Date())}
        isVisible={show}
        display={"spinner"}
        mode={mode}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
      />
     )
   }

  render(){
    let { id, onFormClose} = this.props;
    const { title, aylus, elapsed } = this.state;
    const submitText = id ? 'Update' : 'Create';
    const {show, mode } = this.state;
    return(
      <View style={styles.formContainer}>
        <View style={styles.attributeContainer}>
          <Text style={styles.textInputTitle}>Title</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              underlineColorAndroid="transparent"
              value={ title }
              onChangeText={this.handleTitleChange}
            />
          </View>
        </View>
          <TouchableOpacity
            style={{ backgroundColor: "transparent", padding:8, alignItems:'center', borderRadius:3, marginBottom:10, borderColor:'black', borderWidth:2}}
            onPress={this.showDateTimePicker}
            >
            <Text style={{fontSize:20, color:'black'}}>Pick Date</Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={show}
            mode={mode}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
          />
          <TimePickerModal elapsed={elapsed} getElapsed={elapsedTime => this.setElapsed(elapsedTime)}/>
        <View style={{borderWidth:2, borderColor:'black', borderRadius:3, height:44, marginTop:10}}>
          <SwitchSelector
            initial={aylus ? 0:1}
            onPress={value => this.setState({ aylus: value })}
            textColor={"black"} //'#7a44cf'
            selectedColor={"white"}
            buttonColor={"black"}
            borderColor={"black"}
            fontSize={17}
            style={{marginTop:0}}
            borderRadius={3}
            borderWidth={0}
            height={40}
            hasPadding
            options={[
              { label: "AYLUS", value: true }, //images.feminino = require('./path_to/assets/img/feminino.png')
              { label: "Not AYLUS", value: false } //images.masculino = require('./path_to/assets/img/masculino.png')
            ]}
          />
        </View>
        <View style={styles.buttonGroup}>
          <TimerButton small color="#21BA45" title={submitText} onPress={this.handleSubmit}/>
          <TimerButton small color="#DB2828" title="Cancel" onPress={onFormClose}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'white',
    borderColor: '#D6D7DA',
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 0,
  },
  attributeContainer: {
    marginVertical: 8,
  },
  textInputContainer: {
    borderColor: '#D6D7DA',
    borderRadius: 2,
    borderWidth: 1,
    marginBottom: 5,
  },
  textInput: {
    color: 'black',
    height: 40,
    padding: 5,
    fontSize: 20,
  },
  textInputTitle: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    marginBottom: 10,
    width: '100%',
    minWidth: 100,
    borderWidth: 2,
    borderRadius: 3,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'stretch',
    width: '100%',
  },
  textDuration: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
  }
})
