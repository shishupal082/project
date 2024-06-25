import React from "react";
import {Link} from "react-router-dom";
// import axios from "axios";

import Config from "../common/Config";
import Helper from "../common/Helper";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
    }
    handleLogoutClick() {
        // axios
        //   .delete("http://localhost:3000/logout", { withCredentials: true })
        //   .then(response => {
        //     this.props.handleLogout();
        //   })
        //   .catch(error => {
        //     console.log("logout error", error);
        //   });
        this.props.methods.handleLogout();
        this.props.history.push(Config.pages.home);
    }
    componentDidMount() {
        console.log("Home:componentDidMount");
        Helper.isLogin(this.props.methods.handleSuccessfulAuth);
    }
    render() {
        var login = null;
        var logout = null;
        var dashboard = null;
        if (this.props.state.isLoggedIn) {
            logout = <Link to={Config.pages.home} onClick={this.handleLogoutClick}>Logout</Link>
            dashboard = <Link to={Config.pages.dashboard}>|Dashboard</Link>
        } else {
            login = <Link to={Config.pages.login}>Login</Link>
        }
        return (
          <center>
            <h1>Home</h1>
            <h1>Status: {this.props.state.loggedInStatus}</h1>
            <div>{login}{logout}{dashboard}</div>
          </center>
        );
    }
}

export default Home;
