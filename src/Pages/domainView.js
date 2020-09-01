import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Link from 'react-router-dom/Link';


class DomainView extends Component {
   constructor(props) {
    super(props);
    this.state = {
      domains: [],
      newDomain: '',
      isOpen: false,
    };
    this.addDomain = this.addDomain.bind(this);
    this.handleChangeDomain = this.handleChangeDomain.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  componentDidMount() {
    fetch("/domains")
    .then(res => res.json())
    .then(res => this.setState({domains: res[0].domains}))
  }

  handleChangeDomain(event) {
    this.setState({
      newDomain: event.target.value
    })
  }

  async addDomain() {
    fetch('/adddomain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        domain: this.state.newDomain
      })
    })
    fetch("/domains")
    .then(res => res.json())
    .then(res => this.setState({domains: res}))
  }

  render() {
    return (
    <div className = "admin-page">
      <Container fluid>
        <Button className = 'btn btn-primary' onClick = {this.props.moveToDomains}> Return to Home </Button>
        <h3> Domains </h3>
        <div className = "domain-box"> 
            <h4> Current Domains </h4>
            {this.state.domains.map(domains => (
            <div className = "file-box-search" key={domains}>
                <h4> {domains} </h4>
            </div>
            ))}
        </div>
        <div>
          <Button className = "btn btn-primary" onClick={this.openModal}> <small> Add a new domain or user </small> </Button>
        </div>
      </Container>
      <Modal show={this.state.isOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Domain</Modal.Title>
          </Modal.Header>
          <Modal.Body>Enter domain here:</Modal.Body>
          <Form onSubmit = {this.addDomain}>
          <Form.Control input = "true" name = "email" value= {this.state.newDomain || ''} placeholder="Enter domain" onChange = {this.handleChangeDomain} required />
          <Button className = "btn btn-primary" type = 'submit'> Submit </Button>
          </Form>
          <Modal.Body> Make sure to add @ before domain name. example: <strong> @smartpathed.com </strong> </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
    )
  }
}

export default DomainView;
