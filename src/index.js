import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
// import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HashRouter as Router, Route, Switch } from "react-router-dom" 
 
import FrontPage from './Pages/front'; 
import Search from './Pages/search';
import Auth from './Pages/extension';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <div>
        <Route exact path = "/" component = {FrontPage}/>
        <Route path = "/search" component = {Search}/>
        <Route path = "/user_auth" component = {Auth}/>
        </div>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
