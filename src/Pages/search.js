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
import Login from './login'

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
            exportFileType: 'pdf',
            exportFolderType: 'zip',
            downloadPath: '',

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
        this.handleChangeSubject = this.handleChangeSubject.bind(this);
        this.handleChangeGrade = this.handleChangeGrade.bind(this);
        this.handleChangeIndustry = this.handleChangeIndustry.bind(this);
        this.searchFunction = this.searchFunction.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
        this.downloadFolder = this.downloadFolder.bind(this);
        this.downloadTest = this.downloadTest.bind(this);

        //Industry State Functions 
        this.agriculture = this.agriculture.bind(this);
        this.architecture = this.architecture.bind(this);
        this.arts = this.arts.bind(this);
        this.businessManagment = this.businessManagement.bind(this);
        this.educationTraining = this.educationTraining.bind(this);
        this.finance = this.finance.bind(this);
        this.governmentPublic = this.governmentPublic.bind(this);
        this.healthScience = this.healthScience.bind(this);
        this.hospitality = this.hospitality.bind(this);
        this.humanServices = this.humanServices.bind(this);
        this.informationTechnology = this.informationTechnology.bind(this);
        this.lawSafety = this.lawSafety.bind(this);
        this.manufacturing = this.manufacturing.bind(this);
        this.marketingSales = this.marketingSales.bind(this);
        this.sTEM = this.sTEM.bind(this);
        this.transportation = this.transportation.bind(this);
        
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
        console.log(event.target.value)
        console.log(this.state.math)
        this.setState({subject: event.target.value})
        if(event.target.value === 'math') {
            this.setState({math: true})
        }
        if(event.target.value === 'science') {
            this.setState({science: true})
        }
        if(event.target.value === "socialStudies") {
            this.setState({socialStudies: true})
        }
        if(event.target.value === 'languageArts') {
            this.setState({languageArts: true})
        }
        if(event.target.value === "careers") {
            this.setState({careers: true})
        }
        if(event.target.value === 'technology') {
            this.setState({technology: true})
        }
    }

    handleChangeGrade(event) {
        this.setState({grade: event.target.value});
        if(event.target.value === "pre-k") {
            this.setState({preK: true})
        }
        if(event.target.value === "k") {
            this.setState({k: true})
        }
        if(event.target.value === "first") {
            this.setState({first: true})
        }
        if(event.target.value === "second") {
            this.setState({second: true})
        }
        if(event.target.value === "third") {
            this.setState({third: true})
        }
        if(event.target.value === "fourth") {
            this.setState({fourth: true})
        }
        if(event.target.value === "fifth") {
            this.setState({fifth: true})
        }
        if(event.target.value === "sixth") {
            this.setState({sixth: true})
        }
        if(event.target.value === "seventh") {
            this.setState({seventh: true})
        }
        if(event.target.value === "eighth") {
            this.setState({eighth: true})
        }
        if(event.target.value === "ninth") {
            this.setState({ninth: true})
        }
        if(event.target.value === "tenth") {
            this.setState({tenth: true})
        }
        if(event.target.value === "eleventh") {
            this.setState({eleventh: true})
        }
        if(event.target.value === "twelveth") {
            this.setState({twelveth: true})
        }
        
    }

    handleChangeIndustry(event) {
        this.setState({industry: event.target.value})
        if(event.target.value === "Agriculture, Food & Natural Resources") {
            this.setState({agriculture: true})
        }
        if(event.target.value === "Architecture & Construction") {
            this.setState({architecture: true})
        }
        if(event.target.value === "Arts, Audio/Video Technology, & Communications") {
            this.setState({arts: true})
        }
        if(event.target.value === "Business Management & Administration") {
            this.setState({businessManagement: true})
        }
        if(event.target.value === "Education & Training") {
            this.setState({educationTraining: true})
        }
        if(event.target.value === "Finance") {
            this.setState({finance: true})
        }
        if(event.target.value === "Government & Public Administration") {
            this.setState({governmentPublic: true})
        }
        if(event.target.value === "Health Science") {
            this.setState({healthScience: true})
        }
        if(event.target.value === "Hospitality & Tourism") {
            this.setState({hospitality: true})
        }
        if(event.target.value === "Human Services") {
            this.setState({humanServices: true})
        }
        if(event.target.value === "Information Technology") {
            this.setState({informationTechnology: true})
        }
        if(event.target.value === "Law, Public Safety, Corrections & Security") {
            this.setState({lawSafety: true})
        }
        if(event.target.value === "Manufacturing") {
            this.setState({manufacturing: true})
        }
        if(event.target.value === "Marketing, Sales & Service") {
            this.setState({marketingSales: true})
        }
        if(event.target.value === "Science, Technology, Engineering & Math") {
            this.setState({sTEM: true})
        }
        if(event.target.value === "Transportation, Distribution & Logistics") {
            this.setState({transportation: true})
        }
        
    }

    downloadTest() {
        fetch('/downloadtest');
    }

    downloadFile(event) {
        event.preventDefault();
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



    searchFunction() {
        var searchTerm = this.state.searchTerm;
        var driveFiles = this.organizeFiles();
        console.log(driveFiles)
        this.setState({searchRan: false});
        this.setState({foundFolders: []})
        this.setState({foundFiles: []})
        var foundFiles = [];
        var foundFolders = [];
        for(var i = 0; i < driveFiles.length; i++) {

        // Main search terms

            if(this.state.searchTerm === "Search Here" && !this.state.math && !this.state.science && !this.state.socialStudies && !this.state.english) {
                this.setState({foundFolders: [{file: "Please enter a valid search term."}]})
                this.setState({foundFiles: [{file: "Please enter a valid search term."}]})
            }

            if (driveFiles[i].file.includes(searchTerm) === true && !this.state.math && !this.state.science && !this.state.socialStudies && !this.state.english ) {
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

        // Subject search terms 

            // Subjects without keyword

            if (searchTerm === "Search Here" && this.state.math === true) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'math') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFolders)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'math') {
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }
            
            if (searchTerm === "Search Here" && this.state.science) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'science') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'science') {
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }

            if (searchTerm === "Search Here" && this.state.socialStudies) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'socialStudies') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'socialStudies') {
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }

            if (searchTerm === "Search Here" && this.state.languageArts) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'languageArts') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'languageArts') {
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }

            if (searchTerm === "Search Here" && this.state.careers === true) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'careers') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFolders)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'careers') {
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }

            if (searchTerm === "Search Here" && this.state.technology === true) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'technology') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFolders)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'technology') {
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }
        
            // Subjects with keyword

            if (driveFiles[i].file.includes(searchTerm) === true && this.state.math === true) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'math') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFolders)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'math') {
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }
            if (driveFiles[i].file.includes(searchTerm) === true && this.state.science) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'science') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'science') {
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }
            if (driveFiles[i].file.includes(searchTerm) === true && this.state.socialStudies) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'socialStudies') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'socialStudies') {
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }
            if (driveFiles[i].file.includes(searchTerm) === true && this.state.languageArts) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'languageArts') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'languageArts') {
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }

            if (driveFiles[i].file.includes(searchTerm) === true && this.state.careers === true) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'careers') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFolders)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'careers') {
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }

            if (driveFiles[i].file.includes(searchTerm) === true && this.state.technology === true) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'technology') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFolders)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'technology') {
                    foundFiles.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFiles: foundFiles})
                }
            }

    // Grade Search Terms 

        // Grade without keyword
        
        if(searchTerm === "Search Here" && this.state.preK === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'pre-k') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.K === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'K') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.first === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'first') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.second === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'second') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.third === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'third') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.fourth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'fourth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.fifth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'fifth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.sixth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'sixth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.seventh === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'seventh') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.eighth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'eighth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.ninth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'ninth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.tenth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'tenth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.eleventh === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'eleventh') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(searchTerm === "Search Here" && this.state.twelveth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'eleventh') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }
        

        // Grade with keyword

        if(driveFiles[i].file.includes(searchTerm) && this.state.preK === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'pre-k') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }
