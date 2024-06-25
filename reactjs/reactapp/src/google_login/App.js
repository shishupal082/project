import React from 'react';
import GoogleLogin from 'react-google-login';

// import $S from "../interface/stack.js";

// import AppHandler from "../common/app/common/AppHandler";

// import AppComponent from "../common/app/components/AppComponent";

// import DataHandler from "./common/DataHandler";
// import Config from "./common/Config";

// AppHandler.setGtag(Config.gtag);
// var GoogleLoginClientSecretId = "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";
var GoogleLoginClientId = "144550226343-8nrgef3cmgbvj0sandlin22kk5elml83.apps.googleusercontent.com";

var GoogleData = {};
var self;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        self = this;
    }
    responseGoogleSuccess(response) {
        GoogleData = response;
        self.setState({"isLoaded": true});
        console.log(response);
    }
    responseGoogleFailure(response) {
        GoogleData = response;
        self.setState({"isLoaded": true});
        console.log(response);
    }
    render() {
        return <div><center><GoogleLogin
            clientId={GoogleLoginClientId}
            buttonText="Login with Google"
            onSuccess={this.responseGoogleSuccess}
            onFailure={this.responseGoogleFailure}
            cookiePolicy={'single_host_origin'}
          /></center>
          <div>{JSON.stringify(GoogleData)}</div></div>;
    }
}

export default App;

