import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';


const CLIENT_ID = '844099065946-5jkm6neret5ij7m2gf6285bs1docg64r.apps.googleusercontent.com';


class GoogleBtn extends Component {
   constructor(props) {
    super(props);

    this.state = {
      isLogined: false,
      accessToken: ''
    };

    this.login = this.login.bind(this);
    this.checkLogin = this.checkLogin.bind(this); 
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
    this.logout = this.logout.bind(this);
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
    this.loginSend = this.loginSend.bind(this);
  }

  login (response) {
    if(response.accessToken){
      this.setState(state => ({
        isLogined: true,
        accessToken: response.accessToken
      }));
    }
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
    this.props.login();
    await fetch('/accesstokentest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        accessToken: this.state.accessToken
      })
    }) 
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
        </GoogleLogout>: <GoogleLogin
          clientId={ CLIENT_ID }
          buttonText='Login'
          onSuccess={ this.loginSend }
          onFailure={ this.handleLoginFailure }
          cookiePolicy={ 'single_host_origin' }
          responseType='code,token'
        />
      }
      { this.state.accessToken ?  <h5>Your Access Token: <br/><br/> { this.state.accessToken }</h5> : null }

    </div>
    )
  }
}

export default GoogleBtn;