//
        if(driveFiles[i].file.includes(searchTerm) === true && this.state.K === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'K') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }
//
        if(driveFiles[i].file.includes(searchTerm) === true && this.state.first === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'first') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(driveFiles[i].file.includes(searchTerm) === true && this.state.second === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'second') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(driveFiles[i].file.includes(searchTerm) === true && this.state.third === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'third') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(driveFiles[i].file.includes(searchTerm) === true && this.state.fourth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'fourth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(driveFiles[i].file.includes(searchTerm) === true && this.state.fifth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'fifth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(driveFiles[i].file.includes(searchTerm) === true && this.state.sixth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'sixth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(driveFiles[i].file.includes(searchTerm) === true && this.state.seventh === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'seventh') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(driveFiles[i].file.includes(searchTerm) === true && this.state.eighth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'eighth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(driveFiles[i].file.includes(searchTerm) === true && this.state.ninth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'ninth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(driveFiles[i].file.includes(searchTerm) === true && this.state.tenth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'tenth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(driveFiles[i].file.includes(searchTerm) === true && this.state.eleventh === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'eleventh') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

        if(driveFiles[i].file.includes(searchTerm) === true && this.state.twelveth === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'twelveth') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFolders: foundFolders})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i]);
                        this.setState({foundFiles: foundFiles})
                    }
                }
            }
        }

    //Industry Search Terms

        //Industry Without Keyword
        if (searchTerm === "Search Here" && this.state.agriculture === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Agriculture, Food & Natural Resources') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Agriculture, Food & Natural Resources') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }
        if (searchTerm === "Search Here" && this.state.architecture === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Architecture & Construction') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Architecture & Construction') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.arts === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Arts, Audio/Video Technology, & Communications') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Arts, Audio/Video Technology, & Communications') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.businessManagement === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Business Management & Administration') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Business Management & Administration') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.educationTraining === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Education & Training') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Education & Training') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.finance === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Finance') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Finance') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.governmentPublic === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Government & Public Administration') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Government & Public Administration') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.healthScience === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Health Science') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Health Science') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.hospitality === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Hospitality & Tourism') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Hospitality & Tourism') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.humanServices === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Human Services') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Human Services') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.informationTechnology === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Information Technology') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Information Technology') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.lawSafety === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Law, Public Safety, Corrections & Security') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Law, Public Safety, Corrections & Security') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.manufacturing === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Manufacturing') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Manufacturing') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.marketingSales === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Marketing, Sales & Service') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Marketing, Sales & Service') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.sTEM === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Science, Technology, Engineering & Math') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Science, Technology, Engineering & Math') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (searchTerm === "Search Here" && this.state.transportation === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Transportation, Distribution & Logistics') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Transportation, Distribution & Logistics') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }



        //Industry With Keyword

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.agriculture === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Agriculture, Food & Natural Resources') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Agriculture, Food & Natural Resources') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.architecture === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Architecture & Construction') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Architecture & Construction') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.arts === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Arts, Audio/Video Technology, & Communications') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Arts, Audio/Video Technology, & Communications') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.businessManagement === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Business Management & Administration') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Business Management & Administration') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.educationTraining === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Education & Training') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Education & Training') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.finance === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Finance') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Finance') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.governmentPublic === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Government & Public Administration') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Government & Public Administration') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.healthScience === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Health Science') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Health Science') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.hospitality === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Hospitality & Tourism') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Hospitality & Tourism') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.humanServices === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Human Services') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Human Services') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.informationTechnology === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Information Technology') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Information Technology') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.lawSafety === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Law, Public Safety, Corrections & Security') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Law, Public Safety, Corrections & Security') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.manufacturing === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Manufacturing') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Manufacturing') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.marketingSales === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Marketing, Sales & Service') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Marketing, Sales & Service') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.sTEM === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Science, Technology, Engineering & Math') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Science, Technology, Engineering & Math') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        if (driveFiles[i].file.includes(searchTerm) === true && this.state.transportation === true) {
            if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.industry === 'Transportation, Distribution & Logistics') {
                foundFolders.push(driveFiles[i])
                console.log(foundFolders)
                this.setState({foundFolders: foundFolders})
            }
            if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.industry === 'Transportation, Distribution & Logistics') {
                foundFiles.push(driveFiles[i])
                console.log(foundFiles)
                this.setState({foundFiles: foundFiles})
            }
        }

        
        }
        this.setState({searchRan: true})
    }





    //Industry State Search Functions

    agriculture() {
        this.setState({agriculture: true})
    }

    architecture() {
        this.setState({architecture: true})
    }

    arts() {
        this.setState({arts: true})
    }

    businessManagement() {
        this.setState({businessManagement: true})
    }

    educationTraining() {
        this.setState({educationTraining: true})
    }

    finance() {
        this.setState({finance: true})
    }

    governmentPublic() {
        this.setState({governmentPublic: true})
    }

    healthScience() {
        this.setState({healthScience: true})
    }

    hospitality() {
        this.setState({hospitality: true})
    }

    humanServices() {
        this.setState({humanServices: true})
    }

    informationTechnology() {
        this.setState({informationTechnology: true})
    }

    lawSafety() {
        this.setState({lawSafety: true})
    }

    manufacturing() {
        this.setState({manufacturing: true})
    }

    marketingSales() {
        this.setState({marketingSales: true})
    }

    sTEM() {
        this.setState({sTEM: true})
    }

    transportation() {
        this.setState({transportation: true})
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
                                    <Form.Control as="select" onChange = {this.handleChangeSubject} value = {this.state.subject || ''}>
                                        <option> Pick a subject:</option>
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
                                    <Form.Control as="select" onChange = {this.handleChangeGrade} value = {this.state.grade || ''}>
                                        <option> Pick a grade:</option>
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
                                    <Form.Control as="select" onChange = {this.handleChangeIndustry} value = {this.state.industry || ''}>
                                      <option> Pick Industry: </option>
                                      <option value = "Agriculture, Food and Natural Resources"> Agriculture, Food and Natural Resources </option>
                                      <option value = "Architecture and Construction"> Architecture and Construction </option>
                                      <option value = "Arts, Audio/Video Technology and Communications"> Arts, Audio/Video Technology and Communications </option>
                                      <option value = "Business Managment and Administration" > Business Managment and Administration </option>
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
                           </Col>
                           <Col md = {9} className = "course-col">
                               <Row className = "top-row-course-search">
                                   <h2> Search </h2>
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
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.math}/> <p> Math </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.science} /> <p> Science </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.socialStudies} /> <p> Social Studies </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.languageArts} /> <p> Language Arts </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.careers}/> <p> Careers </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.technology}/> <p> Technology </p> 
                                    </div>
                                </Row>
                                <hr />
                                <Row className = "search-box grade-level">
                                    <h2> Grade Level </h2>
                                    <Form.Control as="select" onChange = {this.handleChangeGrade} value = {this.state.grade || ''}>
                                    <option> Pick a grade:</option>
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
                                    <select>
                                        <option> Pick Industry: </option>
                                        <option onClick = {this.agriculture}> Agriculture, Food and Natural Resources </option>
                                        <option onClick = {this.architecture}> Architecture and Construction </option>
                                        <option onClick = {this.arts}> Arts, Audio/Video Technology and Communications </option>
                                        <option onClick = {this.businessManagement}> Business Managment and Administration </option>
                                        <option onClick = {this.educationTraining}> Education and Training </option>
                                        <option onClick = {this.finance}> Finance </option>
                                        <option onClick = {this.governmentPublic}> Government and Public Administration </option>
                                        <option onClick = {this.healthScience}> Health Science </option>
                                        <option onClick = {this.hospitality}> Information Technology </option>
                                        <option onClick = {this.lawSafety}> Law, Public Safety, Corrections and Security </option>
                                        <option onClick = {this.manufacturing}> Manufacturing </option>
                                        <option onClick = {this.marketingSales}> Marketing, Sales and Service </option>
                                        <option onClick = {this.sTEM}> Science, Technology, Engineering and Math </option>
                                        <option onClick = {this.transportation}> Transportation, Distribution and Logistics </option>
                                    </select>
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
                                                <img className = "lesson-pic" src = ""></img>
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
                                    <Form onSubmit = {this.downloadFile} >
                                        <Button type = "submit" className = "btn-primary export-btn"> Export File </Button>
                                    </Form> 
                                        <a href = "https://vast-stream-39133.herokuapp.com/download"> <Button className = "btn-primary export-btn"> Download </Button> </a>
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