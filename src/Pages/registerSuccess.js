import React from 'react'; 
import TopNavbar from './navbar'; 
import Footer from './Footer'; 
import {Container} from 'react-bootstrap'; 
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap'; 
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap'; 
import { Redirect } from "react-router-dom";





class RegisterSuccess extends React.Component {
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
                <Container fluid>
                    <Row className = "text-center"> 
                        <p> Your account has been created! </p>
                        <p> Please check your email to verify. </p>
                        <Button class = "btn btn-primary"> <Redirect to = "/"> Go back to home page </Link> </Button>
                    </Row>
                </Container>
                <Footer />
            </div>
        )
    }
} 

export default RegisterSuccess; 