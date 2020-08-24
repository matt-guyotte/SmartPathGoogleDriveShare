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
        .then(res => console.log(res));
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
            driveFiles[i].click = 'https://drive.google.com/drive/folders/' + driveFiles[i].id;
        }
        return driveFiles;
    }

    handleChangeSearch(event) {
        this.setState({
          searchTerm: event.target.value
        })
    }




    searchFunction() {
        var searchTerm = this.state.searchTerm;
        var driveFiles = this.organizeFiles();
        this.setState({searchRan: false});
        this.setState({foundFolders: []})
        this.setState({foundFiles: []})
        var foundFiles = [];
        var foundFolders = [];
        for(var i = 0; i < driveFiles.length; i++) {

        // Main search term

            if (driveFiles[i].file === searchTerm && !this.state.math && !this.state.science && !this.state.socialStudies && !this.state.english ) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder") {
                    foundFolders.push(driveFiles[i].file)
                    console.log(foundFolders)
                    this.setState({foundFolders: [...this.state.foundFolders, foundFolders]})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document') {
                    foundFiles.push(driveFiles[i].file)
                    console.log(foundFiles)
                    this.setState({foundFiles: [...this.state.foundFiles, foundFiles]})
                }
            }

        // Subject search terms 
            
            // Subjects without keyword

            if(searchTerm === '' && this.state.math === true) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'math') {
                    foundFolders.push(driveFiles[i].file)
                    console.log(foundFolders)
                    this.setState({foundFolders: [...this.state.foundFolders, foundFolders]})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'math') {
                    foundFiles.push(driveFiles[i].file)
                    console.log(foundFiles)
                    this.setState({foundFiles: [...this.state.foundFiles, foundFiles]})
                }
            }
            if(searchTerm === '' && this.state.science === true) {
                for(var i = 0; i < driveFiles.length; i++) {
                    if(driveFiles[i].properties.subject === 'science') {
                        if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                            foundFolders.push(driveFiles[i].file);
                            this.setState({foundFolders: [...this.state.foundFolders, foundFolders]})
                        }
                        if(driveFiles[i].type === "application/vnd.google-apps.document") {
                            foundFolders.push(driveFiles[i].file);
                            this.setState({foundFolders: [...this.state.foundFiles, foundFiles]})
                        }
                    }
                }
            }
            if(searchTerm === '' && this.state.socialStudies === true) {
                for(var i = 0; i < driveFiles.length; i++) {
                    if(driveFiles[i].properties.subject === 'social-studies') {
                        if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                            foundFolders.push(driveFiles[i].file);
                            this.setState({foundFolders: [...this.state.foundFolders, foundFolders]})
                        }
                        if(driveFiles[i].type === "application/vnd.google-apps.document") {
                            foundFolders.push(driveFiles[i].file);
                            this.setState({foundFolders: [...this.state.foundFiles, foundFiles]})
                        }
                    }
                }
            }
            if(searchTerm === '' && this.state.english === true) {
                for(var i = 0; i < driveFiles.length; i++) {
                    if(driveFiles[i].properties.subject === 'english') {
                        if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                            foundFolders.push(driveFiles[i].file);
                            this.setState({foundFolders: [...this.state.foundFolders, foundFolders]})
                        }
                        if(driveFiles[i].type === "application/vnd.google-apps.document") {
                            foundFolders.push(driveFiles[i].file);
                            this.setState({foundFolders: [...this.state.foundFiles, foundFiles]})
                        }
                    }
                }
            }

            // Subjects with keyword

            if (driveFiles[i].file === searchTerm && this.state.math === true) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'math') {
                    foundFolders.push(driveFiles[i].file)
                    console.log(foundFolders)
                    this.setState({foundFolders: [...this.state.foundFolders, foundFolders]})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'math') {
                    foundFiles.push(driveFiles[i].file)
                    console.log(foundFiles)
                    this.setState({foundFiles: [...this.state.foundFiles, foundFiles]})
                }
            }
            if (driveFiles[i].file === searchTerm && this.state.science) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'science') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFolders: [...this.state.foundFolders, driveFiles[i]]})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'science') {
                    foundFiles.push(driveFiles[i].file)
                    console.log(foundFiles)
                    this.setState({foundFiles: [...this.state.foundFiles, foundFiles]})
                }
            }
            if (driveFiles[i].file === searchTerm && this.state.socialStudies) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'socialStudies') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFolders: [...this.state.foundFolders, driveFiles[i]]})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'socialStudies') {
                    foundFiles.push(driveFiles[i].file)
                    console.log(foundFiles)
                    this.setState({foundFiles: [...this.state.foundFiles, foundFiles]})
                }
            }
            if (driveFiles[i].file === searchTerm && this.state.english) {
                if (driveFiles[i].type === "application/vnd.google-apps.folder" && driveFiles[i].properties.subject === 'english') {
                    foundFolders.push(driveFiles[i])
                    console.log(foundFiles)
                    this.setState({foundFolders: [...this.state.foundFolders, driveFiles[i]]})
                }
                if (driveFiles[i].type === 'application/vnd.google-apps.document' && driveFiles[i].properties.subject === 'english') {
                    foundFiles.push(driveFiles[i].file)
                    console.log(foundFiles)
                    this.setState({foundFiles: [...this.state.foundFiles, foundFiles]})
                }
            }

    // Grade Search Terms 

        // Grade without keyword 

        if(searchTerm === '' && this.state.preK === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'pre-k') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i].file);
                        this.setState({foundFolders: [...this.state.foundFolders, foundFolders]})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i].file);
                        this.setState({foundFolders: [...this.state.foundFiles, foundFiles]})
                    }
                }
            }
        }
