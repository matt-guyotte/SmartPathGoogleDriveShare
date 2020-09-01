import React, { Component } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Link from 'react-router-dom/Link';


class UpdateFolder extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      id: '',
      subject: '', 
      grade: '',
    };
    this.addSubject = this.addSubject.bind(this);
    this.handleChangeId = this.handleChangeId.bind(this);
    this.handleChangeSubject = this.handleChangeSubject.bind(this);
  }

  addSubject() {
    fetch('/adddomain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        id: this.state.id,
        subject: this.state.subject
      })
    })
  }

  handleChangeId(event) {
    this.setState({
      id: event.target.value
    })
  }

  handleChangeSubject(event) {
    this.setState({
      subject: event.target.value
    })
  }
  render() {
    return (
    <div className = "admin-page">
     <Button className = 'btn btn-primary' onClick = {this.props.moveToUpdateFolder}> Return to Home </Button>
        <h3> Update Lesson </h3>
            <Form onSubmit = {this.addSubject}>
            <h4> Search for lesson to Change </h4>
            <Form.Control input = "true" name = "email" value= {this.state.id || ''} placeholder="Enter file/folder id" onChange = {this.handleChangeId} required />
            <h4> Name of updated subject </h4>
            <Form.Control input = "true" name = "email" value= {this.state.subject || ''} placeholder="Enter subject" onChange = {this.handleChangeSubject} required />
            <Button className = "btn btn-primary" type = "submit">Submit </Button>
            </Form>
    </div>
    )
  }
}

export default UpdateFolder;
