import React from 'react';
import TimerForm from './TimerForm';
import Timer from './Timer';
import {millisecondsToHours, millisecondsToMinutes} from '../utils/TimerUtils';

export default class EditableTimer extends React.Component{
  state = {
    editFormOpen: false,
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
    console.log("open edit form")
  }
  render(){
    const { id, title, date, aylus, elapsed, isRunning, onRemovePress, isCompact} = this.props;
    const { editFormOpen } = this.state;
    if (editFormOpen){
      return <TimerForm id={id} title={title} date={date} aylus={aylus} elapsed={elapsed} onFormSubmit={this.handleSubmit} onFormClose={this.handleFormClose}/>;
    }
    else {
      return (
        <Timer
          id={id}
          title={title}
          date={date}
          aylus={aylus} 
          elapsed={elapsed}
          isRunning={isRunning}
          onEditPress={this.handleEditPress}
          onRemovePress={onRemovePress}
          compact={isCompact}
        />
      );
    }
  }
}
