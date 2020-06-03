import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from "./components/Home";
import Journal from "./components/Journal";
import JournalByDate from "./components/JournalByDate";
import LedgerBook from "./components/LedgerBook";
import TrialBalance from "./components/TrialBalance";

import AccountHelper from "./common/AccountHelper";

import $S from "../interface/stack.js";
import $$$ from '../interface/global';
import Api from "../common/Api";

var RequestId = $S.getRequestId();
var DT = $S.getDT();
var DateFormate = "YYYY/-/MM/-/DD";

var baseapi = $$$.baseapi;
var basepathname = $$$.basepathname;

var backIconUrl = baseapi + $$$.backIconUrl;

var userControlDataApi = baseapi + $$$.userControlDataApi + "?" + RequestId;

var accountTemplateApi = [];
var journalDataApi = [];
var journalDataApiCSV = [];
var accountDataApi = [];

var pages = {home: basepathname+"/", journal: basepathname+"/journal", journalbydate: basepathname+"/journalbydate",
            ledger: basepathname+"/ledger", trail: basepathname+"/trail",
            currentbal: basepathname+"/currentbal", currentbalbydate: basepathname+"/currentbalbydate",
            summary: basepathname+"/summary"};

function setDataApi(userData) {
    accountTemplateApi = [];
    journalDataApi = [];
    journalDataApiCSV = [];
    accountDataApi = [];
    if ($S.isArray(userData.accountTemplateApi)) {
        accountTemplateApi = userData.accountTemplateApi.map(function(el, i, arr) {
            return baseapi+el + "?" + RequestId;
        });
    }
    if ($S.isArray(userData.journalDataApi)) {
        journalDataApi = userData.journalDataApi.map(function(el, i, arr) {
            return baseapi+el + "?" + RequestId;
        });
    }
    if ($S.isArray(userData.journalDataApiCSV)) {
        journalDataApiCSV = userData.journalDataApiCSV.map(function(el, i, arr) {
            return baseapi+el + "?" + RequestId;
        });
    }
    if ($S.isArray(userData.accountDataApi)) {
        accountDataApi = userData.accountDataApi.map(function(el, i, arr) {
            return baseapi+el + "?" + RequestId;
        });
    }
}

var Data = $S.getDataObj();

var keys = ["userControlData", "apiJournalData", "apiJournalDataCSV",
            "finalJournalData", "apiJournalDataByDate"];
keys.push("accountTemplate");
keys.push("accountData");
keys.push("dataByCompany");
keys.push("dateSelectionParameter");

var ErrorsData = [];

Data.getTemplate = function(key, defaultTemplate) {
    var allTemplate = Data.getData("accountTemplate");
    if ($S.isObject(allTemplate)) {
        if ($S.isDefined(allTemplate[key])) {
            return allTemplate[key];
        }
    }
    return defaultTemplate;
};

Data.initData = function() {
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] === "userControlData") {
            continue;
        }
        Data.setData(keys[i], []);
    }
};

Data.addError = function(er) {
    ErrorsData.push(er);
};

Data.clearError = function() {
    ErrorsData = [];
};

