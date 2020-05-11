import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";
import $$ from '../interface/global';
import Api from "../common/Api";

import Home from "./components/Home";
import Instructions from "./components/Instructions";
import Form from "./components/Form";
import PrintDisplay from "./components/PrintDisplay";


var baseapi = $$.baseapi;
var api = $$.api;
var formApi = $$.formApi;
var printDataApi = $$.printDataApi;

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
        this.printData = {};
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

        $S.loadJsonData(null, [baseapi + printDataApi + "?" + $S.getRequestId()], function(response) {
            if ($S.isObject(response)) {
                self.printData = response;
            } else {
                $S.log("Invalid response (printData):" + response);
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
        var printDisplay = <PrintDisplay state={this.state} printData={this.printData}/>;
        var form = <Form state={this.state} formHeading={this.formHeading} formData={this.formData}/>;
        var home = <Home logoUrl={logoUrl} state={this.state} listItems={homeListItems}/>;
        var instructions = <Instructions listItems={instructionsListItems}/>;
         return (<div className="container"><Router><Switch>
                  <Route exact path="/">
                    {home}
                  </Route>
                  <Route exact path="/form">
                    {form}
                  </Route>
                  <Route exact path="/credits">
                    {printDisplay}
                  </Route>
                  <Route path="/instructions">
                    {instructions}
                  </Route>
                  <Route>
                    {home}
                  </Route>
            </Switch></Router></div>);
    }
}

export default App;






