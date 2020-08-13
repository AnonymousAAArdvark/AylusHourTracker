import React from 'react';

import TimerForm from './TimerForm';
import CompactTimer from './CompactTimer';


export default class CompactEditableTimer extends React.Component{
  state = {
    editFormOpen: false
  }

  handleEditPress = () => {
    this.openForm()
  }

  handleFormClose = () => {
    this.closeForm();
  }

  handleSubmit = timer => {
    const { onFormSubmit } = this.props;

    onFormSubmit(timer);
    this.closeForm();
  }

  closeForm = () => {
    this.setState({ editFormOpen: false })
  }

  openForm = () => {
    this.setState({ editFormOpen: true })
  }

  render(){
    const { id, title, date, elapsed, isRunning, onRemovePress, selectedHours, onStopPress} = this.props;
    const { editFormOpen } = this.state;
    if (editFormOpen){
      return <TimerForm id={id} title={title} date={date} elapsed={elapsed} onFormSubmit={this.handleSubmit} onFormClose={this.handleFormClose}/>;
    } else {
      return (
        <CompactTimer
          id={id}
          title={title}
          date={date}
          elapsed={elapsed}
          isRunning={isRunning}
          onEditPress={this.handleEditPress}
          onRemovePress={onRemovePress}
        />
      );
    }
  }
}
