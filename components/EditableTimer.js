import React from 'react';
import TimerForm from './TimerForm';
import Timer from './Timer';
import {millisecondsToHours, millisecondsToMinutes} from '../utils/TimerUtils';
import '../utils/global'

export default class EditableTimer extends React.Component{
  state = {
    editFormOpen: false,
    update: true,
    editID: "",
    shouldEdit: true,
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
    editForm = false
  }

  openForm = () => {
    this.setState({ editFormOpen: true })
    editForm = true
    console.log("open edit form")

  }
  render(){
    const { id, title, date, aylus, elapsed, isRunning, onRemovePress, selectedHours, onStopPress} = this.props;
    const { editFormOpen, update } = this.state;
    this.state.editID = id
    if (editFormOpen){
      if (update == true){
        prevHours = millisecondsToHours(elapsed)
        prevMinutes = millisecondsToMinutes(elapsed)
        this.state.update = false;
      }
      return <TimerForm id={id} title={title} date={date} aylus={aylus} elapsed={elapsed} onFormSubmit={this.handleSubmit} onFormClose={this.handleFormClose}/>;
    }
    else {
      selectHours = prevHours
      selectMinutes = prevMinutes
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
        />
      );
    }
  }
}
