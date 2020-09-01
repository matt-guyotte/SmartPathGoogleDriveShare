import React, { Component } from 'react'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';
import Link from 'react-router-dom/Link';


class CreateNew extends Component {
   constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
    <div className = "admin-page">
     <Link to = "/admin"> <Button className = 'btn btn-primary' onClick = {this.props.moveToCreateNew}> Return to Home </Button> </Link>
        <h3> Create New Properties </h3>
        <div> 
            <h4> What do you want to add? </h4>
            <select>
                <option>New Subject Tag</option>
                <option>New Grade Level</option>
                <option>New Industry Tag</option>
            </select>
        </div>
        <div>

        </div>
    </div>
    )
  }
}

export default CreateNew;
