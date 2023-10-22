import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";

import $S from '../interface/stack.js';


import Config from "./common/Config";

import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "isLoggedIn": false,
            "isLoggedInDataLoaded": false,
            "loggedInStatus": "NOT_LOGGED_IN",
            "user": {}
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
    }
    handleSuccessfulAuth(response, callback) {
        this.setState({
            "isLoggedIn": true,
            "isLoggedInDataLoaded": true,
            "loggedInStatus": "LOGGED_IN"
        }, function() {
            $S.callMethod(callback);
        });
    }
    handleLogout() {
        this.setState({
            "isLoggedIn": false,
            "isLoggedInDataLoaded": false,
            "loggedInStatus": "NOT_LOGGED_IN",
            "user": {}
        });
    }
    componentDidMount() {
        console.log("App:componentDidMount");
    }
    render () {
        var methods = {
            "handleSuccessfulAuth": this.handleSuccessfulAuth,
            "handleLogout": this.handleLogout
        };
        return <BrowserRouter><Switch>
            <Route exact
              path={Config.pages.home}
              render={props => (
                <Home {...props} state={this.state} methods={methods} />
              )}
            />
            <Route
              path={Config.pages.login}
              render={props => (
                <Login {...props} state={this.state} methods={methods} />
              )}
            />
            <Route
              path={Config.pages.dashboard}
              render={props => (
                <Dashboard {...props} state={this.state} methods={methods} />
              )}
            />
            <Route exact
              render={props => (
                <Home {...props} state={this.state} methods={methods} />
              )}
            />
            </Switch></BrowserRouter>
    }
}

export default App;
