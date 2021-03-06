import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';
import Link from 'react-router-dom/Link';

import GoogleBtn2 from './GoogleBtn2';
import AdminNavbar from './adminNavbar';
import Footer from './Footer'
import DomainView from './domainView';
import SmartPathView from './smartPathView';
import UpdateFolder from "./updateFolder";
import CreateNew from './createNew';
import AddNew from './AddNew';
import TopNavbar from './navbar';


class adminPortal extends Component {
   constructor(props) {
    super(props);

    this.state = {
      access: false,
      domains: false,
      view: false, 
      updateFolder: false,
      addNew: false,
      createNew: false,
      accessToken: ''
    };
    this.loginConfirm = this.loginConfirm.bind(this);
    this.moveToDomains = this.moveToDomains.bind(this);
    this.moveToSmartpath = this.moveToSmartpath.bind(this);
    this.moveToAddNew = this.moveToAddNew.bind(this);
    this.moveToUpdateFolder = this.moveToUpdateFolder.bind(this);
  }

    apiTest() {
        fetch("/drivecall2")
    }

    loginConfirm() {
        this.setState({
            access: true
        })
    }

    moveToDomains() {
        if(this.state.domains === false) {
            this.setState({
                domains: true
            })
        }
        if(this.state.domains === true) {
            this.setState({
                domains: false
            })
        }
    }
    moveToSmartpath() {
        if(this.state.view === false) {
            this.setState({
                view: true
            })
        }
        if(this.state.view === true) {
            this.setState({
                view: false
            })
        }
    }
    moveToUpdateFolder() {
        if(this.state.updateFolder === false) {
            this.setState({
                updateFolder: true
            })
        }
        if(this.state.updateFolder === true) {
            this.setState({
                updateFolder: false
            })
        }
    }
    moveToAddNew() {
        if(this.state.addNew === false) {
            this.setState({
                addNew: true
            })
        }
        if(this.state.addNew === true) {
            this.setState({
                addNew: false
            })
        }
    }


  render() {
    if(!this.state.access) {
        return (
            <div>
            <p><strong> Note: </strong></p>
            <p> This is for Smartpath admins only.</p> 
            <GoogleBtn2 login = {this.loginConfirm} />
            </div>
        )
    }
    if (this.state.domains === true && this.state.view != true && this.state.updateFolder != true && this.state.createNew != true) {
        return (
            <div>
            <AdminNavbar />
            <DomainView
                domains = {this.state.domains}
                moveToDomains = {this.moveToDomains} />
            </div>
        )
    }
    if (this.state.view === true) {
        return (
            <div>
            <AdminNavbar />
            <SmartPathView
                smartpath = {this.state.view}
                moveToSmartpath = {this.moveToSmartpath} />
            </div>
        )
    }
    if (this.state.updateFolder === true && this.state.domains != true && this.state.view != true && this.state.createNew != true) {
        return (
            <div>
            <AdminNavbar />
            <UpdateFolder
                updateFolder = {this.state.updateFolder}
                moveToUpdateFolder = {this.moveToUpdateFolder} />
            </div>
        )
    }
    if(this.state.addNew === true) {
        return (
            <div>
            <AdminNavbar />
            <AddNew
                addNew = {this.state.addNew}
                moveToAddNew = {this.moveToAddNew} />
            </div>
        )
    }
    if (this.state.createNew === true) {
        return (
            <div>
            <AdminNavbar />
            <CreateNew
                createNew = {this.state.createNew}
                moveToCreateNew = {this.moveToCreateNew} />
            </div>
        )
    }
     else {
    return (
    <div>
        <AdminNavbar />
        <div className = "whole"> </div>
        <div className = "page">
            <Container fluid>
            <h3 className = "admin-title"> <strong> Welcome to the admin portal! </strong> </h3>
            <Row>
                <Col lg = {6}>
                    <div className = "admin-box" onClick = {this.moveToDomains}> 
                        <h4 className = "admin-box-term"> View Domains and Privileges </h4>
                    </div>
                </Col>
                <Col lg = {6}>
                    <div className = "admin-box"onClick = {this.moveToSmartpath}>
                        <h4 className = "admin-box-term"> View Smartpath Folder </h4>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg = {6}>
                    <div className = "admin-box" onClick = {this.moveToUpdateFolder}> 
                        <h4 className = "admin-box-term"> Edit a Lesson / Add Image </h4>
                    </div>
                </Col>
                <Col lg = {6}>
                    <div className = "admin-box" onClick = {this.moveToAddNew}> 
                        <h4 className = "admin-box-term"> Add a Lesson </h4>
                    </div>
                </Col>
            </Row>
            {this.state.accessToken}
            </Container>
        </div>
        <Footer />
    </div>
    )
    }
}
}

export default adminPortal;
