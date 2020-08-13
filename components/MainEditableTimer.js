import React from 'react';

import MainTimerForm from './MainTimerForm';
import MainTimer from './MainTimer';


export default class MainEditableTimer extends React.Component{
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
    const { id, title, date, elapsed, isRunning, onRemovePress, onStartPress, onStopPress, onSavePress } = this.props;
    const { editFormOpen } = this.state;

    if (editFormOpen){
      return <MainTimerForm id={id} title={title} date={date} onFormSubmit={this.handleSubmit} onFormClose={this.handleFormClose}/>;
    } else {
      return (
        <MainTimer
          id={id}
          title={title}
          date={date}
          elapsed={elapsed}
          isRunning={isRunning}
          onEditPress={this.handleEditPress}
          onRemovePress={onRemovePress}
          onStartPress={onStopPress}
          onStopPress={onStopPress}
          onSavePress={onSavePress}
        />
      );
    }
  }
}
