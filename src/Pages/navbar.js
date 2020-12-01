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

    componentDidMount() {
        fetch('/apicall')
        .then(res => res.json())
        .then(res => this.setState({access: res}))
    }

    async callLogout() {
        await fetch('/logout');
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
        if(!this.state.redirect && this.state.access) {
            return (
                <div>
                    <Navbar expand = 'lg' bg = '#FFFFFF' variant = 'light' className = 'nav-bar'>
                    <Container fluid>
                        <Navbar.Brand className = "logo-class"><Link to = "/"> <img src = "https://i.imgur.com/34fasol.png" className = 'navpic' placeholder = "logo" /> </Link> </Navbar.Brand>
                        <Navbar.Collapse className = "ml-auto">
                            <Row className = "ml-auto">
                            <Nav.Item className = "ml-auto nav-item"> <Nav.Link className = "nav-item"> <Link className = "nav-item nav-item-link" to = "/admin"> Admin Portal </Link> </Nav.Link> </Nav.Item> 
                            <Nav.Item className = "ml-auto nav-item"> <Nav.Link className = "nav-item"> <Link className = "nav-item nav-item-link" to = "/privacy"> Privacy </Link> </Nav.Link> </Nav.Item>  
                            <Nav.Item className = "ml-auto nav-item" onClick = {this.callLogout}> <Nav.Link className = "nav-item"> <Link className = "nav-item" to = "/login"> Logout </Link> </Nav.Link> </Nav.Item>
                            </Row>
                        </Navbar.Collapse>
                    </Container>
                    </Navbar>
                </div>
            )
        }
        if(!this.state.redirect && !this.state.access) {
            return (
                <div>
                    <Navbar expand = 'lg' bg = '#FFFFFF' variant = 'light' className = 'nav-bar'>
                    <Container fluid>
                        <Navbar.Brand className = "logo-class"><Link to = "/"> <img src = "https://i.imgur.com/34fasol.png" className = 'navpic' placeholder = "logo" /> </Link> </Navbar.Brand>
                        <Navbar.Collapse className = "ml-auto">
                            <Row className = "ml-auto">
                            <Nav.Item className = "ml-auto nav-item"> <Nav.Link className = "nav-item"> <Link className = "nav-item nav-item-link" to = "/admin"> Admin Portal </Link> </Nav.Link> </Nav.Item> 
                            <Nav.Item className = "ml-auto nav-item"> <Nav.Link className = "nav-item"> <Link className = "nav-item nav-item-link" to = "/privacy"> Privacy </Link> </Nav.Link> </Nav.Item>  
                            <Nav.Item className = "ml-auto nav-item"> <Nav.Link className = "nav-item"> <Link className = "nav-item" to = "/login"> Login </Link> </Nav.Link> </Nav.Item>
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