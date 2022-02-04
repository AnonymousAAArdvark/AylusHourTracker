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
        saveDuration: 0,
        prevHours: 0,
        prevMinutes: 0,
    }
    showDurationPicker = () => {
        // alert('showDateTimePicker');
        this.setState({ 
            saveDuration: 0,
            showDuration: true,
        });
    }
    setModalNotVisible = () => {
        this.setState({ 
            saveDuration: 1,
            showDuration: false,
        });
    }
    setModalCancel = () => {
        this.setState({ 
            saveDuration: 0,
            showDuration: false,
        });
    }
    renderDurationPicker() {
        const {showDuration, selectedHours, selectedMinutes} = this.state
        if (showDuration){
         return(
           <View >
             <View style={styles.textGroup}>
              <Text style={styles.textDuration}>Hours</Text>
              <Text style={styles.textDuration}>:</Text>
              <Text style={styles.textDuration}>Minutes</Text>
             </View>
             <TimePicker
               selectedHours={parseInt(prevHours)}
               selectedMinutes={parseInt(prevMinutes)}
               onChange={(hours, minutes) => this.setState({ selectedHours: hours, selectedMinutes: minutes })}
               />
         </View>
         )
         
        }
      }
    renderPicker() {
        if(Platform.OS == 'ios'){
            return(
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
            )
        }
        else{
            return(
                <Modal
                    isVisible={this.state.showDuration}
                    animationIn={'fadeIn'}
                    animationInTiming={200}
                    animationOutTiming={200}
                    animationOut={'fadeOut'}
                    style={{ justifyContent: 'center' }}
                    avoidKeyboard={true}
                    backdropOpacity={.5}
                    onBackdropPress={this.setModalCancel}
                    animationOutTiming={500}
                    hasBackdrop={true}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={{...styles.modalView, margin:'8%', borderRadius:3, backgroundColor:'white'}}>
                        <View style={{...styles.headerView, backgroundColor:'#1177BB', borderRadius:3, height:70,}}>
                            <Text style={{...styles.textStyle, color:'white', fontWeight:'normal', fontSize:26, }}>Pick a Time Duration</Text>
                        </View>
                        {this.renderDurationPicker()}
                        <View style={styles.buttonRow}>
                            <TouchableHighlight
                                underlayColor="#d4d4d4" 
                                style={{ ...styles.openButton, borderRadius:5, backgroundColor: "white", width:70, height:45}}
                                onPress={this.setModalCancel}
                                >
                                <Text style={{...styles.textStyle, color:'#1E72BC', fontWeight:'normal', fontSize: 15,}}>CANCEL</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                underlayColor="#d4d4d4" 
                                style={{ ...styles.openButton, borderRadius:5, backgroundColor: "white", width:60, height:45}}
                                onPress={this.setModalNotVisible}
                                >
                                <Text style={{...styles.textStyle, color: "#2673B4", fontWeight:'normal', fontSize: 15,}}>OK</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            )
        }
    }
    render(){
        const {saveDuration, selectedHours, selectedMinutes} = this.state
        if(saveDuration == 1){
            selectHours = selectedHours
            selectMinutes = selectedMinutes
            prevHours = selectHours
            prevMinutes = selectMinutes
        }
        else if (saveDuration == 0){
            selectHours = prevHours
            selectMinutes = prevMinutes
        }
        return(
            <View>
                <TouchableOpacity
                    style={{ backgroundColor: "transparent", padding:8, alignItems:'center', borderRadius:3, borderColor:'black', borderWidth:2}}
                    onPress={this.showDurationPicker}
                    >
                    <Text style={{fontSize:20, color:'black'}}>Pick Time Duration</Text>
                </TouchableOpacity>
                <View style={styles.centeredView}>
                    {this.renderPicker()}
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
        elevation: 0,
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
        height: 55,
        paddingRight: 10,
        justifyContent: "flex-end",
        flexDirection: 'row',
      },
})