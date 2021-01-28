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



class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          loginResult: false,
          redirect: '',
          email: ''
        }
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.submitFunction = this.submitFunction.bind(this);
        this.submitFunction2 = this.submitFunction2.bind(this);
        this.navbarConnect = this.navbarConnect.bind(this); 
    }

    handleChangeEmail(event) {
      this.setState({
        email: event.target.value
      })
    }

    handleChangePassword(event1) {
      this.setState({
        password: event1.target.value
      })
    }

    async submitFunction(event) {
      event.preventDefault();
      await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        })
      }) 
      this.submitFunction2();
    }

    async submitFunction2() {
      fetch('/login2')
        .then(res => res.text())
        .then(res => this.setState({loginResult: res}))
      
    }


    navbarConnect() {
      fetch('/navbarcall')
            .then(res => res.json())
            .then(res => this.setState({loggedIn: res}))
    }

    render() {
      if(this.state.loginResult) {
        return (
          <div>
            <Redirect to = "/" />
          </div>
        )
      }
      else {
        return (
            <div>
                <TopNavbar login = {this.navbarConnect}/>
                <Container fluid>
                  <div className = "whole"> </div>
                    <Row className = "justify-content-center auto top-pad login-box"> 
                        <Form onSubmit = {this.submitFunction}>
                          <Form.Group>
                          <Form.Label>Email address</Form.Label>
                          <Form.Control input = "true" name = "email" value= {this.state.email || ''} placeholder="Enter email" onChange = {this.handleChangeEmail} required />
                          <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                          </Form.Text>
                          </Form.Group>
                          <Form.Group>
                          <Form.Label>Password</Form.Label>
                          <Form.Control input = "true" type="password" name = "password" id = "password" placeholder= "Password" value= {this.state.password || ''} onChange = {this.handleChangePassword} required />
                          </Form.Group>
                          <Button variant="primary" type="submit">
                            Submit
                          </Button>
                          <Form.Text> <p>First time visitors: <br/> Authorize your account <Link to = "/signin"> here </Link> </p> </Form.Text>
                        </Form>
                    </Row>
                </Container>
                <Footer />
            </div>
        )
      }
    }
} 

export default Login; 