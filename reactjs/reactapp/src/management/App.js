import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";
import $$ from '../interface/global';
import Api from "../common/Api";
import TemplateHelper from "../common/TemplateHelper";

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
            isLoaded: false,
            formRowFields: [],
            formValues: []
        };
        this.formData = {};
        this.printData = {};
        this.addNewRow = this.addNewRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }
    getFormValues() {
        var formValues = [], formValue = {};
        for(var i=0; i<this.state.formRowFields.length; i++) {
            formValue = {};
            formValue["formRowId"] = this.state.formRowFields[i]["formRowId"];
            TemplateHelper(this.state.formRowFields[i].templateData).getFieldData(formValue);
            formValues.push(formValue);
        }
        // console.log(formValues);
        return formValues;
    }
    removeRow(formRowId) {
        if (!$S.isString(formRowId)) {
            return false;
        }
        var updatedRowFields = this.state.formRowFields.filter(function(el, index, arr) {
            if (el.formRowId === formRowId) {
                return false;
            }
            return true;
        });
        this.setState({formRowFields: updatedRowFields});
        // console.log(this.state.formRowFields);
    }
    addNewRow(templateName) {
        if($S.isString(templateName)) {
            var templateData = $S.clone(this.formData[templateName]);
            if (templateData) {
                var formRowFields = this.state.formRowFields;
                formRowFields.push({templateData: templateData, formRowId: "form-row-"+$S.getUniqueNumber()});
                this.setState({formRowFields: formRowFields});
            }
        }
        // console.log(this.state.formRowFields);
    }
    handleClick(e, fieldName, currentValue, formRowId) {

    }
    handleChange(e, fieldName, currentValue, formRowId) {
        var formRowFields = this.state.formRowFields.filter(function(item, index, arr) {
            if (formRowId === item.formRowId) {
                TemplateHelper(item.templateData).updateField(fieldName, currentValue);
            }
            return true;
        });
        this.setState({formRowFields: formRowFields});
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
        }, function() {
            var formRowFields = self.state.formRowFields;
            formRowFields.push({templateData: self.formData["userDetails"],
                formRowId: "form-row-"+$S.getUniqueNumber()});
            self.setState({formRowFields: formRowFields});
        }, null, Api.getAjaxApiCallMethod());
    }
    handleFormSubmit() {
        var formValues = this.getFormValues(), fieldRow;
        this.setState({formValues: formValues});
        this.printData["fieldRow"] = [];
        var totalRow = this.printData["totalRow"];
        for(var i=0; i<formValues.length; i++) {
            if ($S.isString(formValues[i].name)) {
                fieldRow = TemplateHelper($S.clone(this.printData["printBodyUser"])).assignDisplayText(formValues[i]);
            } else if ($S.isString(formValues[i].distance)) {
                fieldRow = TemplateHelper($S.clone(this.printData["type1RowTemplate"])).assignDisplayText(formValues[i]);
            } else {
                fieldRow = TemplateHelper($S.clone(this.printData["type2RowTemplate"])).assignDisplayText(formValues[i]);
            }
            this.printData["fieldRow"].push(fieldRow);
        }
        this.printData["fieldRow"].push(totalRow);
        console.log(formValues);
    }
    render() {
        var logoUrl = false;
        if ($S.isString(LOGO_URL) && LOGO_URL.length > 0) {
            logoUrl = baseapi + LOGO_URL;
        }
        var printDisplay = <PrintDisplay state={this.state} printData={this.printData}/>;
        var form = <Form state={this.state} formHeading={this.formHeading} formData={this.formData}
                    addNewRow={this.addNewRow} removeRow={this.removeRow}
                    handleChange={this.handleChange} handleFormSubmit={this.handleFormSubmit}/>;
        var home = <Home logoUrl={logoUrl} state={this.state} listItems={homeListItems}/>;
        var instructions = <Instructions listItems={instructionsListItems}/>;
         return (<div className="container"><BrowserRouter><Switch>
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
            </Switch></BrowserRouter></div>);
    }
}

export default App;






