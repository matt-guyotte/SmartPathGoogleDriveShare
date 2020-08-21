import React from 'react'; 
import {Navbar, Nav} from 'react-bootstrap'; 
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Link from 'react-router-dom/Link'; 

class TopNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
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
                        <Nav.Item> <Nav.Link> <Link to = "/"> Home  </Link> </Nav.Link> </Nav.Item> 
                        <Nav.Item> <Nav.Link> <Link to = "/search"> Search </Link> </Nav.Link> </Nav.Item>
                        <Nav.Item> <Nav.Link> <Link to = "/"> Logout </Link> </Nav.Link></Nav.Item>
                        </Row>
                    </Navbar.Collapse>
                </Container>
                </Navbar>
            </div>
        )
    }
} 

export default TopNavbar; 