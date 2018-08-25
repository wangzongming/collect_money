import React, { Component } from "react";
import { HashRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router";
import { connect } from "react-redux"; 
import { createRoute } from "./global";
import { NoPage } from "./pages";
import { Login } from "./pages";
import { blank } from "./layout";
class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/login' component={blank(Login)} />
          {createRoute()}
          <Route component={NoPage} />
        </Switch>
      </Router>
    );
  }
}

export default connect()(App);
