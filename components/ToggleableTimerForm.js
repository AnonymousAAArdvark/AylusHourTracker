import React from 'react';
import { StyleSheet, View } from 'react-native';
import TimerButton from './TimerButton';
import TimerForm from './TimerForm';
import '../utils/global'

export default class ToggleableTimerForm extends React.Component {
  state = {
    isOpen: false
  }

  handleFormOpen = () => {
    this.setState({ isOpen: true })
    editForm = true
  }

  handleFormClose = () => {
    this.setState({ isOpen: false })
    editForm = false
  }

  handleFormSubmit = timer => {
    const { onFormSubmit } = this.props;
    onFormSubmit(timer);
    this.setState({ isOpen: false })
    editForm = false
  }

  render(){
    const { isOpen } = this.state
    if (!editForm) {
      return (
        <View style={[styles.container, !isOpen && styles.buttonPadding]}>
          { isOpen ? <TimerForm onFormSubmit={this.handleFormSubmit} onFormClose={this.handleFormClose}/> : <TimerButton title="+" color="black" onPress={this.handleFormOpen}/> }
        </View>
      )
    }
    else {
      return (
        <View style={[styles.container, !isOpen && styles.buttonPadding]}>
          { isOpen ? <TimerForm onFormSubmit={this.handleFormSubmit} onFormClose={this.handleFormClose}/> : <TimerButton title="+" color="lightgrey" onPress={null} opacity={1} /> }
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  buttonPadding: {
    paddingHorizontal: 15
  },
});
