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
      type: '',
      name: '',
      description: '', 
      subject: "",
      grade: "",
      industry: "",
      subjectArray: [],
      gradeArray: [],
      industryArray: [],
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

  }

  update() {
    fetch('/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        id: this.state.id,
        subject: this.state.subjectArray,
        grade: this.state.gradeArray,
        industry: this.state.industryArray,
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
    var subjectArrayVar = [];
    this.setState({subject: event.target.value})

    if(event.target.value === 'math') {
        subjectArrayVar.push('Math');
        this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar]})
    }
    if(event.target.value === 'science') {
          subjectArrayVar.push('Science');
          this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar]})
    }
    if(event.target.value === 'socialStudies') {
          subjectArrayVar.push('Social Studies');
          this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar]})
    }
    if(event.target.value === 'languageArts') {
          subjectArrayVar.push('Language Arts');
          this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar]})
    }
    if(event.target.value === 'careers') {
          subjectArrayVar.push('Careers');
          this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar]})
    }
    if(event.target.value === 'technology') {
          subjectArrayVar.push('Technology');
          this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar]})
    }
    console.log(this.state.subjectArray)
}

handleChangeGrade(event) {
  this.setState({grade: event.target.value});
  var gradeArrayVar = [];

  if(event.target.value === 'pre-k') {
    gradeArrayVar.push('Pre-K');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'k') {
    gradeArrayVar.push('K');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'first') {
    gradeArrayVar.push('1st');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'second') {
    gradeArrayVar.push('2nd');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'third') {
    gradeArrayVar.push('3rd');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'fourth') {
    gradeArrayVar.push('4th');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'fifth') {
    gradeArrayVar.push('5th');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'sixth') {
    gradeArrayVar.push('6th');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'seventh') {
    gradeArrayVar.push('7th');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'eighth') {
    gradeArrayVar.push('8th');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'ninth') {
    gradeArrayVar.push('9th');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'tenth') {
    gradeArrayVar.push('10th');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'eleventh') {
    gradeArrayVar.push('11th');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
  if(event.target.value === 'twelveth') {
    gradeArrayVar.push('12th');
    this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
  }
}

handleChangeIndustry(event) {
  this.setState({industry: event.target.value})
  var industryArrayVar = [];

  if(event.target.value === "Agriculture, Food and Natural Resources") {
    industryArrayVar.push("Agriculture, Food and Natural Resources");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Architecture and Construction") {
    industryArrayVar.push("Architecture and Construction");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Arts, Audio/Video Technology and Communications") {
    industryArrayVar.push("Arts, Audio/Video Technology and Communications");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Business Management and Administration") {
    industryArrayVar.push("Business Management and Administration");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Education and Training") {
    industryArrayVar.push("Education and Training");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Finance") {
    industryArrayVar.push("Finance");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Government and Public Administration") {
    industryArrayVar.push("Government and Public Administration");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Health Science") {
    industryArrayVar.push("Health Science");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Hospitality and Tourism") {
    industryArrayVar.push("Hospitality and Tourism");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Human Services") {
    industryArrayVar.push("Human Services");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Information Technology") {
    industryArrayVar.push("Human Services");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Law, Public Safety, Corrections and Security") {
    industryArrayVar.push("Law, Public Safety, Corrections and Security");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Manufacturing") {
    industryArrayVar.push("Manufacturing");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Marketing, Sales and Service") {
    industryArrayVar.push("Marketing, Sales and Service");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Science, Technology, Engineering and Math") {
    industryArrayVar.push("Science, Technology, Engineering and Math");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
  }
  if(event.target.value === "Transportation, Distribution and Logistics") {
    industryArrayVar.push("Transportation, Distribution and Logistics");
    this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
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
          <h4> Description* </h4>
          <Form.Control input = "true" name = "description" value= {this.state.description || ''} placeholder="Enter description" onChange = {this.handleChangeDescription}/>
          <h4> Subject </h4>
          <Form.Control as="select" onChange = {this.handleChangeSubject} value = {this.state.subject || ''} multiple>
            <option value = "math">Math</option>
            <option value = "science">Science</option>
            <option value = "socialStudies">Social Studies</option>
            <option value = "languageArts">Language Arts</option>
            <option value = "careers">Careers</option>
            <option value = "technology">Technology</option>
          </Form.Control>
          {this.state.subjectArray.map(subject => (
            <div key = {subject}>
                <ul>
                    <li> {subject} </li>
                </ul>
            </div>))}
          <hr />
        <h4> Grade </h4>
          <Form.Control as="select" onChange = {this.handleChangeGrade} value = {this.state.grade || ''} multiple>
          <option value = "pre-k">Pre-K</option>
          <option value = "k">K</option>
          <option value = "first">1st</option>
          <option value = "second">2nd</option>
          <option value = "third">3rd</option>
          <option value = "fourth">4th</option>
          <option value = "fifth">5th</option>
          <option value = "sixth">6th</option>
          <option value = "seventh">7th</option>
          <option value = "eighth">8th</option>
          <option value = "ninth">9th</option>
          <option value = "tenth">10th</option>
          <option value = "eleventh">11th</option>
          <option value = "twelveth">12th</option>
          </Form.Control>
          {this.state.gradeArray.map(grades => (
            <div key = {grades}>
                <ul>
                    <li> {grades} </li>
                </ul>
            </div>))}
          <hr />
        <h4> Industry </h4>
          <Form.Control as="select" onChange = {this.handleChangeIndustry} value = {this.state.industry || ''} multiple>
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
          <Button className = "btn btn-primary" type = "submit">Submit </Button>
          </Form>

        <h3> Add Image </h3>
          <form action="/profile" enctype="multipart/form-data" method="POST"> 
          <h3> Enter Id of Drive Folder/File </h3>
            <input type = "text" name = "fileId" />
          <h3> Upload picture </h3>
            <input type="file" name="myFile" accept="image/png, image/jpeg" />
            <input type="submit" value="Upload Photo"/>
          </form>
        </Container>
    </div>
    )
  }
}

export default UpdateFolder;
