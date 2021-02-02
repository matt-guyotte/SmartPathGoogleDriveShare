import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Link from 'react-router-dom/Link';

import AdminNavbar from './adminNavbar';
import Footer from './Footer';


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
      contains1: '',
      contains2: '',
      contains3: '',
      subjectArray: [],
      gradeArray: [],
      industryArray: [],
      video: false,
      rubric: false,
      handout: false,
      visible: true,

      // Search Terms

                // Subjects
                math: false,
                science: false,
                socialStudies: false,
                languageArts: false,
                careers: false,
                technology: false,

                // Grades 
                preK: false,
                K: false, 
                first: false,
                second: false,
                third: false,
                fourth: false,
                fifth: false,
                sixth: false, 
                seventh: false,
                eighth: false,
                ninth: false,
                tenth: false,
                eleventh: false,
                twelveth: false,

                // Industry
                agriculture: false,
                architecture: false,
                arts: false,
                businessManagement: false,
                educationTraining: false,
                finance: false,
                governmentPublic: false,
                healthScience: false,
                hospitality: false,
                humanServices: false,
                informationTechnology: false,
                lawSafety: false,
                manufacturing: false,
                marketingSales: false,
                sTEM: false,
                transportation: false,
    };
    this.update = this.update.bind(this);
    this.handleChangeId = this.handleChangeId.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeSubject = this.handleChangeSubject.bind(this);
    this.handleChangeGrade = this.handleChangeGrade.bind(this);
    this.handleChangeIndustry = this.handleChangeIndustry.bind(this);
    this.removeTagSubject = this.removeTagSubject.bind(this);
    this.removeTagGrade = this.removeTagGrade.bind(this);
    this.removeTagIndustry = this.removeTagIndustry.bind(this);

  }

  async update() {
    await fetch('/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        id: this.state.id,
        description: this.state.description,
        subject: this.state.subjectArray,
        grade: this.state.gradeArray,
        industry: this.state.industryArray,
      })
    })
    this.setState({
      subjectArray: [],
      gradeArray: [],
      industryArray: [], 
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

  handleChangeContains1(event) {
    this.setState({
      contains1: event.target.value
    })
  }

  handleChangeContains2(event) {
    this.setState({
      contains2: event.target.value
    })
  }

  handleChangeContains3(event) {
    this.setState({
      contains3: event.target.value
    })
  }

  handleChangeSubject(event) {
    var subjectArrayVar = [];
    this.setState({subject: event.target.value})

    if(event.target.value === 'math') {
        if (this.state.math === false) {
          this.setState({math: true})
          subjectArrayVar.push('Math');
          for (var i = 0; i < subjectArrayVar.length; i++) {
            this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar[i]]})
          }
        }
        if (this.state.math === true) {
          this.setState({math: false})
          subjectArrayVar = subjectArrayVar.filter(e => e !== 'Math');
        }
        console.log(this.state.subjectArray)
    }
    if(event.target.value === 'science') {
        if (this.state.science === false) {
          this.setState({science: true})
          subjectArrayVar.push('Science');
          for (var i = 0; i < subjectArrayVar.length; i++) {
            this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar[i]]})
          }
        }
        if (this.state.science === true) {
          this.setState({science: false})
          subjectArrayVar = subjectArrayVar.filter(e => e !== 'Science');
        }
        console.log(this.state.subjectArray)
    }
    if(event.target.value === 'socialStudies') {
        if (this.state.socialStudies === false) {
          this.setState({socialStudies: true})
          subjectArrayVar.push('Social Studies');
          for (var i = 0; i < subjectArrayVar.length; i++) {
            this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar[i]]})
          }
        }
        if (this.state.socialStudies === true) {
          this.setState({socialStudies: false})
          subjectArrayVar = subjectArrayVar.filter(e => e !== 'Social Studies');
        }
    }
    if(event.target.value === 'languageArts') {
        if (this.state.languageArts === false) {
          this.setState({languageArts: true})
          subjectArrayVar.push('Language Arts');
          for (var i = 0; i < subjectArrayVar.length; i++) {
            this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar[i]]})
          }
        }
        if (this.state.languageArts === true) {
          this.setState({languageArts: false})
          subjectArrayVar = subjectArrayVar.filter(e => e !== 'Language Arts');
        }
    }
    if(event.target.value === 'careers') {
        if (this.state.careers === false) {
          this.setState({careers: true})
          subjectArrayVar.push('Careers');
          for (var i = 0; i < subjectArrayVar.length; i++) {
            this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar[i]]})
          }
        }
        if (this.state.careers === true) {
          this.setState({careers: false})
          subjectArrayVar = subjectArrayVar.filter(e => e !== 'Careers');
        }
    }
    if(event.target.value === 'technology') {
        if (this.state.technology === false) {
          this.setState({technology: true})
          subjectArrayVar.push('Technology');
          for (var i = 0; i < subjectArrayVar.length; i++) {
            this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar[i]]})
          }
        }
        if (this.state.technology === true) {
          this.setState({technology: false})
          subjectArrayVar = subjectArrayVar.filter(e => e !== 'Technology');
        }
    }
    this.setState({visible: true})
    console.log(this.state.subjectArray)
  }

  handleChangeGrade(event) {
    this.setState({grade: event.target.value});
    var gradeArrayVar = [];
    if(event.target.value === 'pre-k') {
        if (this.state.preK === false) {
          this.setState({preK: true})
          gradeArrayVar.push('Pre-K');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.preK === true) {
          this.setState({preK: false})
        }
    }
    if(event.target.value === 'k') {
        if (this.state.K === false) {
          this.setState({K: true})
          gradeArrayVar.push('K');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.K === true) {
          this.setState({K: false})
        }
    }
    if(event.target.value === 'first') {
        if (this.state.first === false) {
          this.setState({first: true})
          gradeArrayVar.push('1st');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.first === true) {
          this.setState({first: false})
        }
    }
    if(event.target.value === 'second') {
        if (this.state.second === false) {
          this.setState({second: true})
          gradeArrayVar.push('2nd');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.second === true) {
          this.setState({second: false})
        }
    }
    if(event.target.value === 'third') {
        if (this.state.third === false) {
          this.setState({third: true})
          gradeArrayVar.push('3rd');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.third === true) {
          this.setState({third: false})
        }
    }
    if(event.target.value === 'fourth') {
        if (this.state.fourth === false) {
          this.setState({fourth: true})
          gradeArrayVar.push('4th');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.fourth === true) {
          this.setState({fourth: false})
        }
    }
    if(event.target.value === 'fifth') {
        if (this.state.fifth === false) {
          this.setState({fifth: true})
          gradeArrayVar.push('5th');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.fifth === true) {
          this.setState({fifth: false})
        }
    }
    if(event.target.value === 'sixth') {
        if (this.state.sixth === false) {
          this.setState({sixth: true})
          gradeArrayVar.push('6th');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.sixth === true) {
          this.setState({sixth: false})
        }
    }
    if(event.target.value === 'seventh') {
        if (this.state.seventh === false) {
          this.setState({seventh: true})
          gradeArrayVar.push('7th');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.seventh === true) {
          this.setState({seventh: false})
        }
    }
    if(event.target.value === 'eighth') {
        if (this.state.eighth === false) {
          this.setState({eighth: true})
          gradeArrayVar.push('8th');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.eighth === true) {
          this.setState({eighth: false})
        }
    }
    if(event.target.value === 'ninth') {
        if (this.state.ninth === false) {
          this.setState({ninth: true})
          gradeArrayVar.push('9th');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.ninth === true) {
          this.setState({ninth: false})
        }
    }
    if(event.target.value === 'tenth') {
        if (this.state.tenth === false) {
          this.setState({tenth: true})
          gradeArrayVar.push('10th');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.tenth === true) {
          this.setState({tenth: false})
        }
    }
    if(event.target.value === 'eleventh') {
        if (this.state.eleventh === false) {
          this.setState({eleventh: true})
          gradeArrayVar.push('11th');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.eleventh === true) {
          this.setState({eleventh: false})
        }
    }
    if(event.target.value === 'twelveth') {
        if (this.state.twelveth === false) {
          this.setState({twelveth: true})
          gradeArrayVar.push('12th');
          for (var i = 0; i < gradeArrayVar.length; i++) {
            this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar[i]]})
          }
        }
        if (this.state.twelveth === true) {
          this.setState({twelveth: false})
        }
    }
    this.setState({visible: true})
}

