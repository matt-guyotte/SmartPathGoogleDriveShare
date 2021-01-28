import React from 'react'; 
import {Navbar, Nav} from 'react-bootstrap'; 
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Link from 'react-router-dom/Link'; 

class AdminNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
        })
    }
    render() {
        return (
            <div>
                <Navbar expand = 'lg' bg = '#FFFFFF' variant = 'light' className = 'nav-bar'>
                <Container fluid>
                    <Navbar.Brand className = "navpic-container"><Link to = "/"> <img src = "https://i.imgur.com/34fasol.png" className = 'navpic' placeholder = "logo" /> </Link> </Navbar.Brand>
                    <Navbar.Collapse className = "ml-auto">
                        <Row className = "ml-auto">
                            <Nav.Item className = "ml-auto nav-item"> <Nav.Link className = "nav-item"> <Link className = "nav-item nav-item-link" to = "/admin"> Admin Home </Link> </Nav.Link> </Nav.Item> 
                            <Nav.Item className = "ml-auto nav-item"> <Nav.Link className = "nav-item"> <Link className = "nav-item nav-item-link" to = "/"> Search </Link> </Nav.Link> </Nav.Item>
                            <Nav.Item className = "ml-auto nav-item"> <Nav.Link className = "nav-item"> <Link className = "nav-item nav-item-link" to = "/privacy"> Privacy </Link> </Nav.Link> </Nav.Item>  
                            <Nav.Item className = "ml-auto nav-item" onClick = {this.callLogout}> <Nav.Link className = "nav-item"> <Link className = "nav-item" to = "/login"> Logout </Link> </Nav.Link> </Nav.Item>
                        </Row>
                    </Navbar.Collapse>
                </Container>
                </Navbar>
            </div>
        )
    }
} 

export default AdminNavbar; 