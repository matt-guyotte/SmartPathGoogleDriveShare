import React from 'react'; 
import "../App.css"; 
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Link from 'react-router-dom/Link';
import TopNavbar from './navbar';
import GoogleBtn from './GoogleBtn';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            access: true,
            driveFiles: [],
            downloadLink: '',
            searchTerm: '',
            searchRan: false,
            foundFolders: [],
            foundFiles: [],

            // Search Terms

                // Subjects
                math: false,
                science: false,
                socialStudies: false,
                english: false,

                // Grades 
                preK: false,
                K: false, 
                first: false,

                // Industry
                architecture: false,
                art: false, 
                engineering: false, 
        })
        this.loginConfirm = this.loginConfirm.bind(this);
        this.organizeFiles = this.organizeFiles.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.searchFunction = this.searchFunction.bind(this);
        this.downloadFile = this.downloadFile.bind(this);

        //Subject State Functions
        this.math = this.math.bind(this);
        this.science = this.science.bind(this);
        this.socialStudies = this.socialStudies.bind(this);
        this.english = this.english.bind(this);

        //Grade State Functions
        this.preK = this.preK.bind(this);
        this.k = this.k.bind(this);
        this.first = this.first.bind(this);

        //Industry State Functions
        this.industry = this.industry.bind(this);
    }

    componentDidMount() {
        fetch('/api')
        .then(res => res.json())
        .then(res => this.setState({driveFiles: res}))
        this.organizeFiles();
    }

    loginConfirm() {
        this.setState({
            access: true
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

    downloadFile() {
        fetch("/download")
        .then(res => res.json())
        .then(res => this.setState({downloadFile: res}))
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
            if(searchTerm === '' && this.state.english === true) {
                for(var i = 0; i < driveFiles.length; i++) {
                    if(driveFiles[i].properties.subject === 'english') {
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
            if (driveFiles[i].file.includes(searchTerm) === true && this.state.english) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'english') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFolders: foundFolders})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'english') {
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
//
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
//
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

    english() {
        this.setState({english: true})
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


    //Industry State Search Functions

    industry() {
        var industry = [
            this.setState({architecture: true}),
            this.setState({art: true}),
            this.setState({engineering: true})
        ]
        return industry
    }


    //Rendered Component

    render() {
        if(!this.state.access) {
            return (
                <div>
                <p><strong> Note: </strong></p>
                <p> This is for smartpath users only.</p> 
                <GoogleBtn login = {this.loginConfirm} />
                </div>
            )
        }
        if(this.state.searchRan === false) {
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
                                        <input type = "checkbox" onClick = {this.english} /> <p> English </p> 
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
                                    <Button className = "btn-primary export-btn" onClick = {this.downloadFile}> Export </Button> 
                                    <a href = "test.jpg" download = "test.jpg"> <Button className = "btn-primary export-btn"> Download </Button> </a>
                               </Row>
                                <br />
                                <Row className = "course-box-search">
                                   <Col>
                                   {this.state.downloadLink}
                                   </Col>
                               </Row>
                           </Col>  
                        </Row>
                    </Container>
                </div>
            )
        }
        if(this.state.searchRan === true) {
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
                                        <input type = "checkbox" onClick = {this.english} /> <p> English </p> 
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
                                    <Button className = "btn-primary export-btn" onClick = {this.downloadFile}> Export </Button> 
                                    <a href = "test.jpg" download = "test.jpg"> <Button className = "btn-primary export-btn"> Download </Button> </a>
                               </Row>
                                <br />
                                <Row className = "course-box-search">
                                   <Col>
                                        <Row>
                                            <Col>
                                                <h2> Found Files </h2>
                                                {this.state.foundFiles.map(files => (
                                                <div className = "file-box-search" key={files}>
                                                    <input type = "checkbox"></input> <p className = ""> <a href = {files.click}> {files.file} </a> </p>
                                                    <p> {files.description}</p>
                                                </div>))}
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col>
                                                <h2> Found Folders </h2>
                                                {this.state.foundFolders.map(folders => (
                                                <div className = "file-box-search" key={folders}>
                                                <input type = "checkbox"></input><h2 className = ""> <a href = {folders.click}> {folders.file} </a> </h2>
                                                <p> {folders.description} </p>
                                                <h4> Options </h4>
                                                <input type = "checkbox" /> <p> Video </p> 
                                                <input type = "checkbox" /> <p> Rubric </p> 
                                                <input type = "checkbox" /> <p> Handout </p>
                                                </div>))}
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