handleChangeIndustry(event) {
  this.setState({industry: event.target.value})
  var industryArrayVar = [];
  if(event.target.value === "Agriculture, Food and Natural Resources") {
      if (this.state.agriculture === false) {
        this.setState({agriculture: true})
        industryArrayVar.push("Agriculture, Food and Natural Resources");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.agriculture === true) {
        this.setState({agriculture: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Agriculture, Food and Natural Resources');
      }
  }
  if(event.target.value === "Architecture and Construction") {
      if (this.state.architecture === false) {
        this.setState({architecture: true})
        industryArrayVar.push("Architecture and Construction");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.architecture === true) {
        this.setState({architecture: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Architecture and Construction');
      }
  }
  if(event.target.value === "Arts, Audio/Video Technology and Communications") {
      if (this.state.arts === false) {
        this.setState({arts: true})
        industryArrayVar.push("Arts, Audio/Video Technology and Communications");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.arts === true) {
        this.setState({arts: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Arts, Audio/Video Technology and Communications');
      }
  }
  if(event.target.value === "Business Management and Administration") {
      if (this.state.businessManagement === false) {
        this.setState({businessManagement: true})
        industryArrayVar.push("Business Management and Administration");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.businessManagement === true) {
        this.setState({businessManagement: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Business Management and Administration');
      }
  }
  if(event.target.value === "Education and Training") {
      if (this.state.educationTraining === false) {
        this.setState({educationTraining: true})
        industryArrayVar.push("Education and Training");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.educationTraining === true) {
        this.setState({educationTraining: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Education and Training');
      }
  }
  if(event.target.value === "Finance") {
      if (this.state.finance === false) {
        this.setState({finance: true})
        industryArrayVar.push("Finance");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.finance === true) {
        this.setState({finance: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Finance');
      }
  }
  if(event.target.value === "Government and Public Administration") {
      if (this.state.governmentPublic === false) {
        this.setState({governmentPublic: true})
        industryArrayVar.push("Government and Public Administration");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.governmentPublic === true) {
        this.setState({governmentPublic: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Government and Public Administration');
      }
  }
  if(event.target.value === "Health Science") {
      if (this.state.healthScience === false) {
        this.setState({healthScience: true})
        industryArrayVar.push("Health Science");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.healthScience === true) {
        this.setState({healthScience: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Health Science');
      }
  }
  if(event.target.value === "Hospitality and Tourism") {
      if (this.state.hospitality === false) {
        this.setState({hospitality: true})
        industryArrayVar.push("Hospitality and Tourism");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.hospitality === true) {
        this.setState({hospitality: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Hospitality and Tourism');
      }
  }
  if(event.target.value === "Human Services") {
      if (this.state.humanServices === false) {
        this.setState({humanServices: true})
        industryArrayVar.push("Human Services");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.humanServices === true) {
        this.setState({humanServices: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Human Services');
      }
  }
  if(event.target.value === "Information Technology") {
      if (this.state.informationTechnology === false) {
        this.setState({informationTechnology: true})
        industryArrayVar.push("Information Technology");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.informationTechnology === true) {
        this.setState({informationTechnology: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Information Technology');
      }
  }
  if(event.target.value === "Law, Public Safety, Corrections and Security") {
      if (this.state.lawSafety === false) {
        this.setState({lawSafety: true})
        industryArrayVar.push("Law, Public Safety, Corrections and Security");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.lawSafety === true) {
        this.setState({lawSafety: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Law, Public Safety, Corrections and Security');
      }
  }
  if(event.target.value === "Manufacturing") {
      if (this.state.manufacturing === false) {
        this.setState({manufacturing: true})
        industryArrayVar.push("Manufacturing");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.manufacturing === true) {
        this.setState({manufacturing: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Manufacturing');
      }
  }
  if(event.target.value === "Marketing, Sales and Service") {
      if (this.state.marketingSales === false) {
        this.setState({marketingSales: true})
        industryArrayVar.push("Marketing, Sales and Service");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.marketingSales === true) {
        this.setState({marketingSales: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Marketing, Sales and Service');
      }
  }
  if(event.target.value === "Science, Technology, Engineering and Math") {
      if (this.state.sTEM === false) {
        this.setState({sTEM: true})
        industryArrayVar.push("Science, Technology, Engineering and Math");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.sTEM === true) {
        this.setState({sTEM: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Science, Technology, Engineering and Math');
      }
  }
  if(event.target.value === "Transportation, Distribution and Logistics") {
      if (this.state.transportation === false) {
        this.setState({transportation: true})
        industryArrayVar.push("Transportation, Distribution and Logistics");
        for (var i = 0; i < industryArrayVar.length; i++) {
          this.setState({industryArray: [...this.state.industryArray, industryArrayVar[i]]})
        }
      }
      if (this.state.transportation === true) {
        this.setState({transportation: false})
        industryArrayVar = industryArrayVar.filter(e => e !== 'Transportation, Distribution and Logistics');
      }
  }
  this.setState({visible: true})
}

removeTagSubject(event) {
  const subject = event.target.value;
  const array = this.state.subjectArray;
  for (var i = 0; i < array.length; i++) {
    if(array[i] === subject) {
      array.splice(i, 1);
      this.setState({subjectArray: array})
    }
  }
  this.setState({visible: false})
}

removeTagGrade(event) {
  const grade = event.target.value;
  const array = this.state.gradeArray;
  for (var i = 0; i < array.length; i++) {
    if(array[i] === grade) {
      array.splice(i, 1);
      this.setState({gradeArray: array})
    }
  }
  this.setState({visible: false})
}

removeTagIndustry(event) {
  const industry = event.target.value;
  const array = this.state.industryArray;
  for (var i = 0; i < array.length; i++) {
    if(array[i] === industry) {
      array.splice(i, 1);
      this.setState({industryArray: array})
    }
  }
  this.setState({visible: false})
}

  render() {
    let buttonClass = this.state.visible ? "visibleYes" : "visibleNo";
    return (
    <div>
      <div className = "whole"> </div>
        <Container>
          <div className = "page">
          <Button className = 'btn btn-primary' onClick = {this.props.moveToUpdateFolder}> Return to Home </Button>
          <hr />
          <h2> Update Lesson </h2>
          <br />
            <Form onSubmit = {this.update}>
            <h4> Enter Drive Folder Id of Lesson to Change* </h4>
            <Form.Control input = "true" name = "email" value= {this.state.id || ''} placeholder="Enter file/folder id" onChange = {this.handleChangeId} required />
            <br />
            <h4> Description </h4>
            <Form.Control as="textarea" name = "description" value= {this.state.description || ''} placeholder="Enter description" onChange = {this.handleChangeDescription}/>
            <hr />
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
              <Button className = {buttonClass} value = {subject} onClick = {this.removeTagSubject}>
                {subject}
              </Button>))}
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
                <Button className = {buttonClass} value = {grades} onClick = {this.removeTagGrade}>
                {grades}
              </Button>))}
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
            {this.state.industryArray.map(industry => (
                <Button className = {buttonClass} value = {industry} onClick = {this.removeTagIndustry}>
                {industry}
              </Button>))}
            <hr />
            <br />
            <h4> What does it contain? (add three) </h4>
            <br />
            <Form.Control input = "true" name = "contains" value= {this.state.contains1 || ''} placeholder="Enter first file" onChange = {this.handleChangeContains1.bind(this)} />
            <br />
            <Form.Control input = "true" name = "contains" value= {this.state.contains2 || ''} placeholder="Enter second file" onChange = {this.handleChangeContains2.bind(this)} />
            <br/>
            <Form.Control input = "true" name = "contains" value= {this.state.contains3 || ''} placeholder="Enter third file" onChange = {this.handleChangeContains3.bind(this)} />
            <br />
            <Button className = "btn btn-primary" type = "submit">Submit </Button>
            </Form>

            <hr />

          <h3> Add Image </h3>
            <form action="/profile" enctype="multipart/form-data" method="POST"> 
            <p> Enter Id of Drive Folder/File </p>
              <input type = "text" name = "fileId" />
            <p> Upload picture </p>
              <input type="file" name="myFile" accept="image/png, image/jpeg" />
              <input type="submit" value="Upload Photo"/>
            </form>
          </div>
        </Container>
        <Footer />
    </div>
    )
  }
}

export default UpdateFolder;
