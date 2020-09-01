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
                    <Navbar.Brand class = "logo-class"><Link to = "/"> <img src = "https://i.imgur.com/34fasol.png" className = 'navpic' placeholder = "logo" /> </Link> </Navbar.Brand>
                    <Navbar.Collapse className = "ml-auto">
                        <Row className = "ml-auto">
                        <Nav.Item className = "ml-auto"> <Nav.Link> <Link to = "/admin"> Admin Home </Link> </Nav.Link>  </Nav.Item> 
                        <Nav.Item className = "ml-auto"> <Nav.Link> <Link to = "/"> Search </Link> </Nav.Link> </Nav.Item> 
                        <Nav.Item className = "ml-auto"> <Nav.Link> Logout </Nav.Link> </Nav.Item>
                        </Row>
                    </Navbar.Collapse>
                </Container>
                </Navbar>
            </div>
        )
    }
} 

export default AdminNavbar; 