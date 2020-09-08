import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
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
      industry: '',
      video: false,
      rubric: false,
      handout: false,
    };
    this.update = this.update.bind(this);
    this.handleChangeId = this.handleChangeId.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeSubject = this.handleChangeSubject.bind(this);
    this.handleChangeGrade = this.handleChangeGrade.bind(this);
    this.handleChangeIndustry = this.handleChangeIndustry.bind(this);
    this.handleChangeVideo = this.handleChangeVideo.bind(this);
    this.handleChangeRubric = this.handleChangeRubric.bind(this);
    this.handleChangeHandout = this.handleChangeHandout.bind(this);

  }

  update() {
    fetch('/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        id: this.state.id,
        subject: this.state.subject,
        video: this.state.video,
        rubric: this.state.rubric,
        handout: this.state.handout,
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

  handleChangeIndustry(event) {
    this.setState({
      industry: event.target.value
    })
  }

  handleChangeVideo() {
    if(this.state.video === false) {
      this.setState({
        video: true
      })
    }
    if(this.state.video === true) {
      this.setState({
        video: false
      })
    }
  }

  handleChangeRubric() {
    if(this.state.rubric === false) {
      this.setState({
        rubric: true
      })
    }
    if(this.state.rubric === true) {
      this.setState({
        rubric: false
      })
    }
  }

  handleChangeHandout() {
    if(this.state.handout === false) {
      this.setState({
        handout: true
      })
    }
    if(this.state.handout === true) {
      this.setState({
        handout: false
      })
    }
  }

  render() {
    return (
    <div className = "admin-page whole">
    <Container>
     <Button className = 'btn btn-primary' onClick = {this.props.moveToUpdateFolder}> Return to Home </Button>
        <h3> Update Lesson </h3>
          <Form onSubmit = {this.addSubject}>
          <h4> Enter Drive Folder Id of Lesson to Change </h4>
          <Form.Control input = "true" name = "email" value= {this.state.id || ''} placeholder="Enter file/folder id" onChange = {this.handleChangeId} required />
          <hr />
          <h4> Subject </h4>
          <Form.Control as="select" onChange = {this.handleChangeSubject} value = {this.state.subjectAdd || ''}>
          <option> Pick a subject:</option>
          <option value = "math">Math</option>
          <option value = "science">Science</option>
          <option value = "socialStudies">Social Studies</option>
          <option value = "languageArts">Language Arts</option>
          <option value = "careers">Careers</option>
          <option value = "technology">Technology</option>
          </Form.Control>
          <hr />
        <h4> Grade </h4>
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
          <hr />
        <h4> Industry </h4>
          <Form.Control as="select" onChange = {this.handleChangeIndustry} value = {this.state.industry || ''}>
            <option> Pick Industry: </option>
            <option value = "Agriculture, Food and Natural Resources"> Agriculture, Food and Natural Resources </option>
            <option value = "Architecture and Construction"> Architecture and Construction </option>
            <option value = "Arts, Audio/Video Technology and Communications"> Arts, Audio/Video Technology and Communications </option>
            <option value = "Business Managment and Administration"> Business Managment and Administration </option>
            <option value = "Education and Training"> Education and Training </option>
            <option value = "Finance"> Finance </option>
            <option value = "Government and Public Administration"> Government and Public Administration </option>
            <option value = "Health Science"> Health Science </option>
            <option value = "Information Technology"> Information Technology </option>
            <option value = "Law, Public Safety, Corrections and Security"> Law, Public Safety, Corrections and Security </option>
            <option value = "Manufacturing"> Manufacturing </option>
            <option value = "Marketing, Sales and Service"> Marketing, Sales and Service </option>
            <option value = "Science, Technology, Engineering and Math"> Science, Technology, Engineering and Math </option>
            <option value = "Transportation, Distribution and Logistics"> Transportation, Distribution and Logistics </option>
          </Form.Control>
        <h3> Does it contain? </h3>
          <input type = "checkbox" onClick = {this.handleChangeVideo} /> <p> Video? </p>
          <input type = "checkbox" onClick = {this.handleChangeRubric} /> <p> Rubric? </p>
          <input type = "checkbox" onClick = {this.handleChangeHandout} /> <p> Handout? </p> 
          <Button className = "btn btn-primary" type = "submit">Submit </Button>
          </Form>
        </Container>
    </div>
    )
  }
}

export default UpdateFolder;
