import React from 'react';
import $S from "../interface/stack.js";
import $$ from '../interface/global';
import Api from "../common/Api";

import Home from "./components/Home";
import Instructions from "./components/Instructions";

var baseapi = $$.baseapi;
var api = $$.api;

var homeListItems = [];

var instructionsListItems = [];
var LOGO_URL = "";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        var self = this;
        $S.loadJsonData(null, [baseapi+api + "?" + $S.getRequestId()], function(response) {
            if ($S.isObject(response)) {
                LOGO_URL = response.LOGO_URL;
                homeListItems = response.homeListItems;
                instructionsListItems = response.instructionsListItems;
            } else {
                $S.log("Invalid response (appData):" + response);
            }
            self.setState({isLoaded: true});
        }, null, null, Api.getAjaxApiCallMethod());
    }
    handleClick() {
        this.setState({
            btnActive: !this.state.btnActive
        });
        this.fetchData();
    }
    render() {
        var logoUrl = baseapi + LOGO_URL;
        return (<div className="container">
                    <Home logoUrl={logoUrl} state={this.state} listItems={homeListItems}/>
                    <Instructions listItems={instructionsListItems}/>
                </div>
        );
    }
}

export default App;
