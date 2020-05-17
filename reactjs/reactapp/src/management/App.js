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
        this.printDataTemplate = {};
        this.printData = {};
        this.printTotalRow = {};
        this.addNewRow = this.addNewRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }
    getFormRowTemplate(templateName) {
        if ($S.isString(templateName) && !$S.isUndefined(this.formData[templateName])) {
            return $S.clone(this.formData[templateName]);
        }
        return null;
    }
    getPrintDataTemplate(templateName) {
        if ($S.isString(templateName) && !$S.isUndefined(this.printDataTemplate[templateName])) {
            return $S.clone(this.printDataTemplate[templateName]);
        }
        return null;
    }
    adjustFormRowFieldsRowId(formRowFields) {
        if (!$S.isArray(formRowFields)) {
            return [];
        }
        formRowFields = formRowFields.filter(function(el, index, arr) {
            if ($S.isObject(el)) {
                return true;
            }
            return false;
        });
        for(var i=0; i<formRowFields.length; i++) {
            formRowFields[i].formRowId = "row-" + i;
        }
        return formRowFields;
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
        updatedRowFields = this.adjustFormRowFieldsRowId(updatedRowFields);
        this.setState({formRowFields: updatedRowFields}, function() {
            var formValues = this.getFormValues();
            this.formData["formValues"] = formValues;
            this.setState({formValues: formValues});
        });
        // console.log(this.state.formRowFields);
    }
    addNewRow(templateName) {
        if($S.isString(templateName)) {
            var templateData = this.getFormRowTemplate(templateName);
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
                self.printDataTemplate = response;
            } else {
                $S.log("Invalid response (printData):" + response);
            }
            self.setState({isLoaded: true});
        }, function() {
            self.printData["fieldRow"] = self.getPrintDataTemplate("printBodyUser");
            self.printData["type1RowTemplate"] = self.getPrintDataTemplate("type1RowTemplate");
            self.printData["printHeading"] = self.getPrintDataTemplate("printHeading");
            self.printData["printFooter"] = self.getPrintDataTemplate("printFooter");
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
            formRowFields.push({templateData: self.getFormRowTemplate("userDetails"),
                formRowId: "row-0", templateName: "userDetails"});//"form-row-"+$S.getUniqueNumber()
            self.setState({formRowFields: formRowFields});
        }, null, Api.getAjaxApiCallMethod());
    }
    handleFormSubmit(targetName) {
        var formValues = this.getFormValues(), template = {};
        this.setState({formValues: formValues});
        this.formData["formValues"] = formValues;
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
        // console.log(this.state.formRowFields);
        this.printData["fieldRow"] = [];
        this.printData["printFooter"] = [];
        this.printData["totalRow"] = [];
        var Print = PrintHelper(this.printData, this.formData.formValues);
        var printRowData = PrintHelper.getDetails(Print);
        var footerTemplate = null;
        for(var i=0; i<printRowData.length; i++) {
            if ($S.isString(printRowData[i].name)) {
                template = this.getPrintDataTemplate("printBodyUser");
                if (footerTemplate === null) {
                    footerTemplate = this.getPrintDataTemplate("printFooter");
                }
                TemplateHelper.replaceTextPattern(footerTemplate, "acceptance", printRowData[i].name);
                this.printData["printFooter"] = footerTemplate;
            } else if ($S.isString(printRowData[i].distance)) {
                template = this.getPrintDataTemplate("type1RowTemplate");
            } else if ($S.isString(printRowData[i].totalAmount)) {
                template = this.getPrintDataTemplate("totalRow");
                TemplateHelper.setTemplateTextByFormValues(template, printRowData[i]);
                this.printTotalRow = template;
                if (footerTemplate === null) {
                    footerTemplate = this.getPrintDataTemplate("printFooter");
                }
                TemplateHelper.replaceTextPattern(footerTemplate, "totalAmount", printRowData[i].totalAmount);
                TemplateHelper.replaceTextPattern(footerTemplate, "totalAmountText", printRowData[i].totalAmountText);
                this.printData["printFooter"] = footerTemplate;
                continue;
            } else {
                template = this.getPrintDataTemplate("type2RowTemplate");
            }
            TemplateHelper.setTemplateTextByFormValues(template, printRowData[i]);
            this.printData["fieldRow"].push(template);
        }
        console.log(printRowData);
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
                    <PrintDisplay printData={this.printData} totalRow={this.printTotalRow} backIconUrl={backIconUrl}/>
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






