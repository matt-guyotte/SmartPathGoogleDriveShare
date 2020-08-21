import React from 'react'; 
import "../App.css"; 
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';
import TopNavbar from './navbar';
import GoogleBtn from './GoogleBtn'; 

class FrontPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = ({
            access: false,
            driveFiles: [],
            topFolder: true,
            id: '10nHr-VBYoU-zb7XuvMhrzedjmjtg-wZE'
        })
        this.loginConfirm = this.loginConfirm.bind(this);
        this.organizeFiles = this.organizeFiles.bind(this);
        this.getChildren = this.getChildren.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:8080/api')
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
        }
        return driveFiles;
    }


    getChildren() {
        var driveFiles = this.organizeFiles();
        var id = this.state.id;
        for (var i = 0; i < driveFiles.length; i++) {
            if(driveFiles[i].id === id) {
                var section = driveFiles[i]
                var childrenArray = [];
                childrenArray.push(section.children)
            }
        }
        for (var y = 0; y < driveFiles.length; y++) {
            for (var j = 0; j < childrenArray.length; j++) {
                if (childrenArray[j] === driveFiles[y].id) {
                    var sectionY = driveFiles[y];
                    var newId = sectionY.id;
                    var content = [];
                    var newId = [];
                    content.push(<Col className = "file-column" md = "4"> <button className = "file-title" id = {newId} onClick = {this.addNewId}> {sectionY.file} </button> </Col>)
                    newId.push(sectionY.id)
                }
            }
        }
    return content;
    }

    render() {
        if(!this.state.access) {
            return (
                <div>
                <p><strong> Note: </strong></p>
                <p> This is for smartpath users only.</p> 
                <GoogleBtn onClick = {this.getChildren} login = {this.loginConfirm}/>
                </div>
            )
        }
        else {
            return (
                <div>
                    <TopNavbar />
                    <Container className = "repository-page">
                        <Row className = "repository-title">
                            <Col>
                            <h1> Smartpath Repository </h1>
                            </Col>
                        </Row>
                        <Row className = "file-box">
                        {this.getChildren()}
                        </Row>
                    </Container>
                </div>
            )
        }
    }
}

export default FrontPage; 