Data.setKeys(keys);
Data.initData();


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            journalDataFields: [],
            journalDataByDateFields: [],
            ledgerDataFields: [],
            trialBalanceFields: [],
            currentBalanceFields: [],
            currentBalanceByDateFields: [],
            accountSummaryFields: []
        };
        this.accountTemplateLoaded = false;
        this.journalDataLoaded = false;
        this.journalDataCSVLoaded = false;
        this.accountDataLoaded = false;

        this.getChildExposedMethod = this.getChildExposedMethod.bind(this);
        this.childrenMethod = {};

        this.userChange = this.userChange.bind(this);
        this.onDateSelectionTypeChange = this.onDateSelectionTypeChange.bind(this);

        this.companyName = "Loading ...";
        this.currentUserName = "";

        this.dateSelection = [];
        this.dateSelection.push({"name": "Daily", "value": "daily"});
        this.dateSelection.push({"name": "Monthly", "value": "monthly"});
        this.dateSelection.push({"name": "Yearly", "value": "yearly"});
        this.dateSelection.push({"name": "All", "value": "all"});


        this.dateSelectionType = "all";
        this.validDateSelectionType = this.dateSelection.map(function(el, i, isArray) {
            return el.value;
        });
    }
    setDateSelectionParameter() {
        var dateSelection = [], finalJournalData, i, j, allDate = [], temp, dObj;
        finalJournalData = Data.getData("finalJournalData", []);
        var startDate, endDate, heading;
        for (i=0; i<finalJournalData.length; i++) {
            if ($S.isArray(finalJournalData[i].entry)) {
                for (j=0; j<finalJournalData[i].entry.length; j++) {
                    temp = finalJournalData[i].entry[j].date;
                    temp = DT.getDateObj(temp);
                    if (temp !== null) {
                        temp = DT.formateDateTime(DateFormate, "/", temp);
                        if (allDate.indexOf(temp) < 0) {
                            allDate.push(temp);
                        }
                    }
                }
            }
        }
        if (this.dateSelectionType === "daily") {
            for (i=0; i<allDate.length; i++) {
                temp = allDate[i];
                dateSelection.push({"dateRange": [temp+" 00:00", temp+" 23:59"], "dateHeading": temp});
            }
        } else if (this.dateSelectionType === "monthly") {
            temp = [];
            for (i=0; i<allDate.length; i++) {
                dObj = DT.getDateObj(allDate[i]);
                if (dObj !== null) {
                    dObj.setDate(1);
                    heading = DT.formateDateTime("MMM/ /YYYY", "/", dObj);
                    startDate = DT.formateDateTime("YYYY/-/MM/-/DD/ 00:00", "/", dObj);
                    dObj.setMonth(dObj.getMonth()+1);
                    dObj.setDate(0);
                    endDate = DT.formateDateTime("YYYY/-/MM/-/DD/ 23:59", "/", dObj);
                } else {
                    continue;
                }
                if (temp.indexOf(heading) < 0) {
                    dateSelection.push({"dateRange": [startDate, endDate], "dateHeading": heading});
                    temp.push(heading);
                }
            }
        } else if (this.dateSelectionType === "yearly") {
            temp = [];
            for (i=0; i<allDate.length; i++) {
                dObj = DT.getDateObj(allDate[i]);
                if (dObj !== null) {
                    dObj.setDate(1);
                    heading = DT.formateDateTime("YYYY", "/", dObj);
                    startDate = heading +"-01-01 00:00";
                    endDate = heading +"-12-31 23:59";
                } else {
                    continue;
                }
                if (temp.indexOf(heading) < 0) {
                    dateSelection.push({"dateRange": [startDate, endDate], "dateHeading": heading});
                    temp.push(heading);
                }
            }
        } else if (this.dateSelectionType === "all") {
            heading = "All";
            if (allDate.length > 0) {
                startDate = allDate[0] + " 00:00";
                endDate = allDate[allDate.length-1] + " 23:59";
            }
            dateSelection.push({"dateRange": [startDate, endDate], "dateHeading": heading});
        }
        Data.setData("dateSelectionParameter", dateSelection);
        console.log("dateSelection");
        console.log(dateSelection);
        return dateSelection;
    }
    getChildExposedMethod(name, method) {
        if (this.childrenMethod[name]) {
            console.log("Method: " + name +" already defined.");
        } else {
            this.childrenMethod[name] = method;
        }
    }
    getTemplate(templateName) {
        return Data.getTemplate(templateName, null);
    }
    getLedgerRowData() {
        var dataByCompany, accountData, ledgerDataFields;
        accountData = Data.getData("accountData", []);
        dataByCompany = Data.getData("dataByCompany", {});
        ledgerDataFields = AccountHelper.getLedgerBookFields(this, accountData, dataByCompany);
        return ledgerDataFields;
    }
    getCurrentBalRowData() {
        var accountData, dataByCompany, currentBalanceFields;
        accountData = Data.getData("accountData", []);
        dataByCompany = Data.getData("dataByCompany", {});
        currentBalanceFields = AccountHelper.getCurrentBalanceFields(this, dataByCompany, accountData);
        return currentBalanceFields;
    }
    getCurrentBalByDateRowData() {
        var accountData, dataByCompany, currentBalanceFields, dateSelection;
        accountData = Data.getData("accountData", []);
        dataByCompany = Data.getData("dataByCompany", {});
        dateSelection = Data.getData("dateSelectionParameter", []);
        currentBalanceFields = AccountHelper.getCurrentBalByDateRowData(Data, dataByCompany, accountData, dateSelection);
        return currentBalanceFields;
    }
    getAccountSummaryFields() {
        var accountData, dataByCompany, accountSummaryFields, dateSelection;
        accountData = Data.getData("accountData", []);
        dataByCompany = Data.getData("dataByCompany", {});
        dateSelection = Data.getData("dateSelectionParameter", []);
        accountSummaryFields = AccountHelper.getAccountSummaryFields(Data, dataByCompany, accountData, dateSelection);
        return accountSummaryFields;
    }
    getTrialBalanceRowData() {
        var accountData, dataByCompany, trialBalanceFields;
        accountData = Data.getData("accountData", []);
        dataByCompany = Data.getData("dataByCompany", {});
        trialBalanceFields = AccountHelper.getTrialBalanceFields(this, dataByCompany, accountData);
        return trialBalanceFields;
    }
    getJournalDataByDateFields() {
        var journalDataByDateFields, apiJournalDataByDate, dateSelection;
        apiJournalDataByDate = Data.getData("apiJournalDataByDate", []);
        dateSelection = Data.getData("dateSelectionParameter", []);
        journalDataByDateFields = AccountHelper.getJournalDataByDateFields(Data, apiJournalDataByDate, dateSelection);
        return journalDataByDateFields;
    }
    dataSetComplete() {
        var journalDataFields = AccountHelper.getJournalFields(Data, Data.getData("apiJournalData",[]));
        var ledgerDataFields = this.getLedgerRowData();
        var currentBalanceFields = this.getCurrentBalRowData();
        var trialBalanceFields = this.getTrialBalanceRowData();

        var journalDataByDateFields = this.getJournalDataByDateFields();
        var currentBalanceByDateFields = this.getCurrentBalByDateRowData();

        var accountSummaryFields = this.getAccountSummaryFields();

        this.setState({journalDataFields: journalDataFields, ledgerDataFields: ledgerDataFields,
                trialBalanceFields: trialBalanceFields, currentBalanceFields: currentBalanceFields,
                journalDataByDateFields: journalDataByDateFields,
                currentBalanceByDateFields: currentBalanceByDateFields,
                accountSummaryFields: accountSummaryFields}, function() {
                    $S.log("Data.getAllData()");
                    console.log(Data.getAllData());
                    $S.log("this.state");
                    console.log(this.state);
                });
        return true;
    }
    dataLoadComplete() {
        var dataLoadStatus = [], i;
        dataLoadStatus.push(this.accountTemplateLoaded);
        dataLoadStatus.push(this.journalDataLoaded);
        dataLoadStatus.push(this.journalDataCSVLoaded);
        dataLoadStatus.push(this.accountDataLoaded);
        for (i = 0; i < dataLoadStatus.length; i++) {
            if (dataLoadStatus[i] === false) {
                return false;
            }
        }

        var apiJournalDataByDate = AccountHelper.getApiJournalDataByDate(Data, Data.getData("apiJournalData",[]));
        Data.setData("apiJournalDataByDate", apiJournalDataByDate);

        var finalJournalData = AccountHelper.getFinalJournalData(apiJournalDataByDate);
        Data.setData("finalJournalData", finalJournalData);
        this.setDateSelectionParameter();
        var dataByCompany = AccountHelper.getDataByCompany(Data, finalJournalData, Data.getData("accountData",[]));
        Data.setData("dataByCompany", dataByCompany);
        this.dataSetComplete();
        return true;
    }
    fetchData() {
        var self = this;
        this.accountTemplateLoaded = false;
        this.journalDataLoaded = false;
        this.journalDataCSVLoaded = false;
        this.accountDataLoaded = false;
        if ($S.isArray(accountDataApi) && accountDataApi.length) {
            $S.loadJsonData(null, accountDataApi, function(response, apiName, ajaxDetails) {
                self.accountDataLoaded = true;
                if ($S.isArray(response)) {
                    // checking unique accountName
                    var temp = {};
                    for (var i=0; i<response.length; i++) {
                        if (temp[response[i].accountName]) {
                            alert("Duplicate entry: " + response[i].accountName);
                        } else {
                            temp[response[i].accountName] = 1;
                        }
                    }
                    Data.setData("accountData", response);
                } else {
                    Data.addError({"text":ajaxDetails.url, "href":ajaxDetails.url});
                    $S.log("Invalid response (accountData):" + response);
                }
            }, function() {
                self.dataLoadComplete();
            }, null, Api.getAjaxApiCallMethod());
        } else {
            self.accountDataLoaded = true;
        }
        if ($S.isArray(accountTemplateApi) && accountTemplateApi.length) {
            var accountTemplate = {};
            $S.loadJsonData(null, accountTemplateApi, function(response, apiName, ajaxDetails) {
                if ($S.isObject(response)) {
                    Object.assign(accountTemplate, response);
                } else {
                    Data.addError({"text":ajaxDetails.url, "href":ajaxDetails.url});
                    $S.log("Invalid response (accountTemplate):" + response);
                }
            }, function() {
                self.accountTemplateLoaded = true;
                Data.setData("accountTemplate", accountTemplate);
                self.dataLoadComplete();
            }, null, Api.getAjaxApiCallMethod());
        } else {
            self.accountTemplateLoaded = true;
        }
        if ($S.isArray(journalDataApi) && journalDataApi.length) {
            var journalData = [];
            $S.loadJsonData(null, journalDataApi, function(response, apiName, ajaxDetails) {
                if ($S.isObject(response)) {
                    journalData.push(response);
                } else {
                    Data.addError({"text":ajaxDetails.url, "href":ajaxDetails.url});
                    $S.log("Invalid response (journalData):" + response);
                }
            }, function() {
                self.journalDataLoaded = true;
                var apiJournalData = Data.getData("apiJournalData",[]);
                apiJournalData = apiJournalData.concat(journalData);
                Data.setData("apiJournalData", apiJournalData);
                self.dataLoadComplete();
            }, null, Api.getAjaxApiCallMethod());
        } else {
            self.journalDataLoaded = true;
        }
        if ($S.isArray(journalDataApiCSV) && journalDataApiCSV.length) {
            var apiJournalDataCSV = [];
            $S.loadJsonData(null, journalDataApiCSV, function(response, apiName, ajaxDetails) {
                if ($S.isString(response)) {
                    apiJournalDataCSV.push(response);
                } else {
                    Data.addError({"text":ajaxDetails.url, "href":ajaxDetails.url});
                    $S.log("Invalid response (journalData):" + response);
                }
            }, function() {
                self.journalDataCSVLoaded = true;
                var csvToJSONJournalData = AccountHelper.convertCSVToJsonJournalData(Data, apiJournalDataCSV);;
                var apiJournalData = Data.getData("apiJournalData",[]);
                apiJournalData = apiJournalData.concat(csvToJSONJournalData);
                Data.setData("apiJournalData", apiJournalData);
                self.dataLoadComplete();
            }, null, Api.getAjaxApiCallMethodV2());
        } else {
            self.journalDataCSVLoaded = true;
        }
    }
    userChange(currentUserName) {
        Data.initData();
        this.currentUserName = currentUserName;
        /*Reseting all values */
        this.setState({
            isLoaded: false,
            journalDataFields: [],
            ledgerDataFields: [],
            trialBalanceFields: [],
            currentBalanceFields: []
        }, function() {
            Data.clearError();
            var userDataNotFound = true;
            var userControlData = Data.getData("userControlData", []);
            for(var i=0; i<userControlData.length; i++) {
                if (userControlData[i].username === this.currentUserName) {
                    this.companyName = userControlData[i]["companyname"];
                    // this.dateSelectionType = userControlData[i]["dateSelectionType"];
                    setDataApi(userControlData[i]);
                    userDataNotFound = false;
                    this.fetchData();
                    break;
                }
            }
            if (userDataNotFound) {
                this.companyName = "No Data Found";
                this.setState({isLoaded: false});
            }
        });
        return 1;
    }
    onDateSelectionTypeChange(dateSelectionType) {
        if (this.dateSelectionType === dateSelectionType || this.validDateSelectionType.indexOf(dateSelectionType) < 0) {
            return false;
        }
        this.dateSelectionType = dateSelectionType;
        this.setDateSelectionParameter();
        var dataLoadStatus = [], i;
        dataLoadStatus.push(this.accountTemplateLoaded);
        dataLoadStatus.push(this.journalDataLoaded);
        dataLoadStatus.push(this.accountDataLoaded);
        for (i = 0; i < dataLoadStatus.length; i++) {
            if (dataLoadStatus[i] === false) {
                this.setState({isLoaded: false});
                return false;
            }
        }
        this.dataSetComplete();
        return true;
    }
    componentDidMount() {
        var self = this;
        $S.loadJsonData(null, [userControlDataApi], function(response, apiName, ajaxDetails) {
            if ($S.isArray(response)) {
                // checking unique username
                var temp = {};
                for (var i=0; i<response.length; i++) {
                    if (temp[response[i].username]) {
                        alert("Duplicate entry: " + response[i].username);
                    } else {
                        temp[response[i].username] = 1;
                    }
                }
                Data.setData("userControlData", response);
                if (response.length > 0) {
                    self.currentUserName = response[0].username;
                    if ($S.isString(response[0].dateSelectionType)) {
                        if (self.validDateSelectionType.indexOf(response[0].dateSelectionType) >= 0) {
                            self.dateSelectionType = response[0].dateSelectionType;
                        }
                    }
                }
            } else {
                Data.addError({"text":ajaxDetails.url, "href":ajaxDetails.url});
                $S.log("Invalid response (userControlDataApi):" + response);
            }
            self.userChange(self.currentUserName);
        }, null, null, Api.getAjaxApiCallMethod());
    }
    render() {
        var methods = {userChange: this.userChange, onDateSelectionTypeChange: this.onDateSelectionTypeChange};
        var commonData = {pages: pages, backIconUrl: backIconUrl, companyName: this.companyName,
                        userControlData: Data.getData("userControlData", []),
                        currentUserName: this.currentUserName,
                        dateSelection: [], dateSelectionType: "", errorsData: ErrorsData};

        var currentbalvalByDate = $S.clone(commonData);
        currentbalvalByDate["dateSelection"] = this.dateSelection;
        currentbalvalByDate["dateSelectionType"] = this.dateSelectionType;

        var home = <Home state={this.state} data={commonData} methods={methods}/>;

        var trial = <TrialBalance state={this.state} data={commonData} methods={methods} heading="Trial Balance"/>;

        var journal = <Journal state={this.state} data={commonData} methods={methods} heading="Journal"
                    renderFieldRow={this.state.journalDataFields}/>;

        var journalbydate = <JournalByDate state={this.state} data={currentbalvalByDate} methods={methods} heading="Journal By Date"
                    renderFieldRow={this.state.journalDataByDateFields}/>;

        var ledger = <LedgerBook state={this.state} data={commonData} methods={methods} heading="Ledger Book"
                    renderFieldRow={this.state.ledgerDataFields}/>;

        var currentbal = <LedgerBook state={this.state} data={commonData} methods={methods} heading="Current Balance"
                    renderFieldRow={this.state.currentBalanceFields}/>;
        var currentbalbydate = <JournalByDate state={this.state} data={currentbalvalByDate} methods={methods} heading="Current Balance By Date"
                    renderFieldRow={this.state.currentBalanceByDateFields}/>;

        var summary = <JournalByDate state={this.state} data={currentbalvalByDate} methods={methods} heading="Account Summary"
                    renderFieldRow={this.state.accountSummaryFields}/>;

        return (<BrowserRouter><Switch>
                  <Route exact path={pages.home}>
                    {home}
                  </Route>
                  <Route path={pages.journal}>
                    {journal}
                  </Route>
                  <Route path={pages.journalbydate}>
                    {journalbydate}
                  </Route>
                  <Route path={pages.currentbal}>
                    {currentbal}
                  </Route>
                  <Route path={pages.currentbalbydate}>
                    {currentbalbydate}
                  </Route>
                  <Route path={pages.ledger}>
                    {ledger}
                  </Route>
                  <Route path={pages.summary}>
                    {summary}
                  </Route>
                  <Route path={pages.trial}>
                    {trial}
                  </Route>
                  <Route>
                    {home}
                  </Route>
            </Switch></BrowserRouter>);
    }
}

export default App;

