import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from "./components/Home";
import Journal from "./components/Journal";
import LedgerBook from "./components/LedgerBook";
import TrialBalance from "./components/TrialBalance";

import AccountHelper from "./common/AccountHelper";

import $S from "../interface/stack.js";
import $$$ from '../interface/global';
import Api from "../common/Api";

var baseapi = $$$.baseapi;
var basepathname = $$$.basepathname;

var backIconUrl = baseapi + $$$.backIconUrl;

var userControlDataApi = baseapi + $$$.userControlDataApi;

var accountTemplateApi = [];
var journalDataApi = [];
var accountDataApi = [];

var pages = {home: basepathname+"/", journal: basepathname+"/journal",
            ledger: basepathname+"/ledger", trail: basepathname+"/trail",
            currentbal: basepathname+"/currentbal"};

function setDataApi(userData) {
    accountTemplateApi = userData.accountTemplateApi.map(function(el, i, arr) {
        return baseapi+el;
    });
    journalDataApi = userData.journalDataApi.map(function(el, i, arr) {
        return baseapi+el;
    });
    accountDataApi = userData.accountDataApi.map(function(el, i, arr) {
        return baseapi+el;
    });
}

var Data = $S.getDataObj();

var keys = ["userControlData", "apiJournalData", "finalJournalData", "apiJournalDataByDate"];
keys.push("accountTemplate");
keys.push("accountData");
keys.push("journalRowFields");
keys.push("dataByCompany");

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

Data.setKeys(keys);
Data.initData();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            journalDataFields: [],
            ledgerDataFields: [],
            trialBalanceFields: [],
            currentBalanceFields: []
        };
        this.accountTemplateLoaded = false;
        this.journalDataLoaded = false;
        this.accountDataLoaded = false;

        this.getChildExposedMethod = this.getChildExposedMethod.bind(this);
        this.childrenMethod = {};

        this.userChange = this.userChange.bind(this);

        this.companyName = "Loading ...";
        this.currentUserName = "";
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
        var accountData, dataByCompany, finalJournalData, currentBalanceFields;
        accountData = Data.getData("accountData", []);
        dataByCompany = Data.getData("dataByCompany", {});
        finalJournalData = Data.getData("finalJournalData", []);
        currentBalanceFields = AccountHelper.getCurrentBalanceFields(this, finalJournalData, dataByCompany, accountData);
        return currentBalanceFields;
    }
    getTrialBalanceRowData() {
        var accountData, dataByCompany, trialBalanceFields;
        accountData = Data.getData("accountData", []);
        dataByCompany = Data.getData("dataByCompany", {});
        trialBalanceFields = AccountHelper.getTrialBalanceFields(this, dataByCompany, accountData);
        return trialBalanceFields;
    }
    dataLoadComplete() {
        var dataLoadStatus = [], i;
        dataLoadStatus.push(this.accountTemplateLoaded);
        dataLoadStatus.push(this.journalDataLoaded);
        dataLoadStatus.push(this.accountDataLoaded);
        for (i = 0; i < dataLoadStatus.length; i++) {
            if (dataLoadStatus[i] === false) {
                return false;
            }
        }
        var apiJournalDataByDate = AccountHelper.getApiJournalDataByDate(Data.getData("apiJournalData",[]), Data.getData("accountData",[]));
        apiJournalDataByDate = Data.setData("apiJournalDataByDate", apiJournalDataByDate);

        var finalJournalData = AccountHelper.getFinalJournalData(apiJournalDataByDate);
        finalJournalData = Data.setData("finalJournalData", finalJournalData);

        var journalDataFields = AccountHelper.getJournalFields(Data, Data.getData("apiJournalData",[]));
        var dataByCompany = AccountHelper.getDataByCompany(finalJournalData, Data.getData("accountData",[]));
        Data.setData("dataByCompany", dataByCompany);
        var ledgerDataFields = this.getLedgerRowData();
        var currentBalanceFields = this.getCurrentBalRowData();
        var trialBalanceFields = this.getTrialBalanceRowData();
        this.setState({journalDataFields: journalDataFields, ledgerDataFields: ledgerDataFields,
                trialBalanceFields: trialBalanceFields, currentBalanceFields: currentBalanceFields});
        $S.log("Data.getAllData()");
        console.log(Data.getAllData());
        return true;
    }
    fetchData() {
        var self = this;
        this.accountTemplateLoaded = false;
        this.journalDataLoaded = false;
        this.accountDataLoaded = false;
        $S.loadJsonData(null, accountDataApi, function(response) {
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
                $S.log("Invalid response (accountData):" + response);
            }
        }, function() {
            self.dataLoadComplete();
        }, null, Api.getAjaxApiCallMethod());

        var accountTemplate = {};
        $S.loadJsonData(null, accountTemplateApi, function(response) {
            self.accountTemplateLoaded = true;
            if ($S.isObject(response)) {
                Object.assign(accountTemplate, response);
            } else {
                $S.log("Invalid response (accountTemplate):" + response);
            }
        }, function() {
            Data.setData("accountTemplate", accountTemplate);
            self.dataLoadComplete();
        }, null, Api.getAjaxApiCallMethod());

        var journalData = [];
        $S.loadJsonData(null, journalDataApi, function(response) {
            self.journalDataLoaded = true;
            if ($S.isObject(response)) {
                journalData.push(response);
            } else {
                $S.log("Invalid response (journalData):" + response);
            }
        }, function() {
            Data.setData("apiJournalData", journalData);
            self.dataLoadComplete();
        }, null, Api.getAjaxApiCallMethod());
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
            var userDataNotFound = true;
            var userControlData = Data.getData("userControlData", []);
            for(var i=0; i<userControlData.length; i++) {
                if (userControlData[i].username === this.currentUserName) {
                    this.companyName = userControlData[i]["companyname"];
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
    componentDidMount() {
        var self = this;
        $S.loadJsonData(null, [userControlDataApi], function(response) {
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
                }
            } else {
                $S.log("Invalid response (userControlDataApi):" + response);
            }
            self.userChange(self.currentUserName);
        }, null, null, Api.getAjaxApiCallMethod());
    }
    render() {
        var methods = {userChange: this.userChange};
        var commonData = {pages: pages, backIconUrl: backIconUrl, companyName: this.companyName,
                        userControlData: Data.getData("userControlData", []), currentUserName: this.currentUserName};

        var home = <Home state={this.state} data={commonData} methods={methods}/>;

        var trial = <TrialBalance state={this.state} data={commonData} methods={methods} heading="Trial Balance"/>;

        var journal = <Journal state={this.state} data={commonData} methods={methods} heading="Journal"
                    renderFieldRow={this.state.journalDataFields}/>;

        var ledger = <LedgerBook state={this.state} data={commonData} methods={methods} heading="Ledger Book"
                    renderFieldRow={this.state.ledgerDataFields}/>;

        var currentbal = <LedgerBook state={this.state} data={commonData} methods={methods} heading="Current Balance"
                    renderFieldRow={this.state.currentBalanceFields}/>;

        return (<BrowserRouter><Switch>
                  <Route exact path={pages.home}>
                    {home}
                  </Route>
                  <Route path={pages.journal}>
                    {journal}
                  </Route>
                  <Route path={pages.currentbal}>
                    {currentbal}
                  </Route>
                  <Route path={pages.ledger}>
                    {ledger}
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

