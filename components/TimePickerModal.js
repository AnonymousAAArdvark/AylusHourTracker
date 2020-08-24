import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableHighlight, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import TimerButton from './TimerButton';
import getFormattedDate from '../utils/getFormattedDate'
import TimePicker from 'react-native-simple-time-picker';
import '../utils/global'
import Modal from 'react-native-modal';

export default class TimePickerModal extends React.Component {
    state = {
        showDuration: false,
        selectedHours: 0,
        selectedMinutes: 0,
    }
    showDurationPicker = () => {
        // alert('showDateTimePicker');
        this.setState({ showDuration: true });
    }
    setModalVisible = (visible) => {
        this.setState({ 
            showDuration: visible,
        });
      }
      setModalNotVisible = () => {
        this.setState({ 
            showDuration: false,
             });
      }
      setModalCancel = () => {
        this.setState({ 
            showDuration: false,
             });
      }
    renderDurationPicker() {
        const {showDuration, selectedHours, selectedMinutes} = this.state
        selectHours = selectedHours
        selectMinutes = selectedMinutes
        if (showDuration){
         return(
           <View >
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
    render(){
        return(
            <View>
                <View style={[styles.button, { borderColor: 'black' }]}>
                    <Button title="Pick Time Duration" color="black" onPress={this.showDurationPicker} />
                </View>
                <View style={styles.centeredView}>
                    <Modal
                        isVisible={this.state.showDuration}
                        animationType="slide"
                        style={{ justifyContent: 'flex-end' }}
                        avoidKeyboard={true}
                        backdropOpacity={.5}
                        onBackdropPress={this.setModalCancel}
                        animationOutTiming={500}
                        hasBackdrop={true}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                        }}
                    >
                        <View style={styles.modalView}>
                            <View style={styles.headerView}>
                                <Text style={{...styles.textStyle, color:'grey', fontWeight:'normal'}}>Pick a Time Duration</Text>
                            </View>
                            {this.renderDurationPicker()}
                            <TouchableHighlight
                                underlayColor="#d4d4d4" 
                                style={{ ...styles.openButton, backgroundColor: "#eeeeee", borderTopWidth:.5, borderColor:'#aeaeae', width:'100%', height:55, borderTopLeftRadius: 0, borderTopRightRadius: 0}}
                                onPress={this.setModalNotVisible}
                                >
                                <Text style={{...styles.textStyle, color: "#147EFB", fontWeight:'normal', }}>Confirm</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.cancelView}>
                            <TouchableHighlight
                                underlayColor="#d4d4d4" 
                                style={{ ...styles.openButton, backgroundColor: "#eeeeee", width:'100%', height:55}}
                                onPress={this.setModalCancel}
                                >
                                <Text style={{...styles.textStyle, color:'#147EFB'}}>Cancel</Text>
                            </TouchableHighlight>
                        </View>
                    </Modal>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    textStyle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
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
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      openButton: {
        borderRadius: 10,
        justifyContent: 'center',
        elevation: 2,
        marginLeft: 0,
        width: 100,
      },
      modalView: {
        margin: -8,
        backgroundColor: "#eeeeee",
        borderRadius: 10,
        padding: 0,
        marginBottom: 18,
        alignItems: "center",
      },
      cancelView: {
        margin: -8,
        backgroundColor: "#eeeeee",
        borderRadius: 10,
        padding: 0,
        alignItems: "center",
      },
      headerView: {
        borderBottomWidth:.5, 
        borderColor:'#aeaeae', 
        width:'100%', 
        height:50, 
        borderBottomLeftRadius: 0, 
        borderBottomRightRadius: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
      },
      buttonRow: {
        width: '100%',
        height: 50,
        paddingTop: 10,
        justifyContent: "space-between",
        flexDirection: 'row',
      },
})