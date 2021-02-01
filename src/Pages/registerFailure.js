import React from 'react'; 
import TopNavbar from './navbar'; 
import Footer from './Footer'; 
import {Container} from 'react-bootstrap'; 
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap'; 
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap'; 
import { Redirect } from "react-router-dom";
import Link from 'react-router-dom/Link';




class RegisterFailure extends React.Component {
    constructor(props) {
        super(props)
        this.navbarConnect = this.navbarConnect.bind(this); 
    }
    navbarConnect() {
        fetch('/navbarcall')
              .then(res => res.json())
              .then(res => this.setState({loggedIn: res}))
      }
    render() {
        return (
            <div>
                <TopNavbar login = {this.navbarConnect}/>
                <div className = "whole"> </div>
                <Container>
                    <Row className = "text-center"> 
                        <p> Your account domain could not be verified. </p>
                        <br />
                        <p> Please check with an admin for permission. </p>
                        <Button class = "btn btn-primary"> <a href = "https://connect.smartpathed.com/#/"> Go back to home page </a> </Button>
                    </Row>
                </Container>
                <Footer />
            </div>
        )
    }
} 

export default RegisterFailure; 