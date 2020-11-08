import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
// import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HashRouter as Router, Route, Switch } from "react-router-dom" 
 
import Search from './Pages/search';
import adminPortal from './Pages/adminPortal'
import Login from './Pages/login';
import Register from './Pages/register';
import Privacy from './Pages/Privacy';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <div>
        <Route path = "/" exact component = {Search}/>
        <Route path = "/admin" component = {adminPortal} />
        <Route path = "/signin" component = {Register}/>
        <Route path = "/login" component = {Login}/>
        <Route path = "/privacy" component = {Privacy}/>
        </div>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
