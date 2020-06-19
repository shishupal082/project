import React, { Component } from "react";
import axios from "axios";

import Config from "../common/Config";
import Helper from "../common/Helper";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          email: "",
          password: "",
          loginErrors: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
    }
    checkForRedirect() {
        if (this.props.state.isLoggedInDataLoaded) {
            if (this.props.state.isLoggedIn === true) {
                this.props.history.push(Config.pages.dashboard);
            }
        }
    }
    componentDidMount() {
        console.log("Login:componentDidMount");
        var self = this;
        if (this.props.state.isLoggedInDataLoaded) {
            this.checkForRedirect();
        } else {
            Helper.isLogin(this.props.methods.handleSuccessfulAuth,
                function() {
                    self.checkForRedirect();
                }
            );
        }
    }
    handleSubmit(event) {
        const { email, password } = this.state;
        axios
          .get(Config.loginRequestApi,
            {
              user: {
                email: email,
                password: password
              }
            },
            { withCredentials: true }
          )
          .then(response => {
            if (response.data.logged_in) {
                this.props.methods.handleSuccessfulAuth(response.data);
                this.props.history.push(Config.pages.dashboard);
            }
          })
          .catch(error => {
            console.log("login error", error);
          });
        event.preventDefault();
    }

    render() {
        return (
          <center>
            <div><h1>Login</h1></div>
            <form onSubmit={this.handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
              <button type="submit">Login</button>
            </form>
          </center>
        );
    }
}
