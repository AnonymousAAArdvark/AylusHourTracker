import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import EditableTimer from './EditableTimer';
import { newEventTimer, processDate } from '../utils/TimerUtils';
import { MaterialIcons } from '@expo/vector-icons'; 
import TimerButton from './TimerButton';
import humanToMiliseconds from '../utils/TimerUtils';
import { ConfirmDialog } from 'react-native-simple-dialogs';

export default class DateSection extends React.Component {
    state = {
        isOpen: false,
        sectionTimers: [],
    }
    toggleOpen = () => {
        const { fullTimers } = this.props
        this.setState(prevState => ({
            isOpen: !prevState.isOpen,
            sectionTimers: fullTimers,
          }));
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState !== this.state) {
            if (this.props.getTimers) {
                this.props.getTimers(this.currTimers(this.state.sectionTimers));
            }
        }
    }
    handleRemovePress = timerId => {
        const {fullTimers} = this.props
        this.setState({
          sectionTimers: fullTimers.filter(t => t.id !== timerId)
        })
    }
    handleFormSubmit = attrs => {
        const { fullTimers } = this.props;
        this.setState({
          sectionTimers: fullTimers.map(timer => {
            if (timer.id === attrs.id) {
              const { title, date, elapsed, aylus, } = attrs;
              return {
                ...timer,
                title,
                date,
                aylus,
                elapsed,
              }
            } else {
              return timer
            }
          })
        })
      }
    renderEditableTimers(){ 
        const {isCompact, timers} = this.props
        const {isOpen} = this.state
        if (isOpen) {
            return(
                timers.map(({ title, date, aylus, id, elapsed, isRunning}) => (
                    <EditableTimer
                    key={ id }
                    id={id}
                    title={title}
                    date={date}
                    aylus={aylus}
                    elapsed={elapsed}
                    isRunning={isRunning}
                    onFormSubmit={this.handleFormSubmit}
                    onRemovePress={this.handleRemovePress}
                    isCompact={isCompact}
                    />
                ))
            );
        }
        else {
            return null
        }
    }
    currTimers(timers) {
        return timers
    }
    render() {
        const {date} = this.props
        const { isOpen } = this.state
        return (
            <View>
                <View style={styles.sectionContainer}>
                    <TouchableOpacity style={isOpen ? {...styles.dateButton, backgroundColor:'#dbdbdb'}:{...styles.dateButton}} activeOpacity={.4} onPress={this.toggleOpen}>
                        <View style={styles.info}>
                            <Text style={isOpen ? {...styles.date, fontWeight:'600'}:{...styles.date}} >{processDate(date)}</Text>
                            <Text style={isOpen ? {...styles.date, fontWeight:'600', transform: [{ rotate: '90deg'}],}:{...styles.date}} >{'>'}</Text>
                        </View>
                    </TouchableOpacity> 
                </View>
                {this.renderEditableTimers()}
            </View>
        )
      }
}
const styles = StyleSheet.create({
    sectionContainer: {
        width: '100%',
        height: 60,
        borderRadius: 10,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        marginBottom: 5,
        borderColor: '#d6d7da',
        alignItems: 'center',

    },
    dateButton: {
        width: '100%',
        height: 60,
        borderRadius: 7,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#d6d7da',
        justifyContent: 'center',
        
    },
    info: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    date: {
        color: 'black',
        fontSize: 21,
        fontWeight: '400',
        //transform: [{ rotate: '90deg'}],
    },
})