import React from 'react';
import { StyleSheet, View } from 'react-native';

import TimerButton from './TimerButton';
import MainTimerForm from './MainTimerForm';

export default class MainToggleableTimerForm extends React.Component {
  state = {
    isOpen: true
  }

  handleFormOpen = () => {
    this.setState({ isOpen: true })
  }

  handleFormSubmit = timer => {
    const { onFormSubmit } = this.props;
    onFormSubmit(timer);
    this.setState({ isOpen: false })
  }

  render(){
    const { isOpen } = this.state
    return (
      <View style={[styles.container, !isOpen && styles.buttonPadding]}>
        { isOpen ? <MainTimerForm onFormSubmit={this.handleFormSubmit} /> : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingBottom: 0,
  },
  buttonPadding: {
    paddingHorizontal: 15
  },
});