//
        if(searchTerm === '' && this.state.K === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'K') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i].file);
                        this.setState({foundFolders: [...this.state.foundFolders, foundFolders]})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i].file);
                        this.setState({foundFolders: [...this.state.foundFiles, foundFiles]})
                    }
                }
            }
        }
//
        if(searchTerm === '' && this.state.first === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'first') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i].file);
                        this.setState({foundFolders: [...this.state.foundFolders, foundFolders]})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i].file);
                        this.setState({foundFolders: [...this.state.foundFiles, foundFiles]})
                    }
                }
            }
        }

        // Grade with keyword

        if(driveFiles[i].file === searchTerm && this.state.preK === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'pre-k') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i].file);
                        this.setState({foundFolders: [...this.state.foundFolders, foundFolders]})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i].file);
                        this.setState({foundFolders: [...this.state.foundFiles, foundFiles]})
                    }
                }
            }
        }
//
        if(driveFiles[i].file === searchTerm && this.state.K === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'K') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i].file);
                        this.setState({foundFolders: [...this.state.foundFolders, foundFolders]})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i].file);
                        this.setState({foundFolders: [...this.state.foundFiles, foundFiles]})
                    }
                }
            }
        }
//
        if(driveFiles[i].file === searchTerm && this.state.first === true) {
            for(var i = 0; i < driveFiles.length; i++) {
                if(driveFiles[i].properties.grade === 'first') {
                    if(driveFiles[i].type === "application/vnd.google-apps.folder") {
                        foundFolders.push(driveFiles[i].file);
                        this.setState({foundFolders: [...this.state.foundFolders, foundFolders]})
                    }
                    if(driveFiles[i].type === "application/vnd.google-apps.document") {
                        foundFolders.push(driveFiles[i].file);
                        this.setState({foundFolders: [...this.state.foundFiles, foundFiles]})
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
                    <Container>
                        <Row> 
                           <Col md = {3} className = "search-col">
                               <Row>
                                   <input type = "text" className = "searchBar" value = {this.state.searchTerm || ''} onChange = {this.handleChangeSearch} />
                                   <input type = "submit" onClick = {this.searchFunction}/>
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
                                <Row className = "search-box industry">
                                    <h2> Industry </h2>
                                    <input type = "checkbox" /> <p> Architecture </p> 
                                    <input type = "checkbox" /> <p> Arts </p> 
                                    <input type = "checkbox" /> <p> Engineering </p> 
                                </Row>
                           </Col>
                           <Col md = {8} className = "course-col">
                               <Row className = "top-row-course">
                                    <Button className = "btn-primary export-btn"> Export </Button>
                               </Row>
                                <br />
                                <Row className = "course-box-search">
                                   <Col>
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
                    <Container>
                        <Row> 
                           <Col md = {3} className = "search-col">
                               <Row>
                                   <input type = "text" className = "searchBar" value = {this.state.searchTerm || ''} onChange = {this.handleChangeSearch} />
                                   <input type = "submit" onClick = {this.searchFunction}/>
                               </Row>
                                <Row className = "search-box subject-area">
                                    <h2>Subject Area</h2>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.math} /> <p> Math </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.science}/> <p> Science </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.socialStudies}/> <p> Social Studies </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.english}/> <p> English </p> 
                                    </div>
                                </Row>
                                <Row className = "search-box grade-level">
                                    <h2> Grade Level </h2>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.preK} /> <p> Pre-K </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.k} /> <p> K </p> 
                                    </div>
                                    <div className = "check-options">
                                        <input type = "checkbox" onClick = {this.first} /> <p> 1st </p> 
                                    </div>
                                </Row>
                                <Row className = "search-box industry">
                                    <h2> Industry </h2>
                                    <input type = "checkbox" /> <p> Architecture </p> 
                                    <input type = "checkbox" /> <p> Arts </p> 
                                    <input type = "checkbox" /> <p> Engineering </p> 
                                </Row>
                           </Col>
                           <Col md = {8} className = "course-col">
                               <Row className = "top-row-course">
                                    <Button className = "btn-primary export-btn"> Export </Button>
                               </Row>
                                <br />
                                <Row className = "course-box-search">
                                   <Col>
                                        <Row>
                                            <Col>
                                                <h2> Found Files </h2>
                                                {this.state.foundFiles.map(files => (
                                                <p className = "file-box-search" key={files}>{files}</p>))}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <h2> Found Folders </h2>
                                                {this.state.foundFolders.map(folders => (
                                                <p className = "file-box-search" key={folders}>{folders}</p>))}
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