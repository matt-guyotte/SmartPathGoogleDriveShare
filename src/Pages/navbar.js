import React from 'react'; 
import {Navbar, Nav} from 'react-bootstrap'; 
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Link from 'react-router-dom/Link'; 
import GoogleBtn from './GoogleBtn';

class TopNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            access: false
        })
        this.loginConfirm = this.loginConfirm.bind(this);
    }

    loginConfirm() {
        this.setState({
            access: true
        })
    }
    render() {
        return (
            <div>
                <Navbar expand = 'lg' bg = 'light' variant = 'light' className = 'nav-bar'>
                <Container fluid>
                    <Navbar.Brand><Link to = "/"> <img src = "https://bit.ly/3frrQ36" className = 'navpic' placeholder = "logo" /> </Link> </Navbar.Brand>
                    <Navbar.Collapse className = "ml-auto">
                        <Row className = "ml-auto">
                        <Nav.Item> <GoogleBtn login = {this.loginConfirm} /> </Nav.Item>
                        </Row>
                    </Navbar.Collapse>
                </Container>
                </Navbar>
            </div>
        )
    }
} 

export default TopNavbar; 