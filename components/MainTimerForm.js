import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import getFormattedDate from '../utils/getFormattedDate'
import SwitchSelector from "react-native-switch-selector";

export default class MainTimerForm extends React.Component {
   constructor(props) {
     super(props);
     const { id, title, date, aylus } = props;
     this.state = {
       title: id ? title : '',
       date: id ? date : '',
       aylus: id ? aylus : true,
       show: false,
       mode: 'date',
       displayFormat: 'DD/MM/YYYY',
       label: 'Date',
       value: '',
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
     const { title, date, aylus } = this.state;
     onFormSubmit({
       id,
       title,
       aylus,
       date,
     });
   }
   renderSubmitButton() {
    const { id } = this.props;
    if (id){
      return(
        <View style={styles.updateButton}>
          <TouchableOpacity
            style={{ backgroundColor: "transparent", padding:10, justifyContent:'center', alignItems:'center', borderRadius:3, borderColor:'#21BA45', borderWidth:2}}
            onPress={this.handleSubmit}
          >
          <Text style={{fontSize:20, color:'#21BA45'}}>{id ? 'Update' : 'Create'}</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={styles.createButton}>
        <TouchableOpacity
          style={{ backgroundColor: "transparent", padding:10, justifyContent:'center', alignItems:'center', borderRadius:3, borderColor:'#21BA45', borderWidth:2}}
          onPress={this.handleSubmit}
        >
          <Text style={{fontSize:20, color:'#21BA45'}}>{id ? 'Update' : 'Create'}</Text>
        </TouchableOpacity>
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
    const { id } = this.props;
    const { title, aylus } = this.state;
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
          <Text style={styles.textInputTitle}>Date</Text>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: "transparent", padding:10, justifyContent:'center', alignItems:'center', borderRadius:3, marginBottom:10, borderColor:'crimson', borderWidth:2}}
          onPress={this.showDateTimePicker}
          >
          <Text style={{fontSize:20, color:'crimson'}}>Pick Date (default is today)</Text>
        </TouchableOpacity>
        <Text style={styles.textInputTitle}>Event</Text>
        <View style={{borderWidth:2, borderColor:'dodgerblue', borderRadius:3, height:47, marginTop:5}}>
          <SwitchSelector
            initial={aylus ? 0:1}
            onPress={value => this.setState({ aylus: value })}
            textColor={"dodgerblue"} //'#7a44cf'
            selectedColor={"white"}
            buttonColor={"dodgerblue"}
            borderColor={"dodgerblue"}
            fontSize={17}
            style={{marginTop:0}}
            borderRadius={3}
            borderWidth={0}
            height={43}
            hasPadding
            options={[
              { label: "AYLUS", value: true }, //images.feminino = require('./path_to/assets/img/feminino.png')
              { label: "Not AYLUS", value: false } //images.masculino = require('./path_to/assets/img/masculino.png')
            ]}
          />
        </View>
        {this.renderDatePicker()}
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
    borderWidth: 2,
    marginBottom: 5,
    marginTop: 4,
    height: 50,
  },
  textInput: {
    color: 'black',
    height: 45,
    padding: 5,
    fontSize: 25,
  },
  textInputTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 2,
    color: 'black',
  },
  createButton: {
    marginTop: 10,
    minWidth: 100,
    height: 50,
    width: '100%',
    position: 'absolute',
    bottom:84,
    left:"4%",
  },
  updateButton: {
    marginTop: 10,
    width: '100%',
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
