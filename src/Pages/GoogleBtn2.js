import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';


const CLIENT_ID = '844099065946-5jkm6neret5ij7m2gf6285bs1docg64r.apps.googleusercontent.com';


class GoogleBtn2 extends Component {
   constructor(props) {
    super(props);

    this.state = {
      isLogined: false,
      accessToken: ''
    };

    this.checkLogin = this.checkLogin.bind(this); 
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
    this.logout = this.logout.bind(this);
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
    this.loginSend = this.loginSend.bind(this);
  }

  checkLogin() { 
    if(this.state.accessToken != '') {
      //make a post request to server
    }
  }

  logout (response) {
    this.setState(state => ({
      isLogined: false,
      accessToken: ''
    }));
  }

  handleLoginFailure (response) {
    alert('Failed to log in')
  }

  handleLogoutFailure (response) {
    alert('Failed to log out')
  }

  async loginSend () {
    
  }

  render() {
    return (
    <div>
      { this.state.isLogined ?
        <GoogleLogout
          clientId={ CLIENT_ID }
          buttonText='Logout'
          onLogoutSuccess={ this.logout }
          onFailure={ this.handleLogoutFailure }
        >
        </GoogleLogout>
        : <GoogleLogin
          clientId={ CLIENT_ID }
          buttonText='Login'
          onSuccess={ this.props.login }
          onFailure={ this.handleLoginFailure }
          accessType = 'offline'
          responseType='code'
          scope = 'https://www.googleapis.com/auth/drive.files'
        />
  }

    </div>
    )
  }
}

export default GoogleBtn2;
