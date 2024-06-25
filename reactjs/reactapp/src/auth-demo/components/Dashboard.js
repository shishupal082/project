import React from "react";

import Config from "../common/Config";
import Helper from "../common/Helper";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
    }
    checkForRedirect() {
        if (this.props.state.isLoggedInDataLoaded) {
            if (this.props.state.isLoggedIn === false) {
                this.props.history.push(Config.pages.home);
            }
        }
    }
    componentDidMount() {
        console.log("Dashboard:componentDidMount");
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
    goBack() {
        this.props.history.push(Config.pages.home);
    }
    render() {
        return (
            <center>
                <div><button onClick={this.goBack}>Go Back</button></div>
                <div>
                    <h1>Dashboard</h1>
                    <h1>Status: {this.props.state.loggedInStatus}</h1>
                </div>
            </center>
          );
    }
};

export default Dashboard;
