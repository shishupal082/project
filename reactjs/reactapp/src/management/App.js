import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";
import $$ from '../interface/global';
import Api from "../common/Api";
import TemplateHelper from "../common/TemplateHelper";
import PrintHelper from "./PrintHelper";

import Home from "./components/Home";
import Instructions from "./components/Instructions";
import Form from "./components/Form";
import PrintDisplay from "./components/PrintDisplay";
import initialize from "./Initialize";

var baseapi = $$.baseapi;
var homeDataApi = baseapi + $$.homeDataApi;
var printDataApi = baseapi + $$.printDataApi;
var backIconUrl = baseapi + $$.backIconUrl;
var formPostUrl = baseapi + $$.formPostUrl;
var initialPrintDataApi = null;
if ($S.isString($$.initialPrintDataApi)) {
    initialPrintDataApi = baseapi + $$.initialPrintDataApi;
}


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
            isLoaded: false,
            formRowFields: [],
            formValues: []
        };
        this.formData = {"formValues": []};
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
            formValue["templateName"] = this.state.formRowFields[i]["templateName"];
            TemplateHelper(this.state.formRowFields[i].templateData).generateFormValues(formValue);
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
                formRowFields.push({templateData: templateData,
                                formRowId: "row-" + this.state.formRowFields.length,//"form-row-"+$S.getUniqueNumber()
                                templateName: templateName});
                this.setState({formRowFields: formRowFields});
            }
        }
        // console.log(this.state.formRowFields);
    }
    handleChange(e, fieldName, currentValue, formRowId) {
        var formRowFields = this.state.formRowFields;
        var attr = {"removeClass": "is-invalid", "setValue": currentValue};
        TemplateHelper.updateFieldByAttr(formRowFields, formRowId, fieldName, attr);
        this.setState({formRowFields: formRowFields});
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        var self = this;
        if ($S.isString(initialPrintDataApi)) {
            initialize(self, $S, TemplateHelper, Api, initialPrintDataApi);
        }
        $S.loadJsonData(null, [homeDataApi + "?" + $S.getRequestId()], function(response) {
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

        $S.loadJsonData(null, [printDataApi + "?" + $S.getRequestId()], function(response) {
            if ($S.isObject(response)) {
                self.printData = response;
            } else {
                $S.log("Invalid response (printData):" + response);
            }
            self.setState({isLoaded: true});
        }, function() {
            self.printData["fieldRow"] = [$S.clone(self.printData["printBodyUser"])];
        }, null, Api.getAjaxApiCallMethod());

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
                formRowId: "row-0", templateName: "userDetails"});//"form-row-"+$S.getUniqueNumber()
            self.setState({formRowFields: formRowFields});
        }, null, Api.getAjaxApiCallMethod());
    }
    handleFormSubmit(targetName) {
        var formValues = this.getFormValues(), template = {};
        this.setState({formValues: formValues});
        this.formData["formValues"] = formValues;
        this.printData["fieldRow"] = [];
        for(var i=0; i<formValues.length; i++) {
            if ($S.isString(formValues[i].name)) {
                template = $S.clone(this.printData["printBodyUser"]);
            } else if ($S.isString(formValues[i].distance)) {
                template = $S.clone(this.printData["type1RowTemplate"]);
            } else {
                template = $S.clone(this.printData["type2RowTemplate"]);
            }
            TemplateHelper.setTemplateTextByFormValues(template, formValues[i]);
            this.printData["fieldRow"].push(template);
        }
        var validationResult = TemplateHelper.validateData(this.formData.formValues);
        if (validationResult.status === "FAILURE") {
            var formRowFields = this.state.formRowFields;
            TemplateHelper.updateFieldByAttr(formRowFields, validationResult.formRowId, validationResult.fieldName,
                        {"addClass": "is-invalid"});
            this.setState({formRowFields: formRowFields});
            window.alert(validationResult.alertMessage);
        } else if (targetName !== "printDisplay") {
            window.alert(validationResult.alertMessage);
        }
        console.log(this.state.formRowFields);
        var Print = PrintHelper(this.formData.formValues);
        console.log(PrintHelper.getDetails(Print));
        // console.log("App.handleFormSubmit:");
        // console.log(this.formData.formValues);
    }
    render() {
        var logoUrl = false;
        if ($S.isString(LOGO_URL) && LOGO_URL.length > 0) {
            logoUrl = baseapi + LOGO_URL;
        }
        var form = <Form state={this.state} formHeading={this.formHeading}
                    formData={this.formData} formPostUrl={formPostUrl}
                    addNewRow={this.addNewRow} removeRow={this.removeRow}
                    handleChange={this.handleChange} handleFormSubmit={this.handleFormSubmit}/>;
        var home = <Home logoUrl={logoUrl} state={this.state} listItems={homeListItems}/>;
         return (<div className="container"><BrowserRouter><Switch>
                  <Route exact path="/">
                    {home}
                  </Route>
                  <Route exact path="/form">
                    {form}
                  </Route>
                  <Route exact path="/print">
                    <PrintDisplay printData={this.printData} backIconUrl={backIconUrl}/>
                  </Route>
                  <Route path="/instructions">
                    <Instructions listItems={instructionsListItems}/>
                  </Route>
                  <Route>
                    {home}
                  </Route>
            </Switch></BrowserRouter></div>);
    }
}

export default App;






