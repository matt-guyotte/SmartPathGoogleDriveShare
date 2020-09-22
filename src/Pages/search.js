import React from 'react'; 
import "../App.css"; 
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';
import {Form} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Link from 'react-router-dom/Link';
import Redirect from 'react-router-dom/Redirect'

import TopNavbar from './navbar';
import GoogleBtn from './GoogleBtn';
import Register from './register';
import Login from './login';

function importAll(r) {
    let images = [];
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  
const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));
console.log(images)

function loopImages() {
    for(var i = 0; i < images.length; i++) {
        console.log(images[i]);
    }
}

loopImages();

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            session: false,
            driveFiles: [],
            downloadLink: '',
            searchTerm: 'Search Here',
            searchRan: false,
            foundFolders: [],
            foundFiles: [],
            subject: '',
            grade: '',
            industry: '',
            id: '',
            fileName: '',
            exportFileType: 'docx',
            exportFolderType: 'zip',
            downloadPath: '',
            subjectArray: [],
            gradeArray: [],
            industryArray: [],
            classroomFolders: [],
            newClassroomFolders: [],
            classroomParent: '',



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
                

                
        })
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.organizeFiles = this.organizeFiles.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.handleChangeCheckFile = this.handleChangeCheckFile.bind(this);
        this.handleChangeFileType = this.handleChangeFileType.bind(this);
        this.handleChangeSetParent = this.handleChangeSetParent.bind(this);
        this.handleChangeSubject = this.handleChangeSubject.bind(this);
        this.handleChangeGrade = this.handleChangeGrade.bind(this);
        this.handleChangeIndustry = this.handleChangeIndustry.bind(this);
        this.searchFunction = this.searchFunction.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.downloadFolder = this.downloadFolder.bind(this);
        this.getFoldersClassroom = this.getFoldersClassroom.bind(this);
        this.classroomExport = this.classroomExport.bind(this); 
        this.downloadTest = this.downloadTest.bind(this);
        
    }
    

    openModal = () => this.setState({ isOpen: true });
    closeModal = () => this.setState({ isOpen: false });

    async componentDidMount() {
        fetch('/api')
        .then(res => res.json())
        .then(res => this.setState({driveFiles: res}))
        this.organizeFiles();
        await fetch('/apicall')
        .then(res => res.json())
        .then(res => this.setState({session: res}))
    }

    organizeFiles() {
        var driveFiles = this.state.driveFiles;
        for (var i = 0; i < driveFiles.length; i++) {
            for(var y = 0; y < driveFiles.length; y++) {
                if(driveFiles[i].id === driveFiles[y].parents[0]) {
                    if (!driveFiles[i].children) {
                        driveFiles[i].children = [driveFiles[y].id]
                    }
                    else {
                        driveFiles[i].children.push(driveFiles[y].id)
                    }
                }
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.folder') {
                driveFiles[i].click = 'https://drive.google.com/drive/folders/' + driveFiles[i].id;
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document') {
                driveFiles[i].click = 'https://docs.google.com/document/d/' + driveFiles[i].id;
            }
        }
        return driveFiles;
    }

    handleChangeSearch(event) {
        this.setState({
          searchTerm: event.target.value
        })
    }

    handleChangeCheckFile(event) {
        this.setState({
            id: event.target.value
        })
        this.setState({
            fileName: event.target.name
        })
    }

    handleChangeSetParent(event) {
      this.setState({
        classroomParent: event.target.value
      })
    }

    handleChangeFileType (event) {
        this.setState({
            exportFileType: event.target.value
        })
    }

    handleChangeFolderType (event) {
        this.setState({
            exportFolderType: event.target.value
        })
    }

    handleChangeSubject(event) {
        var subjectArrayVar = [];
        this.setState({subject: event.target.value})

        if(event.target.value === 'math') {
            if (this.state.math === false) {
              this.setState({math: true})
              subjectArrayVar.push('Math');
              this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar]})
            }
            if (this.state.math === true) {
              this.setState({math: false})
            }
        }
        if(event.target.value === 'science') {
            if (this.state.science === false) {
              this.setState({science: true})
              subjectArrayVar.push('Science');
              this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar]})
            }
            if (this.state.science === true) {
              this.setState({science: false})
            }
        }
        if(event.target.value === 'socialStudies') {
            if (this.state.socialStudies === false) {
              this.setState({socialStudies: true})
              subjectArrayVar.push('Social Studies');
              this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar]})
            }
            if (this.state.socialStudies === true) {
              this.setState({socialStudies: false})
            }
        }
        if(event.target.value === 'languageArts') {
            if (this.state.languageArts === false) {
              this.setState({languageArts: true})
              subjectArrayVar.push('Language Arts');
              this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar]})
            }
            if (this.state.languageArts === true) {
              this.setState({languageArts: false})
            }
        }
        if(event.target.value === 'careers') {
            if (this.state.careers === false) {
              this.setState({careers: true})
              subjectArrayVar.push('Careers');
              this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar]})
            }
            if (this.state.careers === true) {
              this.setState({careers: false})
            }
        }
        if(event.target.value === 'technology') {
            if (this.state.technology === false) {
              this.setState({technology: true})
              subjectArrayVar.push('Technology');
              this.setState({subjectArray: [...this.state.subjectArray, subjectArrayVar]})
            }
            if (this.state.technology === true) {
              this.setState({technology: false})
            }
        }
        console.log(this.state.subjectArray)
    }

    handleChangeGrade(event) {
        this.setState({grade: event.target.value});
        var gradeArrayVar = [];
        if(event.target.value === 'pre-k') {
            if (this.state.preK === false) {
              this.setState({preK: true})
              gradeArrayVar.push('Pre-K');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.preK === true) {
              this.setState({preK: false})
            }
        }
        if(event.target.value === 'k') {
            if (this.state.K === false) {
              this.setState({K: true})
              gradeArrayVar.push('K');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.K === true) {
              this.setState({K: false})
            }
        }
        if(event.target.value === 'first') {
            if (this.state.first === false) {
              this.setState({first: true})
              gradeArrayVar.push('1st');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.first === true) {
              this.setState({first: false})
            }
        }
        if(event.target.value === 'second') {
            if (this.state.second === false) {
              this.setState({second: true})
              gradeArrayVar.push('2nd');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.second === true) {
              this.setState({second: false})
            }
        }
        if(event.target.value === 'third') {
            if (this.state.third === false) {
              this.setState({third: true})
              gradeArrayVar.push('3rd');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.third === true) {
              this.setState({third: false})
            }
        }
        if(event.target.value === 'fourth') {
            if (this.state.fourth === false) {
              this.setState({fourth: true})
              gradeArrayVar.push('4th');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.fourth === true) {
              this.setState({fourth: false})
            }
        }
        if(event.target.value === 'fifth') {
            if (this.state.fifth === false) {
              this.setState({fifth: true})
              gradeArrayVar.push('5th');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.fifth === true) {
              this.setState({fifth: false})
            }
        }
        if(event.target.value === 'sixth') {
            if (this.state.sixth === false) {
              this.setState({sixth: true})
              gradeArrayVar.push('6th');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.sixth === true) {
              this.setState({sixth: false})
            }
        }
        if(event.target.value === 'seventh') {
            if (this.state.seventh === false) {
              this.setState({seventh: true})
              gradeArrayVar.push('7th');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.seventh === true) {
              this.setState({seventh: false})
            }
        }
        if(event.target.value === 'eighth') {
            if (this.state.eighth === false) {
              this.setState({eighth: true})
              gradeArrayVar.push('8th');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.eighth === true) {
              this.setState({eighth: false})
            }
        }
        if(event.target.value === 'ninth') {
            if (this.state.ninth === false) {
              this.setState({ninth: true})
              gradeArrayVar.push('9th');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.ninth === true) {
              this.setState({ninth: false})
            }
        }
        if(event.target.value === 'tenth') {
            if (this.state.tenth === false) {
              this.setState({tenth: true})
              gradeArrayVar.push('10th');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.tenth === true) {
              this.setState({tenth: false})
            }
        }
        if(event.target.value === 'eleventh') {
            if (this.state.eleventh === false) {
              this.setState({eleventh: true})
              gradeArrayVar.push('11th');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.eleventh === true) {
              this.setState({eleventh: false})
            }
        }
        if(event.target.value === 'twelveth') {
            if (this.state.twelveth === false) {
              this.setState({twelveth: true})
              gradeArrayVar.push('12th');
              this.setState({gradeArray: [...this.state.gradeArray, gradeArrayVar]})
            }
            if (this.state.twelveth === true) {
              this.setState({twelveth: false})
            }
        }
    }

    handleChangeIndustry(event) {
        this.setState({industry: event.target.value})
        var industryArrayVar = [];
        if(event.target.value === "Agriculture, Food and Natural Resources") {
            if (this.state.agriculture === false) {
              this.setState({agriculture: true})
              industryArrayVar.push("Agriculture, Food and Natural Resources");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.agriculture === true) {
              this.setState({agriculture: false})
            }
        }
        if(event.target.value === "Architecture and Construction") {
            if (this.state.architecture === false) {
              this.setState({architecture: true})
              industryArrayVar.push("Architecture and Construction");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.architecture === true) {
              this.setState({architecture: false})
            }
        }
        if(event.target.value === "Arts, Audio/Video Technology and Communications") {
            if (this.state.arts === false) {
              this.setState({arts: true})
              industryArrayVar.push("Arts, Audio/Video Technology and Communications");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.arts === true) {
              this.setState({arts: false})
            }
        }
        if(event.target.value === "Business Management and Administration") {
            if (this.state.businessManagement === false) {
              this.setState({businessManagement: true})
              industryArrayVar.push("Business Management and Administration");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.businessManagement === true) {
              this.setState({businessManagement: false})
            }
        }
        if(event.target.value === "Education and Training") {
            if (this.state.educationTraining === false) {
              this.setState({educationTraining: true})
              industryArrayVar.push("Education and Training");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.educationTraining === true) {
              this.setState({educationTraining: false})
            }
        }
        if(event.target.value === "Finance") {
            if (this.state.finance === false) {
              this.setState({finance: true})
              industryArrayVar.push("Finance");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.finance === true) {
              this.setState({finance: false})
            }
        }
        if(event.target.value === "Government and Public Administration") {
            if (this.state.governmentPublic === false) {
              this.setState({governmentPublic: true})
              industryArrayVar.push("Government and Public Administration");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.governmentPublic === true) {
              this.setState({governmentPublic: false})
            }
        }
        if(event.target.value === "Health Science") {
            if (this.state.healthScience === false) {
              this.setState({healthScience: true})
              industryArrayVar.push("Health Science");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.healthScience === true) {
              this.setState({healthScience: false})
            }
        }
        if(event.target.value === "Hospitality and Tourism") {
            if (this.state.hospitality === false) {
              this.setState({hospitality: true})
              industryArrayVar.push("Hospitality and Tourism");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.hospitality === true) {
              this.setState({hospitality: false})
            }
        }
        if(event.target.value === "Human Services") {
            if (this.state.humanServices === false) {
              this.setState({humanServices: true})
              industryArrayVar.push("Human Services");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.humanServices === true) {
              this.setState({humanServices: false})
            }
        }
        if(event.target.value === "Information Technology") {
            if (this.state.informationTechnology === false) {
              this.setState({informationTechnology: true})
              industryArrayVar.push("Human Services");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.informationTechnology === true) {
              this.setState({informationTechnology: false})
            }
        }
        if(event.target.value === "Law, Public Safety, Corrections and Security") {
            if (this.state.lawSafety === false) {
              this.setState({lawSafety: true})
              industryArrayVar.push("Law, Public Safety, Corrections and Security");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.lawSafety === true) {
              this.setState({lawSafety: false})
            }
        }
        if(event.target.value === "Manufacturing") {
            if (this.state.manufacturing === false) {
              this.setState({manufacturing: true})
              industryArrayVar.push("Manufacturing");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.manufacturing === true) {
              this.setState({manufacturing: false})
            }
        }
        if(event.target.value === "Marketing, Sales and Service") {
            if (this.state.marketingSales === false) {
              this.setState({marketingSales: true})
              industryArrayVar.push("Marketing, Sales and Service");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.marketingSales === true) {
              this.setState({marketingSales: false})
            }
        }
        if(event.target.value === "Science, Technology, Engineering and Math") {
            if (this.state.sTEM === false) {
              this.setState({sTEM: true})
              industryArrayVar.push("Science, Technology, Engineering and Math");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.sTEM === true) {
              this.setState({sTEM: false})
            }
        }
        if(event.target.value === "Transportation, Distribution and Logistics") {
            if (this.state.transportation === false) {
              this.setState({transportation: true})
              industryArrayVar.push("Transportation, Distribution and Logistics");
              this.setState({industryArray: [...this.state.industryArray, industryArrayVar]})
            }
            if (this.state.transportation === true) {
              this.setState({transportation: false})
            }
        }
    }

    downloadTest() {
        fetch('/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          }) 
    }

    downloadFile() {
        var pathStart = './downloads/'
        var newPath = pathStart.concat(this.state.fileName + '.' + this.state.exportFileType)
        this.setState({newPath : newPath})
        fetch('/downloaddocument', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              id: this.state.id,
              name: this.state.fileName,
              type: this.state.exportFileType,
            })
          }) 
    }

    downloadFolder(event) {
        event.preventDefault();
        var pathStart = './downloads/'
        var newPath = pathStart.concat(this.state.fileName + '.' + this.state.exportFolderType)
        this.setState({newPath : newPath})
        fetch('/downloadfolder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              id: this.state.id,
              name: this.state.fileName,
              type: this.state.exportFolderType,
            })
          }) 
    }

    async getFoldersClassroom() {
      await fetch('/drivecall2')
      .then(res => res.json())
      .then(res => console.log(res))
      .then(res => this.setState({classroomFolders: res}))

      var driveFilesClassroom = this.state.classroomFolders;

      for(var i = 0; i < driveFilesClassroom.length; i++) {
        if(driveFilesClassroom[i].file === "Classroom" && driveFilesClassroom[i].type === 'application/vnd.google-apps.folder') {
          var classroom = driveFilesClassroom[i].id;
          console.log(classroom)
          var newArray = [];
          for(var y = 0; y < driveFilesClassroom.length; y++) {
            if(driveFilesClassroom[y].parents[0] === classroom) {
              newArray.push(driveFilesClassroom[y]);
              this.setState({newClassroomFolders: newArray})
            }
          }
        }
      }
    }

    async classroomExport() {
      var pathStart = './downloads/'
      var newPath = pathStart.concat(this.state.fileName + '.' + this.state.exportFileType)
      this.setState({newPath : newPath})
      fetch('/downloaddocument', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            id: this.state.id,
            name: this.state.fileName,
            type: this.state.exportFileType,
            parentId: this.state.classroomParent,
          })
       }) 
    }

    

    searchFunction() {
        var searchTerm = this.state.searchTerm;
        var driveFiles = this.organizeFiles();
        console.log(driveFiles)
        this.setState({searchRan: false});
        this.setState({foundFolders: []})
        this.setState({foundFiles: []})
        var foundFiles = [];
        var foundFolders = [];
        var subjectArray = this.state.subjectArray;
        var gradeArray = this.state.gradeArray;
        var industryArray = this.state.indutryArray;
        for(var i = 0; i < driveFiles.length; i++) {

        // Plain search terms

            if(this.state.searchTerm === "Search Here" && !this.state.math && !this.state.science && !this.state.socialStudies && !this.state.languageArts && !this.state.careers && !this.state.technology
            && !this.state.preK && !this.state.K && !this.state.first && !this.state.second && !this.state.third && !this.state.fourth && !this.state.fifth && !this.state.sixth && !this.state.seventh && !this.state.eighth && !this.state.ninth && !this.state.tenth && !this.state.eleventh && !this.state.twelveth 
            && !this.state.agriculture && !this.state.architecture && !this.state.arts && !this.state.businessManagement && !this.state.educationTraining && !this.state.finance && !this.state.governmentPublic && !this.state.healthScience && !this.state.hospitality && !this.state.humanServices && !this.state.informationTechnology && !this.state.lawSafety && !this.state.manufacturing && !this.state.marketingSales && !this.state.sTEM && !this.state.transportation) {
                this.setState({foundFolders: [{file: "Please enter a valid search term."}]})
                this.setState({foundFiles: [{file: "Please enter a valid search term."}]})
                this.setState({searchRan: true})
                return console.log("searched.")
            }

            //if (driveFiles[i].file.includes(searchTerm) === true && !this.state.math && !this.state.science && !this.state.socialStudies && !this.state.languageArts && !this.state.careers && !this.state.technology
            //&& !this.state.preK && !this.state.K && !this.state.first && !this.state.second && !this.state.third && !this.state.fourth && !this.state.fifth && !this.state.sixth && !this.state.seventh && !this.state.eighth && !this.state.ninth && !this.state.tenth && !this.state.eleventh && !this.state.twelveth 
            //&& !this.state.agriculture && !this.state.architecture && !this.state.arts && !this.state.businessManagement && !this.state.educationTraining && !this.state.finance && !this.state.governmentPublic && !this.state.healthScience && !this.state.hospitality && !this.state.humanServices && !this.state.informationTechnology && !this.state.lawSafety && !this.state.manufacturing && !this.state.marketingSales && !this.state.sTEM && !this.state.transportation) {
            //    if (driveFiles[i].type === "application/vnd.google-apps.folder") {
            //        foundFolders.push(driveFiles[i])
            //        console.log(foundFolders)
            //        this.setState({foundFolders: foundFolders})
            //        this.setState({searchRan: true})
            //        return console.log("searched.")
            //    }
            //    if (driveFiles[i].type === 'application/vnd.google-apps.document') {
            //        console.log(driveFiles[i]);
            //        foundFiles.push(driveFiles[i])
            //        console.log(foundFiles)
            //        this.setState({foundFiles: foundFiles})
            //        this.setState({searchRan: true})
            //        return console.log("searched.")
            //    }
            //}

        //// Subject search terms 
        let checker = (arr, target) => target.every(v => arr.includes(v));

            if(driveFiles[i].file.includes(searchTerm) === true && checker(driveFiles[i].properties.subject, subjectArray) === true) {
                console.log("the file is found.")
                if (driveFiles[i].type === "application/vnd.google-apps.folder") {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFolders)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document') {
                    console.log(driveFiles[i]);
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }       
        }
        this.setState({searchRan: true})
    }



    //Rendered Component

    render() {
        if(this.state.session === true && this.state.searchRan === false) {
            return (
                <div>
                    <TopNavbar />
                    <Container fluid>
                        <div className = "whole">
                        <Row className = "searchPage"> 
                           <Col md = {3} className = "search-col">
                               <Row className = "searchBar">
                                   <input type = "text" value = {this.state.searchTerm || ''} onChange = {this.handleChangeSearch} />
                                </Row>
                                <Row clasName = "submitButton">
                                   <Button className = "btn btn-primary" onClick = {this.searchFunction}> Submit </Button>
                                </Row>   
                                <hr />
                                <Row className = "search-box subject-area">
                                    <h2>Subject Area</h2>
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
                                </Row>
                                <hr />
                                <Row className = "search-box grade-level">
                                    <h2> Grade Level </h2>
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
                                </Row>
                                <hr />
                                <Row className = "search-box industry">
                                    <h2> Industry </h2>
                                    <Form.Control as="select" onChange = {this.handleChangeIndustry} value = {this.state.industry || ''} multiple>
                                      <option value = "Agriculture, Food and Natural Resources"> Agriculture, Food and Natural Resources </option>
                                      <option value = "Architecture and Construction"> Architecture and Construction </option>
                                      <option value = "Arts, Audio/Video Technology and Communications"> Arts, Audio/Video Technology and Communications </option>
                                      <option value = "Business Management and Administration" > Business Managment and Administration </option>
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
                                                <div key = {industry}>
                                                    <ul>
                                                        <li> {industry} </li>
                                                    </ul>
                                                </div>))}
                                </Row>
                           </Col>
                           <Col md = {9} className = "course-col">
                               <Row className = "top-row-course-search">
                                   <h2> Search </h2>
                                   <img src = {images["Colorful-Bananas.jpg"]} />
                               </Row>
                                <br />
                                <Row className = "course-box-search">
                                   <Col>
                                   {this.state.id}
                                   {this.state.downloadLink}
                                   </Col>
                               </Row>
                           </Col>  
                        </Row>
                        </div>
                    </Container>
                </div>
            )
        }
        if(this.state.session === true && this.state.searchRan === true) {
            return (
                <div>
                   <TopNavbar />
                   <Container fluid>
                       <div className = "whole">
                        <Row className = "searchPage"> 
                           <Col md = {3} className = "search-col">
                               <Row className = "searchBar">
                                   <input type = "text" value = {this.state.searchTerm || ''} onChange = {this.handleChangeSearch} />
                                   <br />
                                   <Button className = "btn btn-primary" onClick = {this.searchFunction}> Submit </Button>
                               </Row>
                               <hr />
                               <div className = "search-options">
                                <Row className = "search-box subject-area">
                                <h2>Subject Area</h2>
                                    <Form.Control as="select" onChange = {this.handleChangeSubject} value = {this.state.subject || ''} multiple>
                                        <option value = "math">Math</option>
                                        <option value = "science">Science</option>
                                        <option value = "socialStudies">Social Studies</option>
                                        <option value = "languageArts">Language Arts</option>
                                        <option value = "careers">Careers</option>
                                        <option value = "technology">Technology</option>
                                    </Form.Control>
                                </Row>
                                <hr />
                                <Row className = "search-box grade-level">
                                    <h2> Grade Level </h2>
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
                                </Row>
                                <hr />
                                <Row className = "search-box industry">
                                    <h2> Industry </h2>
                                    <Form.Control as="select" onChange = {this.handleChangeIndustry} value = {this.state.industry || ''} multiple>
                                      <option value = "Agriculture, Food and Natural Resources"> Agriculture, Food and Natural Resources </option>
                                      <option value = "Architecture and Construction"> Architecture and Construction </option>
                                      <option value = "Arts, Audio/Video Technology and Communications"> Arts, Audio/Video Technology and Communications </option>
                                      <option value = "Business Management and Administration" > Business Managment and Administration </option>
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
                                </Row>
                                </div>
                           </Col>
                           <Col md = {9} className = "course-col">
                               <Row className = "top-row-course">
                                    <Button className = "btn-primary export-btn" onClick = {this.openModal} value = {this.state.exportFileType || ''}> Export </Button>
                               </Row>
                                <br />
                                <Row className = "course-box-search">
                                   <Col>
                                        <Row>
                                            <Col>
                                            <h2> Found Lessons </h2>
                                                {this.state.foundFolders.map(folders => (
                                                <div className = "file-box-search" key={folders}>
                                                <input type = "checkbox" name = {folders.file} value = {folders.id} onChange = {this.handleChangeCheckFile}></input><h2 className = ""> <a href = {folders.click}> {folders.file} </a> </h2>
                                                <p> {folders.description} </p>
                                                <img className = "lesson-pic" src =  {images[folders.properties.imgsrc]}></img>
                                                <Container>
                                                <Row>
                                                <p> Video - {folders.properties.video} </p>
                                                </Row>
                                                <Row>
                                                <p> Rubric - {folders.properties.rubric} </p>
                                                </Row>
                                                <Row>
                                                <p> Handouts - {folders.properties.handout}</p>
                                                </Row>
                                                <Row>
                                                <p><small>Folder id: {folders.id}</small></p>
                                                </Row>
                                                </Container>

                                                </div>))}
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col>
                                            <h2> Found Files </h2>
                                                {this.state.foundFiles.map(files => (
                                                <div className = "file-box-search" key={files}>
                                                    <input type = "checkbox" name = {files.file} value = {files.id} onChange = {this.handleChangeCheckFile}></input> <p className = ""> <a href = {files.click}> {files.file} </a> </p>
                                                    <p> {files.description}</p>
                                                    <Row>
                                                        subjects: {files.properties.subject}
                                                    </Row>
                                                    <Row>
                                                    <p><small>Doc id: {files.id}</small></p>
                                                    </Row>
                                                </div>
                                                ))}
                                            </Col>
                                        </Row>
                                   </Col>
                               </Row>
                               <Modal className = "export-modal" show={this.state.isOpen} onHide={this.closeModal}>
                                    <Modal.Header closeButton>
                                      <Modal.Title>Export</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Current File(s) selected: </Modal.Body>
                                    <Modal.Body> {this.state.fileName} </Modal.Body>
                                    <Modal.Body> {this.state.newPath} </Modal.Body>
                                    <Modal.Footer>
                                    <Modal.Body> Export To: </Modal.Body>
                                    <Modal.Footer>
                                    <select onChange = {this.handleChangeFileType} value = {this.state.exportFileType || ''}>
                                        <option value = "pdf">.pdf</option>
                                        <option value = "docx">.docx</option>
                                        <option value = "txt">.txt</option>
                                    </select>
                                    </Modal.Footer>
                                    <Modal.Body> <strong> *Please click this before downloading or exporting: </strong> </Modal.Body>
                                    <Form onSubmit = {this.downloadFile} >
                                        <Button type = "submit" className = "btn-primary export-btn"> Prep File </Button>
                                    </Form> 
                                    <Modal.Body> Export to Google Classroom: </Modal.Body>
                                    <GoogleBtn getFiles = {this.classroomExport}/> 
                                    <Button className = "btn btn-primary" onClick = {this.getFoldersClassroom}> Pick Course to Export To: </Button>
                                      {this.state.newClassroomFolders.map(folders => (
                                        <div className = "file-box-search" key={folders}>
                                          <p><strong> Pick course to export to: </strong></p>
                                        <input type = "checkbox" name = {folders.file} value = {folders.id} onChange = {this.handleChangeSetParent}></input><h2 className = ""> <a href = {folders.click}> {folders.file} </a> </h2>
                                        <p> {folders.description} </p>
                                        </div>))}
                                        <Form onSubmit = {this.classroomExport}>
                                          <Button type = "submit" className = "btn btn-primary"> Export to Classroom </Button>
                                        </Form>
                                      <Modal.Body> Local Download </Modal.Body>
                                        <a href = "http://localhost:8080/download"> <Button className = "btn-primary export-btn"> Download </Button> </a>
                                    </Modal.Footer>
                                    <Modal.Footer>
                                    </Modal.Footer>
                                    <Modal.Footer>
                                      <Button variant="secondary" onClick={this.closeModal}>
                                        Close
                                      </Button>
                                    </Modal.Footer>
                                </Modal>
                           </Col>  
                        </Row>
                        </div>
                    </Container>
                </div>
            )
        }
        else {
            return (
                <div>
                    <TopNavbar />
                    <Container>
                        <Row>
                            <h2> Welcome! </h2>
                        </Row>
                        <Row>
                            <h2> If you have just logged in, please refresh the page. </h2> 
                        </Row>
                        <Row>
                            <h2> Otherwise, please login. </h2>
                        </Row>
                        <Row>
                            <Link to = "/login"> <Button className = "btn btn-primary"> Login </Button> </Link>
                        </Row>
                    </Container>
                    
                </div>
            )
        }
    }
}

export default Search; 