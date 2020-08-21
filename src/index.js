import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
// import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HashRouter as Router, Route, Switch } from "react-router-dom" 
 
import FrontPage from './Pages/front'; 
import Search from './Pages/search';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <div>
        <Route exact path = "/" component = {FrontPage}/>
        <Route path = "/search" component = {Search}/>
        </div>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
