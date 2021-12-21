import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import TimerButton from './TimerButton';
import getFormattedDate from '../utils/getFormattedDate'
import TimePicker from 'react-native-simple-time-picker';
import '../utils/global'
export default class TimerForm extends React.Component {
   constructor(props) {
     super(props);
     const { id, title, date} = props;
     this.state = {
       title: id ? title : '',
       date: id ? date : '',
       show: false,
       mode: 'date',
       displayFormat: 'DD/MM/YYYY',
       label: 'Date',
       value: '',
       showDuration: false,
       selectedHours: 0,
       selectedMinutes: 0,
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
   renderDurationPicker() {
    const {showDuration, selectedHours, selectedMinutes} = this.state
    if (showDuration){
     return(
       <View style={styles.container}>
         <View style={styles.textGroup}>
          <Text style={styles.textDuration}>Hours</Text>
          <Text style={styles.textDuration}>:</Text>
          <Text style={styles.textDuration}>Minutes</Text>
        </View>
         <TimePicker
           selectedHours={selectedHours}
           selectedMinutes={selectedMinutes}
           onChange={(hours, minutes) => this.setState({ selectedHours: hours, selectedMinutes: minutes })}
           />
     </View>
     )
     
    }
  }
   /*handleDateChange = date => {
     this.setState({ date });
   }*/

   handleSubmit = () => {
     const { onFormSubmit , id } = this.props;
     const { title, date, elapsed, selectedHours} = this.state;
     onFormSubmit({
       id,
       title,
       date,
       selectedHours,
     });
   }
   renderDatePicker() {
    const {label, show, mode, displayFormat, value } = this.state;
     return(
      <DateTimePicker
        date={Platform.OS === 'ios' ? (value ? new Date(value) : new Date()):(value ? new Date() : new Date())}
        isVisible={show}
        mode={mode}
        onConfirm={this.handleDatePicked}
        onCancel={this.hideDateTimePicker}
      />
     )
   }

  render(){
    let { id, onFormClose} = this.props;
    const { title} = this.state;
    const submitText = id ? 'Update' : 'Create';
    const {show, mode, value, selectedHours, selectedMinutes} = this.state;
    selectHours = selectedHours
    selectMinutes = selectedMinutes
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
          <View style={[styles.button, { borderColor: 'black' }]}>
            <Button title="Pick Date" color="black" onPress={this.showDateTimePicker} />
            <DateTimePicker
              isVisible={show}
              mode={mode}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
            />
          </View>
        <View style={[styles.button, { borderColor: 'black' }]}>
          <Button title="Pick Time Duration" color="black" onPress={this.showDurationPicker} />
        </View>
        {this.renderDurationPicker()}
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
