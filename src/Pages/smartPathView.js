import React, { Component } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';
import Link from 'react-router-dom/Link';


class SmartPathView extends Component {
   constructor(props) {
    super(props);

    this.state = {
    };
  }
  render() {
    return (
    <div className = "admin-page">
     <Link to = "/admin"> <Button className = 'btn btn-primary' onClick = {this.props.moveToSmartpath}> Return to Home </Button> </Link>
        <h3> Smartpath Folder </h3>
        <div> 
        </div>
          <Button className = "btn btn-primary"> <small> Add to folder </small> </Button>
    </div>
    )
  }
}

export default SmartPathView;
