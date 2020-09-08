import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';
import Link from 'react-router-dom/Link';


class SmartPathView extends Component {
   constructor(props) {
    super(props);

    this.state = {
      driveFiles: [],
      newFiles: [],
    };
    this.organizeFiles = this.organizeFiles.bind(this);
  }

  async componentDidMount() {
    await fetch('/api')
      .then(res => res.json())
      .then(res => this.setState({driveFiles: res}))
    this.organizeFiles();
  }

  async organizeFiles() {
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
      if (driveFiles[i].id === "1BX5E-EKlk6kU7grAtY9zthnTeM5vGsX-") {
        
      }
    }
    this.setState({newFiles: driveFiles})
    return driveFiles;
}

  render() {
    return (
    <div className = "admin-page">
      <Container>
     <Link to = "/admin"> <Button className = 'btn btn-primary' onClick = {this.props.moveToSmartpath}> Return to Home </Button> </Link>
        <h3> Smartpath Folder </h3>
        <div> 
        {this.state.newFiles.map(folders => (
        <div className = "file-box-search" key={folders}>
        <input type = "checkbox" name = {folders.file} value = {folders.id}></input><h2 className = ""> <a href = {folders.click}> {folders.file} </a> </h2>
        <p> {folders.description} </p>
        <img className = "lesson-pic" src = ""></img>
        </div>))}

        </div>
          <Button className = "btn btn-primary"> <small> Add to folder </small> </Button>
          </Container>
    </div>
    )
  }
}

export default SmartPathView;
