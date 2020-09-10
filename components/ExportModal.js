import React, { Component } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View, Platform, TextInput, AsyncStorage} from "react-native";
import TimerButton from '../components/TimerButton';
import Modal from 'react-native-modal';
import exportXlsx from '../components/ExportXlsx';
import filenamify from 'filenamify'
import slugify from '@sindresorhus/slugify'

export default class ExportModal extends React.Component {
    state = {
        isOpen: false,
        name: '',
        branch: '',
        fileName: '',
    }
    modalOpen = () => {
        this.setState({
            isOpen: true,
        })
    }
    modalClose = () => {
        this.setState({
            isOpen: false,
        })
    }
    handleNameChange = name => {
        this.setState({ name });
    }
    handleBranchChange = branch => {
        this.setState({ branch });
    }
    handleFileNameChange = fileName => {
        this.setState({ fileName });
    }
    async share(data) {
        const {name, branch, fileName} = this.state
        exportXlsx(data, fileName === '' ? 'volunteer_service_form':(filenamify(slugify(fileName))), name, branch)
    }
    render() {
        const {data} = this.props
        return(
            <View>
                <View style={styles.buttonPadding}>
                    <TimerButton title="Export as Excel File" color="#00ab57" onPress={this.modalOpen}/>
                </View>
                <View style={styles.centeredView}>
                    <Modal
                        isVisible={this.state.isOpen}
                        animationType="slide"
                        hasBackdrop={true}
                        onBackdropPress={this.modalClose}
                        animationOutTiming={500}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                        }}
                        >
                        <View style={styles.modalView}>
                            <View style={styles.headerView}>
                                <Text style={{...styles.textStyle, color:'black', fontWeight:'normal', fontSize:20,}}>Export Events into Excel</Text>
                            </View>
                            <View style={styles.textInputStyle}>
                                <Text style={styles.textStyle}>Enter your name:</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                            <TextInput 
                                style={styles.textInput}
                                defaultValue={''}
                                onChangeText={this.handleNameChange}
                                maxLength={20}  //setting limit of input
                            />
                            </View>
                            <View style={styles.textInputStyle}>
                                <Text style={styles.textStyle}>Enter your AYLUS branch:</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                            <TextInput 
                                style={styles.textInput}
                                defaultValue={''}
                                onChangeText={this.handleBranchChange}
                                maxLength={20}  //setting limit of input
                            />
                            </View>
                            <View style={styles.textInputStyle}>
                                <Text style={styles.textStyle}>Enter the file name you want saved:</Text>
                            </View>
                            <View style={styles.textInputContainer}>
                            <TextInput 
                                style={styles.textInput}
                                defaultValue={''}
                                onChangeText={this.handleFileNameChange}
                                maxLength={30}  //setting limit of input
                            />
                            </View>
                            <Text style={styles.TextComponentStyle}>
                                <Text style={{fontWeight:'bold'}}>Warning: </Text>
                                <Text>
                                    exporting to Excel does not guarantee 100% accuracy. 
                                    Please review the xlsx file and make any changes 
                                    if necessary before submitting.
                                </Text>
                            </Text>
                            <TouchableOpacity
                                style={{ ...styles.openButton, borderColor: "#00ab00", }}
                                onPress={() => this.share(data)}
                                >
                                <Text style={{...styles.textStyle, color:'#00ab00'}}>Export and download xlsx file</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ ...styles.openButton, borderColor: "crimson"}}
                                onPress={this.modalClose}
                                >
                                <Text style={{...styles.textStyle, color:'crimson'}}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    TextComponentStyle: {
        width: '100%',
        borderRadius: 5,
        textAlign: 'left',
        borderWidth: 2,
        borderColor: 'red',
        paddingLeft: Platform.OS === 'ios' ? 5:10,
        paddingTop: Platform.OS === 'ios' ? 2:10,
        paddingBottom: Platform.OS === 'ios' ? 2:10,
        paddingRight: Platform.OS === 'ios' ? 0:4,
        color: 'red',
        fontSize: 15,
        margin: 0,
        marginTop: 5,
        marginBottom: 5,
    },
    buttonPadding: {
        paddingTop: 5,
        paddingHorizontal: 15,
        paddingBottom: 0,
    },
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
        textAlign: 'left',
        padding: 5,
        fontSize: 20,
    },
    modalView: {
        margin: 0,
        backgroundColor: "#eeeeee",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
    },
    openButton: {
        borderRadius: 3,
        justifyContent: 'space-between',
        alignItems:'center',
        marginLeft: 0,
        width: '100%',
        borderWidth:2,
        height: 45,
        paddingTop: 10,
        marginTop: 5,
        marginBottom: 5,
    },

    buttonRow: {
        width: '100%',
        height: 50,
        paddingTop: 10,
        justifyContent: "space-between",
        flexDirection: 'row',
    },
    textStyle: {
        fontSize: 17,
        color: 'black',
        textAlign: "center",
        fontWeight: '400',
    },
    textInputStyle: {
        flex: 0,
        flexDirection: 'row',
        alignSelf: 'flex-start',
    },
    headerView: {
        borderBottomWidth:1.5, 
        borderColor:'black', 
        width:'100%', 
        height:50, 
        borderBottomLeftRadius: 0, 
        borderBottomRightRadius: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
      },
})