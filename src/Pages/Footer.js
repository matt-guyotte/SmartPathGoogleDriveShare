import React from 'react'; 
import {Navbar, Nav} from 'react-bootstrap'; 
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import Link from 'react-router-dom/Link'; 
import GoogleBtn from './GoogleBtn';
import { Redirect } from 'react-router';

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            access: false,
            redirect: false,
        })
        this.callLogout = this.callLogout.bind(this);
        this.setFixed = this.setFixed.bind(this);
    }

    componentDidMount() {
        fetch('/apicall')
        .then(res => res.json())
        .then(res => this.setState({access: res}))
        this.setFixed();
    }

    async callLogout() {
        await fetch('/logout');
        this.setState({
            redirect: true
        })
    }

	setFixed() {
        var hasVScroll = document.body.scrollHeight > document.body.clientHeight;
		 if (window.innerWidth > document.body.clientWidth) {
	        document.getElementById("footer").style.position = "relative";
	        document.getElementById("footer").style.bottom = "0";
		 }
		 else {
		 	document.getElementById("footer").style.position = "fixed";
		 	document.getElementById("footer").style.bottom = 0;
		 }
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
                <div id = "footer">
                    <p className = "footer-objects"> <small> ©{new Date().getFullYear()} Smartpath Ed. </small> </p> 
                </div>
            )
        }
        if(!this.state.redirect && !this.state.access) {
            return (
                <div id = "footer">
                    <p className = "footer-objects"> <small> ©{new Date().getFullYear()} Smartpath Ed. </small> </p> 
                </div>
            )
        }
    }
} 

export default Footer; 