import React from 'react'; 
import {Navbar, Nav} from 'react-bootstrap'; 
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Link from 'react-router-dom/Link'; 
import GoogleBtn from './GoogleBtn';
import { Redirect } from 'react-router';

class TopNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            access: false,
            redirect: false,
        })
        this.callLogout = this.callLogout.bind(this);
    }

    callLogout() {
        fetch('/logout');
        this.setState({
            redirect: true
        })
    }
    render() {
        if(this.state.redirect) {
            return(
            <div>
                <Redirect to = "/" />
            </div>
            )
        }
        else {
        return (
            <div>
                <Navbar expand = 'lg' bg = '#FFFFFF' variant = 'light' className = 'nav-bar'>
                <Container fluid>
                    <Navbar.Brand class = "logo-class"><Link to = "/"> <img src = "https://i.imgur.com/34fasol.png" className = 'navpic' placeholder = "logo" /> </Link> </Navbar.Brand>
                    <Navbar.Collapse className = "ml-auto">
                        <Row className = "ml-auto">
                        <Nav.Item className = "ml-auto"> <Nav.Link> <Link to = "/admin"> Admin Portal </Link> </Nav.Link> </Nav.Item> 
                        <Nav.Item className = "ml-auto" onClick = {this.callLogout}> <Nav.Link> <Link to = "/"> Logout  </Link> </Nav.Link> </Nav.Item> 
                        </Row>
                    </Navbar.Collapse>
                </Container>
                </Navbar>
            </div>
        )
    }
    }
} 

export default TopNavbar; 