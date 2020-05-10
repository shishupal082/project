import React from 'react';
import $S from "../interface/stack.js";
import $$ from '../interface/global';
import Api from "../common/Api";

import Home from "./components/Home";
import Instructions from "./components/Instructions";
import Form from "./components/Form";

var baseapi = $$.baseapi;
var api = $$.api;
var formApi = $$.formApi;

if ($S.isArray(formApi)) {
    for(var i=0; i<formApi.length; i++) {
        formApi[i] = baseapi + formApi[i] + "?" + $S.getRequestId();
    }
}

var homeListItems = [];
var instructionsListItems = [];
var LOGO_URL = "";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.formData = {};
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        var self = this;
        $S.loadJsonData(null, [baseapi + api + "?" + $S.getRequestId()], function(response) {
            if ($S.isObject(response)) {
                LOGO_URL = response.LOGO_URL;
                homeListItems = response.homeListItems;
                instructionsListItems = response.instructionsListItems;
                self.formHeading = response.formHeading;
            } else {
                $S.log("Invalid response (appData):" + response);
            }
            self.setState({isLoaded: true});
        }, null, null, Api.getAjaxApiCallMethod());

        $S.loadJsonData(null, formApi, function(response) {
            if ($S.isObject(response)) {
                for(var key in response) {
                    if (self.formData[key]) {
                        alert("Duplicate entry in formData: " + key);
                    }
                    self.formData[key] = response[key];
                }
            } else {
                $S.log("Invalid response (formData):" + response);
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
        var logoUrl = false;
        if ($S.isString(LOGO_URL) && LOGO_URL.length > 0) {
            logoUrl = baseapi + LOGO_URL;
        }
        return (<div className="container">
                    <Form state={this.state} formHeading={this.formHeading} formData={this.formData}/>
                    <Home logoUrl={logoUrl} state={this.state} listItems={homeListItems}/>
                    <Instructions listItems={instructionsListItems}/>
                </div>
        );
    }
}

export default App;






