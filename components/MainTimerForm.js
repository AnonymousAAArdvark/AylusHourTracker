import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import TimerButton from './TimerButton';
import getFormattedDate from '../utils/getFormattedDate'
export default class MainTimerForm extends React.PureComponent {
   constructor(props) {
     super(props);
     const { id, title, date } = props;
     this.state = {
       title: id ? title : '',
       date: id ? date : '',
       show: false,
       mode: 'date',
       displayFormat: 'DD/MM/YYYY',
       label: 'Date',
       value: '',
       t: Date(),
     }
   }
   showDateTimePicker = () => {
    // alert('showDateTimePicker');
    this.setState({ show: true });
   }
   hideDateTimePicker = () => {
    this.setState({ show: false });
   }
   handleDatePicked = value => {
    this.hideDateTimePicker();
    this.setState({ value:value });
    this.setState({ date: getFormattedDate(value)})
   }
   handleTitleChange = title => {
     this.setState({ title });
   }
   
   handleSubmit = () => {
     const { onFormSubmit , id } = this.props;
     const { title, date } = this.state;

     onFormSubmit({
       id,
       title,
       date
     });
   }
   renderSubmitButton() {
    const { id } = this.props;
    if (id){
      return(
          <View style={[styles.updateButton, { borderColor: '#21BA45' }]}>
            <Button color="#21BA45" height='50%' title={id ? 'Update' : 'Create'} onPress={this.handleSubmit}/>
          </View>
  
      )
    }

    return (
      <View style={[styles.createButton, { borderColor: '#21BA45' }]}>
        <Button color="#21BA45" title={id ? 'Update' : 'Create'} onPress={this.handleSubmit}/>
      </View>
    )
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
    const { id, onFormClose } = this.props;
    const { title, date } = this.state;
    const submitText = id ? 'Update' : 'Create';
    const {label, show, mode, displayFormat, value } = this.state;
    return(
      <View style={styles.formContainer}>
        <View style={styles.attributeContainer}>
          <Text style={styles.textInputTitle}>Event Title</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              underlineColorAndroid="transparent"
              value={ title }
              onChangeText={this.handleTitleChange}
            />
          </View>
          <Text style={styles.textInputTitle}>Date</Text>
        </View>
        <View style={[styles.button, { borderColor: 'crimson' }]}>
            <Button title="Pick Date (default is today)" color="crimson" onPress={this.showDateTimePicker} />
            {this.renderDatePicker()}
        </View>
           {this.renderSubmitButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'white',
    borderColor: '#D6D7DA',
    borderWidth: 0,
    borderRadius: 10,
    padding: 15,
    margin: 0,
    width: '100%',
    height: '105%',
    marginBottom: 45,
    marginTop: -10,
  },
  attributeContainer: {
    marginVertical: 4,
  },
  textInputContainer: {
    borderColor: '#D6D7DA',
    borderRadius: 2,
    borderWidth: 1,
    marginBottom: 5,
    marginTop: 4,
    height: 50,
  },
  textInput: {
    height: 45,
    padding: 5,
    fontSize: 25,
  },
  textInputTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 2,
  },
  createButton: {
    marginTop: 10,
    minWidth: 100,
    height: Platform.OS === 'ios' ? 50:40,
    
    width: '100%',
    borderWidth: 2,
    borderRadius: 3,
    
    fontWeight: 'bold',
    position: 'absolute',
    bottom:84,
    left:"4%",
  },
  updateButton: {
    marginTop: 10,
    minWidth: 100,
    height: Platform.OS === 'ios' ? 50:40,
    width: '100%',
    borderWidth: 2,
    borderRadius: 3,
    fontWeight: 'bold',
    position: 'absolute',
    bottom:31,
    left:"4%",
  },
  button: {
    marginTop: 2,
    minWidth: 100,
    height: Platform.OS === 'ios' ? 50:40,
    borderWidth: 2,
    borderRadius: 3,
  },
  keyboard: {
    flex:1
  },
})
