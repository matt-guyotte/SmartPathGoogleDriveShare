import React from 'react'; 
import TopNavbar from './navbar'; 
import Footer from './Footer'; 
import {Container} from 'react-bootstrap'; 
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap'; 
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap'; 
import { Redirect } from "react-router-dom";

import RegisterSuccess from "./registerSuccess";
import RegisterFailure from "./registerFailure";


class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          redirect: '',
          email: '',
          password: '',
          registerMessage: '',
        }
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeDomain = this.handleChangeDomain.bind(this);
        this.submitFunction = this.submitFunction.bind(this);
        this.submitFunction2 = this.submitFunction2.bind(this);
        this.navbarConnect = this.navbarConnect.bind(this); 
    }

    handleChangeDomain(event) {
      this.setState({
        domain: event.target.value
      })
    }

    handleChangeEmail(event1) {
      this.setState({
        email: event1.target.value
      })
    }

    handleChangePassword(event2) {
      this.setState({
        password: event2.target.value
      })
    }

    async submitFunction(event) {
      event.preventDefault();
      fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          domain: this.state.domain
        })
      }) 
      this.submitFunction2();
    }

    submitFunction2() {
      fetch('/registerConfirm')
        .then(res => res.text())
        .then(res => this.setState({registerMessage: res}))
    }


    navbarConnect() {
      fetch('/navbarcall')
            .then(res => res.json())
            .then(res => this.setState({loggedIn: res}))
    }

    render() {
      if(this.state.registerMessage === "User registered! Please check your email to verify.") {
        return (
          <div>
            <RegisterSuccess />
          </div>
        )
      }
      if(this.state.registerMessage === "Error in verification.") {
        return (
          <div>
            <RegisterFailure />
          </div>
        )
      }
      else {
        return (
            <div>
                <TopNavbar login = {this.navbarConnect}/>
                <div className = "whole"> </div>
                <Container fluid>
                    <Row className = "justify-content-center auto top-pad login-box"> 
                        <Form onSubmit = {this.submitFunction}>
                        <Form.Group>
                          <Form.Group>
                          <Form.Label>Email address</Form.Label>
                          <Form.Control input = "true" name = "email" value= {this.state.email || ''} placeholder="Enter email" onChange = {this.handleChangeEmail} required />
                          <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                          </Form.Text>
                          </Form.Group>
                          <Form.Group>
                          <Form.Label>Password</Form.Label>
                          <Form.Control input = "true" type="password" name = "password" value = {this.state.password || ''} onChange = {this.handleChangePassword} id = "password" placeholder= "Password" required />
                          </Form.Group>
                          <Form.Label>Domain</Form.Label>
                          <Form.Control input = "true" name = "name" placeholder="Please include the @" value= {this.state.domain || ''} onChange = {this.handleChangeDomain} required />
                          <Form.Text className="text-muted">
                            Re-enter email domain (example: tim<strong>@smartpathed.com</strong>)
                          </Form.Text>
                          <p class = "register-error"> <strong> {this.state.registerMessage} </strong> </p>
                          </Form.Group>
                          <Button variant="primary" type="submit">
                            Submit
                          </Button>
                        </Form>
                    </Row>
                </Container>
                <Footer />
            </div>
        )
      }
    }
} 

export default Register; 