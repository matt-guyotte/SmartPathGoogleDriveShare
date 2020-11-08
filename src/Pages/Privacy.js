import React from 'react'; 
import TopNavbar from './navbar'; 
import {Container} from 'react-bootstrap'; 
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap'; 
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap'; 
import { Redirect } from "react-router-dom";
import Link from 'react-router-dom/Link';



class Privacy extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          loginResult: false,
          redirect: '',
          email: ''
        }
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.submitFunction = this.submitFunction.bind(this);
        this.submitFunction2 = this.submitFunction2.bind(this);
        this.navbarConnect = this.navbarConnect.bind(this); 
    }

    handleChangeEmail(event) {
      this.setState({
        email: event.target.value
      })
    }

    handleChangePassword(event1) {
      this.setState({
        password: event1.target.value
      })
    }

    async submitFunction(event) {
      event.preventDefault();
      await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        })
      }) 
      this.submitFunction2();
    }

    async submitFunction2() {
      fetch('/login2')
        .then(res => res.text())
        .then(res => this.setState({loginResult: res}))
      
    }


    navbarConnect() {
      fetch('/navbarcall')
            .then(res => res.json())
            .then(res => this.setState({loggedIn: res}))
    }

    render() {
      return (
        <div>
            <TopNavbar />
            <Container>
                <Row className = "privacy-title">
                    <Col>
                        <h2> <strong> Privacy policy </strong> </h2>
                        <p> <small> last updated: November 8th 2020 </small> </p>
                    </Col>
                </Row>
                <Row className = "privacy-content">
                    <Col>
                        <p>This privacy policy sets out how SMARTpath Education Services, LLC uses and protects any information that you give SMARTpath Education Services, LLC when you use this website. SMARTpath Education Services, LLC is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement. SMARTpath Education Services, LLC may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes. This policy is effective from 1st day of March, 2013.</p>
                        <br />
                        <p> <strong> What We Collect </strong> </p>
                        <br />
                            <p> We may collect the following information:
                            Name and job title
                            Contact information including email address
                            Demographic information such as postcode, preferences and interests
                            Other information relevant to customer surveys and/or offers
                            </p>
                        <p> <strong> What We Do With the Information We Gather </strong> </p>
                        <br />
                        <p>
                            We require this information to understand your needs and provide you with a better service, and in particular for the following reasons: 
                            Internal record keeping
                            We may use the information to improve our products and services.
                            We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.
                            From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customize the website according to your interests.
                        </p>
                        <p> <strong> Security </strong> </p>
                        <br />
                        <p>
                            We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.
                        </p>
                        <p> <strong> How We Use Cookies </strong> </p>
                        <br />
                        <p>
                            A cookie is a small file which asks permission to be placed on your computer’s hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences. We 
                        </p>
                    </Col>
                    <Col>
                        <p> use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system. Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us. You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website. </p>
                        <p> <strong> Links to Other Websites </strong>
                        <br />
                            Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question. 
                        </p>
                        <p> <strong> Controlling Your Personal Information </strong></p>
                        <br />
                            <p>You may choose to restrict the collection or use of your personal information in the following ways:
                            Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes.
                            If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by emailing us ( info@smartpathed.com)
                            We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen. You may request details of personal information which we hold about you under the Data Protection Act 1998. A small fee will be payable. If you would like a copy of the information held on you please contact us ( info@smartpathed.com. If you believe that any information we are holding on you is incorrect or incomplete, please write to or email us as soon as possible, at the above address. We will promptly correct any information found to be incorrect.
                            </p>
                    </Col>
                </Row>
                <Row className = "smartpath-section-title">
                    <Col>
                        <h4> <strong> THINK.FUTURE.WORKFORCE.CONNECT APP </strong> </h4>
                    </Col>                
                </Row>
                <Row className = "privacy-content"> 
                    <Col>
                        <p> <strong> What Google Drive Information We Collect: </strong>
                            As part of our Think. Future. Workforce. Connect app, we collect the following Google Drive information:
                            Email
                            Full permissive use of your google classroom drive folders, in order to the export and upload our lesson plans upon request from the user. 
                        </p>       
                    </Col>
                    <Col>
                        <p> <strong> What We Do With Your Drive Information: </strong>
                            As part of the flow for our app, we use the metadata from your classroom folders in order to export and download our smartpath lesson plans into them. We do not share your information with any third parties. For more general information, refer to the “What we do with your information” section outlined earlier in this policy.                                                        
                            As referred to in the “What We Do With The Information We Gather” section, from time to time, we may also use your information to contact you for market research purposes, to help improve our services. 
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
      )
    }
} 

export default Privacy; 