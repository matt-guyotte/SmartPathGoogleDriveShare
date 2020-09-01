import React from 'react'; 
import "../App.css"; 
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';
import {Form} from 'react-bootstrap';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Link from 'react-router-dom/Link';

import TopNavbar from './navbar';
import GoogleBtn from './GoogleBtn';
import Register from './register';
import Login from './login'
import test from './test.txt';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            session: false,
            driveFiles: [],
            downloadLink: '',
            searchTerm: '',
            searchRan: false,
            id: '',
            fileName: '',
            foundFolders: [],
            foundFiles: [],

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
                
        })
        this.loginConfirm = this.loginConfirm.bind(this);
        this.organizeFiles = this.organizeFiles.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.handleChangeCheckFile = this.handleChangeCheckFile.bind(this);
        this.searchFunction = this.searchFunction.bind(this);
        this.downloadFile = this.downloadFile.bind(this);

        //Subject State Functions
        this.math = this.math.bind(this);
        this.science = this.science.bind(this);
        this.socialStudies = this.socialStudies.bind(this);
        this.languageArts = this.languageArts.bind(this);
        this.careers = this.careers.bind(this);
        this.technology = this.technology.bind(this);

        //Grade State Functions
        this.preK = this.preK.bind(this);
        this.k = this.k.bind(this);
        this.first = this.first.bind(this);
        this.second = this.second.bind(this);
        this.third = this.third.bind(this);
        this.fourth = this.fourth.bind(this);
        this.fifth = this.fifth.bind(this);
        this.sixth = this.sixth.bind(this);
        this.seventh = this.seventh.bind(this);
        this.eighth = this.eighth.bind(this);
        this.ninth = this.ninth.bind(this);
        this.tenth = this.tenth.bind(this);
        this.eleventh = this.eleventh.bind(this);
        this.twelveth = this.twelveth.bind(this);

        //Industry State Functions
        
    }

    componentDidMount() {
        fetch('/api')
        .then(res => res.json())
        .then(res => this.setState({driveFiles: res}))
        this.organizeFiles();
        fetch('/apicall')
        .then(res => res.json())
        .then(res => this.setState({session: res}))
    }

    loginConfirm() {
        this.setState({
            session: true
        })
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
    }

    downloadFile(event) {
        event.preventDefault();
        fetch('/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
              id: this.state.id
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

        // Main search term

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

            if (searchTerm === '' && this.state.math === true) {
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
            if(searchTerm === '' && this.state.science === true) {
                if(driveFiles[i].properties.subject === 'science') {
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
            if(searchTerm === '' && this.state.socialStudies === true) {
                    if(driveFiles[i].properties.subject === 'social-studies') {
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
            if(searchTerm === '' && this.state.languageArts === true) {
                for(var i = 0; i < driveFiles.length; i++) {
                    if(driveFiles[i].properties.subject === 'languageArts') {
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

            if (searchTerm === '' && this.state.careers === true) {
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

            if (searchTerm === '' && this.state.technology === true) {
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

        if(searchTerm === '' && this.state.preK === true) {
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

        if(searchTerm === '' && this.state.K === true) {
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

        if(searchTerm === '' && this.state.first === true) {
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

        if(searchTerm === '' && this.state.second === true) {
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

        if(searchTerm === '' && this.state.third === true) {
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

        if(searchTerm === '' && this.state.fourth === true) {
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

        if(searchTerm === '' && this.state.fifth === true) {
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

        if(searchTerm === '' && this.state.sixth === true) {
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

        if(searchTerm === '' && this.state.seventh === true) {
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

        if(searchTerm === '' && this.state.eighth === true) {
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

        if(searchTerm === '' && this.state.ninth === true) {
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

        if(searchTerm === '' && this.state.tenth === true) {
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

        if(searchTerm === '' && this.state.eleventh === true) {
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

        if(searchTerm === '' && this.state.twelveth === true) {
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

        // Grade with keyword

        if(driveFiles[i].file === searchTerm && this.state.preK === true) {
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
        
        }
        this.setState({searchRan: true})
    }




    // State Subject Search Functions

    math() {
        this.setState({math: true})
    }

    science() {
        this.setState({science: true})
    }

    socialStudies() {
        this.setState({socialStudies: true})
    }

    languageArts() {
        this.setState({languageArts: true})
    }

    careers() {
        this.setState({careers: true})
    }

    technology() {
        this.setState({technology: true})
    }

    //State Grade Search Functions

    preK() {
        this.setState({preK: true})
    }

    k() {
        this.setState({K: true})
    }

    first() {
        this.setState({first: true})
    }

    second() {
        this.setState({second: true})
    }

    third() {
        this.setState({third: true})
    }

    fourth() {
        this.setState({fourth: true})
    }

    fifth() {
        this.setState({fifth: true})
    }

    sixth() {
        this.setState({sixth: true})
    }

    seventh() {
        this.setState({seventh: true})
    }

    eighth() {
        this.setState({eighth: true})
    }

    ninth() {
        this.setState({ninth: true})
    }

    tenth() {
        this.setState({tenth: true})
    }

    eleventh() {
        this.setState({eleventh: true})
    }

    twelveth() {
        this.setState({twelveth: true})
    }


    //Industry State Search Functions

    //Rendered Component

    render() {
        if(!this.state.session) {
            return (
                <div>
                    <Login loginConfirm = {this.loginConfirm} />
                </div>
            )
        }
        if(this.state.session === true && this.state.searchRan === false) {
            return (
                <div>
                    <TopNavbar />
                    <Container fluid>
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
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.preK} /> <p> Pre-K </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.k}  /> <p> K </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.first}  /> <p> 1st </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.second}  /> <p> 2nd </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.third}  /> <p> 3rd </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.fourth}  /> <p> 4th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.fifth}  /> <p> 5th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.sixth}  /> <p> 6th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.seventh}  /> <p> 7th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.eighth}  /> <p> 8th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.ninth}  /> <p> 9th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.tenth}  /> <p> 10th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.eleventh}  /> <p> 11th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.twelveth}  /> <p> 12th </p> 
                                    </div>
                                </Row>
                                <hr />
                                <Row className = "search-box industry">
                                    <h2> Industry </h2>
                                    <div className = "check-options">
                                        <input type = "checkbox" /> <p> Architecture </p>
                                    </div>
                                    <div className = "check-options"> 
                                        <input type = "checkbox" /> <p> Arts </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" /> <p> Engineering </p> 
                                    </div>
                                </Row>
                           </Col>
                           <Col md = {9} className = "course-col">
                               <Row className = "top-row-course">
                                   <Form onSubmit = {this.downloadFile} >
                                        <Button type = "submit" className = "btn-primary export-btn"> Export </Button>
                                    </Form> 
                                    <a href = {test} download> <Button className = "btn-primary export-btn"> Download </Button> </a>
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
                    </Container>
                </div>
            )
        }
        if(this.state.session === true && this.state.searchRan === true) {
            return (
                <div>
                   <TopNavbar />
                   <Container fluid>
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
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.preK} /> <p> Pre-K </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.k}  /> <p> K </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.first}  /> <p> 1st </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.second}  /> <p> 2nd </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.third}  /> <p> 3rd </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.fourth}  /> <p> 4th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.fifth}  /> <p> 5th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.sixth}  /> <p> 6th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.seventh}  /> <p> 7th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.eighth}  /> <p> 8th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.ninth}  /> <p> 9th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.tenth}  /> <p> 10th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.eleventh}  /> <p> 11th </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.twelveth}  /> <p> 12th </p> 
                                    </div>
                                </Row>
                                <hr />
                                <Row className = "search-box industry">
                                    <h2> Industry </h2>
                                    <div className = "check-options">
                                        <input type = "checkbox" /> <p> Architecture </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" /> <p> Arts </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" /> <p> Engineering </p> 
                                    </div>
                                </Row>
                                </div>
                           </Col>
                           <Col md = {9} className = "course-col">
                               <Row className = "top-row-course">
                                    <Form onSubmit = {this.downloadFile} >
                                        <Button type = "submit" className = "btn-primary export-btn"> Export </Button>
                                    </Form> 
                                    <a href = {test} download> <Button className = "btn-primary export-btn"> Download </Button> </a>
                               </Row>
                                <br />
                                <Row className = "course-box-search">
                                   <Col>
                                        <Row>
                                            <Col>
                                            <h2> Found Lessons </h2>
                                                {this.state.foundFolders.map(folders => (
                                                <div className = "file-box-search" key={folders}>
                                                <input type = "checkbox"></input><h2 className = ""> <a href = {folders.click}> {folders.file} </a> </h2>
                                                <p> {folders.description} </p>
                                                <img className = "lesson-pic" src = ""></img>
                                                <h4> Options </h4>
                                                <input type = "checkbox" /> <p> Video </p> 
                                                <input type = "checkbox" /> <p> Rubric </p> 
                                                <input type = "checkbox" /> <p> Handout </p>
                                                </div>))}
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col>
                                            <h2> Found Files </h2>
                                                {this.state.foundFiles.map(files => (
                                                <div className = "file-box-search" key={files}>
                                                    <input type = "checkbox" value = {files.id} onChange = {this.handleChangeCheckFile}></input> <p className = ""> <a href = {files.click}> {files.file} </a> </p>
                                                    <p> {files.description}</p>
                                                </div>
                                                ))}
                                            </Col>
                                        </Row>
                                   </Col>
                               </Row>
                           </Col>  
                        </Row>
                    </Container>
                </div>
            )
        }
    }
}

export default Search; 