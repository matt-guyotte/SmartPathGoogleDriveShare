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
      type: '',
      name: '',
      description: '', 
      subjectAdd: '',
      gradeAdd: '',
    };
    this.addSubject = this.addSubject.bind(this);
    this.createNew = this.createNew.bind(this);
    this.handleChangeId = this.handleChangeId.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeSubject = this.handleChangeSubject.bind(this);
    this.handleChangeGrade = this.handleChangeGrade.bind(this);

  }

  addSubject() {
    fetch('/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        id: this.state.id,
        subject: this.state.subject
      })
    })
  }

  createNew() {
    fetch('/makenew', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        type: this.state.type,
        name: this.state.name,
        description: this.state.description,
        subject: this.state.subjectAdd,
        grade: this.state.gradeAdd,
      })
    })
  }

  handleChangeId(event) {
    this.setState({
      id: event.target.value
    })
  }

  handleChangeType(event) {
    this.setState({
      type: event.target.value
    })
  }

  handleChangeName(event) {
    this.setState({
      name: event.target.value
    })
  }

  handleChangeDescription(event) {
    this.setState({
      description: event.target.value
    })
  }

  handleChangeSubject(event) {
    this.setState({
      subjectAdd: event.target.value
    })
  }

  handleChangeGrade(event) {
    this.setState({
      gradeAdd: event.target.value
    })
  }

  render() {
    return (
    <div className = "admin-page whole">
     <Button className = 'btn btn-primary' onClick = {this.props.moveToUpdateFolder}> Return to Home </Button>
        <h3> Update Lesson </h3>
          <Form onSubmit = {this.addSubject}>
          <h4> Search for lesson to Change </h4>
          <Form.Control input = "true" name = "email" value= {this.state.id || ''} placeholder="Enter file/folder id" onChange = {this.handleChangeId} required />
          <h4> Name of updated subject </h4>
          <Form.Control input = "true" name = "email" value= {this.state.subject || ''} placeholder="Enter subject" onChange = {this.handleChangeSubject} required />
          <Button className = "btn btn-primary" type = "submit">Submit </Button>
          </Form>

        <h3> Add Lesson </h3>
          <Form onSubmit = {this.createNew}>
          <Form.Control as="select" onChange = {this.handleChangeType} value = {this.state.type || ''}>
          <option> Pick an option:</option>
          <option value = "application/vnd.google-apps.folder">Folder</option>
          <option value = "application/vnd.google-apps.document">Document</option>
          </Form.Control>
          <h4> Name* </h4>
          <Form.Control input = "true" name = "name" value= {this.state.name || ''} placeholder="Enter name" onChange = {this.handleChangeName} required />
          <h4> Description* </h4>
          <Form.Control input = "true" name = "description" value= {this.state.description || ''} placeholder="Enter description" onChange = {this.handleChangeDescription} required />
          <h4> Subject* </h4>
          <Form.Control as="select" onChange = {this.handleChangeSubject} value = {this.state.subjectAdd || ''}>
          <option> Pick a subject:</option>
          <option value = "math">Math</option>
          <option value = "science">Science</option>
          <option value = "socialStudies">Social Studies</option>
          <option value = "languageArts">Language Arts</option>
          <option value = "careers">Careers</option>
          <option value = "technology">Technology</option>
          </Form.Control>
          <h4> Grade* </h4>
          <Form.Control as="select" onChange = {this.handleChangeGrade} value = {this.state.gradeAdd || ''}>
          <option> Pick a grade:</option>
          <option value = "pre-k">Pre-K</option>
          <option value = "k">K</option>
          <option value = "1st">1st</option>
          <option value = "2nd">2nd</option>
          <option value = "3rd">3rd</option>
          <option value = "4th">4th</option>
          <option value = "5th">5th</option>
          <option value = "6th">6th</option>
          <option value = "7th">7th</option>
          <option value = "8th">8th</option>
          <option value = "9th">9th</option>
          <option value = "10th">10th</option>
          <option value = "11th">11th</option>
          <option value = "12th">12th</option>
          </Form.Control>
          <h4> Industry </h4>
          <Form.Control input = "true" name = "industry" value= "" placeholder="Enter industry" onChange = ""  />
          <Button className = "btn btn-primary" type = "submit">Submit </Button>
          </Form>
    </div>
    )
  }
}

export default UpdateFolder;
