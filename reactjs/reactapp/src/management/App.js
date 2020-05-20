import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";
import $$$ from '../interface/global';
import Api from "../common/Api";
import TemplateHelper from "../common/TemplateHelper";
import PrintHelper from "./PrintHelper";

import Home from "./components/Home";
import Instructions from "./components/Instructions";
import Form from "./components/Form";
import PrintDisplay from "./components/PrintDisplay";
import initialize from "./Initialize";

var baseapi = $$$.baseapi;
var homeDataApi = baseapi + $$$.homeDataApi;
var printDataApi = baseapi + $$$.printDataApi;
var backIconUrl = baseapi + $$$.backIconUrl;
var formPostUrl = baseapi + $$$.formPostUrl;
var initialPrintDataApi = null;
var initialDataFile = $S.getLocalStorage().get("item1");
if ($S.isString($$$.initialPrintDataApi) && initialDataFile.status) {
    // name:actualData1.json,startTime:2020-05-20T20:00,duration:10
    // localStorage.setItem("name:actualData1.json,startTime:2020-05-20T20:00,duration:10");
    var value = initialDataFile.value;
    var valueArr = value.split(",");
    if (valueArr.length === 3) {
        var t = valueArr[1].split("startTime:");
        var duration = valueArr[2].split(":");
        if (t.length === 2 && duration.length === 2) {
            t = $S.getDT().getDateObj(t[1]);
            if ($S.isNumeric(duration[1])) {
                t.setHours(t.getHours()+duration[1]*1);
                if (t.getTime() > new Date().getTime()) {
                    initialDataFile = valueArr[0].split("name:")[1];
                    initialPrintDataApi = baseapi + $$$.initialPrintDataApi + initialDataFile;
                }
            }
        }
    }
}

var formApi = $$$.formApi;

if ($S.isArray(formApi)) {
    for(var i=0; i<formApi.length; i++) {
        formApi[i] = baseapi + formApi[i] + "?" + $S.getRequestId();
    }
}
var isPrintPage = false;
var hrefPath = $S.getUrlAttribute($$$.location.pathname, "hrefPath", null);
if (["/print", "/print/"].indexOf(hrefPath) >= 0) {
    isPrintPage = true;
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
        var isInitialDataLoading = false;
        if ($S.isString(initialPrintDataApi)) {
            isInitialDataLoading = true;
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
            self.printData["fieldRow"] = [self.getPrintDataTemplate("printBodyUser")];
            // Use for setting empty row
            self.printData["printTemplate2"] = self.getPrintDataTemplate("printTemplate2");
            self.printData["printHeading"] = self.getPrintDataTemplate("printHeading");
            self.printData["printFooter"] = self.getPrintDataTemplate("printFooter");
            if (isPrintPage && isInitialDataLoading === false) {
                self.handleFormSubmit("printDisplay");
            }
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
        } else {
            if (targetName !== "printDisplay") {
                window.alert(validationResult.alertMessage);
            }
        }
        // console.log(this.state.formRowFields);
        this.printData["fieldRow"] = [];
        this.printData["printFooter"] = [];
        this.printData["totalRow"] = [];
        var Print = PrintHelper(this.formData.formValues);
        var printRowData = PrintHelper.getDetails(Print);
        this.adjustFormRowFieldsRowId(printRowData);
        console.log("printRowData");
        console.log(printRowData);
        var footerTemplate = null, footerName = PrintHelper.getDotted(30);
        var footerTotalAmount = "";
        var footerTotalAmountText = PrintHelper.getSpaces(150);
        for(var i=0; i<printRowData.length; i++) {
            if (printRowData[i].templateName === "userDetails") {
                template = this.getPrintDataTemplate("printBodyUser");
                if (footerTemplate === null) {
                    footerTemplate = this.getPrintDataTemplate("printFooter");
                }
                if ($S.isString(printRowData[i].name) && printRowData[i].name.length) {
                    footerName = printRowData[i].name;
                }
                TemplateHelper.replaceTextPattern(footerTemplate, "acceptance", footerName);
                this.printData["printFooter"] = footerTemplate;
            } else if (printRowData[i].templateName === "formTemplate1") {
                template = this.getPrintDataTemplate("printTemplate1");
            } else if (printRowData[i].templateName === "totalRow") {
                template = this.getPrintDataTemplate("totalRow");
                TemplateHelper.setTemplateTextByFormValues(template, printRowData[i]);
                this.printTotalRow = template;
                if (footerTemplate === null) {
                    footerTemplate = this.getPrintDataTemplate("printFooter");
                }
                if ($S.isString(printRowData[i].totalAmount) && printRowData[i].totalAmount.length) {
                    footerTotalAmount = printRowData[i].totalAmount;
                }
                if ($S.isString(printRowData[i].totalAmountText) && printRowData[i].totalAmountText.length) {
                    footerTotalAmountText = printRowData[i].totalAmountText;
                }
                TemplateHelper.replaceTextPattern(footerTemplate, "totalAmount", footerTotalAmount);
                TemplateHelper.replaceTextPattern(footerTemplate, "totalAmountText", footerTotalAmountText);
                this.printData["printFooter"] = footerTemplate;
                continue;
            } else {
                template = this.getPrintDataTemplate("printTemplate2");
            }
            TemplateHelper.setTemplateTextByFormValues(template, printRowData[i]);
            this.printData["fieldRow"].push(template);
        }
        console.log("this.printData");
        console.log(this.printData);
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






