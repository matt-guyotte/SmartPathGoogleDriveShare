import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';
import Link from 'react-router-dom/Link';

import AdminNavbar from './adminNavbar';

function importAll(r) {
  let images = [];
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));


class SmartPathView extends Component {
   constructor(props) {
    super(props);

    this.state = {
      driveFiles: [],
      smartPathFiles: [],
    };
    this.organizeFiles = this.organizeFiles.bind(this);
  }

  async componentDidMount() {
    await fetch('/api')
      .then(res => res.json())
      .then(res => this.setState({driveFiles: res}))
    this.organizeFiles();
  }

  organizeFiles() {
    var driveFiles = this.state.driveFiles;
    for (var i = 0; i < driveFiles.length; i++) {
      if(driveFiles[i].parents === undefined) {continue}
        for(var y = 0; y < driveFiles.length; y++) {
          if(driveFiles[i].parents === undefined) {continue}
          if(driveFiles[y].parents === undefined) {continue}
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
        return driveFiles;
    }

    var smartPathFiles = []
    for(var i = 0; i < driveFiles.length; i++) {
      if(driveFiles[i].file === "smartpath") {
        for(var y = 0; y < driveFiles[y]; y++) {
          if(driveFiles[y].parents[0] === driveFiles[i].id) {
            smartPathFiles.push(driveFiles[y])
          }
        }
      }
    }

    this.setState({smartPathFiles: smartPathFiles});
  }

  render() {
    if(this.state.smartPathFiles = []) {
      return (
        <div className = "admin-page">
          <Container>
            <AdminNavbar />
            <Link to = "/admin"> <Button className = 'btn btn-primary' onClick = {this.props.moveToSmartpath}> Return to Home </Button> </Link>
          </Container>
        </div>
      )
    }
    else {
      return (
      <div className = "admin-page">
        <Container>
       <Link to = "/admin"> <Button className = 'btn btn-primary' onClick = {this.props.moveToSmartpath}> Return to Home </Button> </Link>
          <h3> Smartpath Folder </h3>
          <div> 
          {this.state.driveFiles.map(folders => (
          <div className = "file-box-search" key={folders}>
            <img className = "lesson-pic" src =  {images[folders.properties.imgsrc]}></img>
            <input type = "checkbox" name = {folders.file} value = {folders.id} title = {folders.type} onChange = {this.handleChangeCheckFile}></input><h2 className = ""> <a href = {folders.click}> {folders.file} </a> </h2>
            <p> {folders.description} </p>
            <p> {folders.type} </p>
          </div>))}

          </div>
            <Button className = "btn btn-primary"> <small> Add to folder </small> </Button>
            </Container>
      </div>
      )
    }
  }
}

export default SmartPathView;
