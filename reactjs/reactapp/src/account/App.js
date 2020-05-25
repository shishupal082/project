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
import TemplateHelper from "../common/TemplateHelper";

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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            journalRowData: [],
            dataByCompany: {},
            ledgerDataFields: [],
            trialBalanceFields: [],
            currentBalanceFields: []
        };
        this.accountTemplateLoaded = false;
        this.journalDataLoaded = false;
        this.accountDataLoaded = false;
        this.accountTemplate = {};
        this.journalData = []; // [{}]
        this.finalJournalData = []; // [{}]
        this.accountData = [];

        this.getChildExposedMethod = this.getChildExposedMethod.bind(this);
        this.getTemplate = this.getTemplate.bind(this);
        this.userChange = this.userChange.bind(this);

        this.childrenMethod = {};
        this.companyName = "Loading ...";
        this.userControlData = [];
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
        if ($S.isDefined(this.accountTemplate[templateName])) {
            return $S.clone(this.accountTemplate[templateName]);
        }
        return null;
    }
    setLedgerRowData() {
        var dataByCompany = {}, ledgerDataFields = [], trialBalanceFields = [], currentBalanceFields = [];
        var validAccountName = this.accountData.map(function(el, index, arr) {
            return el.accountName;
        });
        dataByCompany = AccountHelper.getDataByCompany(this.finalJournalData, validAccountName);
        console.log(dataByCompany);
        ledgerDataFields = AccountHelper.getLeaderBookFields(this, this.accountData, dataByCompany);
        console.log(ledgerDataFields);

        trialBalanceFields = AccountHelper.getTrialBalanceFields(this, dataByCompany, validAccountName);

        currentBalanceFields = AccountHelper.getCurrentBalanceFields(this, this.finalJournalData, validAccountName);;
        this.setState({dataByCompany: dataByCompany, ledgerDataFields: ledgerDataFields,
                trialBalanceFields: trialBalanceFields, currentBalanceFields: currentBalanceFields});

        return true;
    }
    dataLoadComplete() {
        var dataLoadStatus = [], i, j, k;
        dataLoadStatus.push(this.accountTemplateLoaded);
        dataLoadStatus.push(this.journalDataLoaded);
        dataLoadStatus.push(this.accountDataLoaded);
        for (i = 0; i < dataLoadStatus.length; i++) {
            if (dataLoadStatus[i] === false) {
                return false;
            }
        }
        var journalRowData = [];
        var template = this.getTemplate("journalEntry1stRow");
        if (template) {
            journalRowData.push(template);
        }
        var entry = [], particularFieldTemplate = {}, temp;
        for (i = 0; i < this.journalData.length; i++) {
            if ($S.isArray(this.journalData[i].entry)) {
                for (j = 0; j < this.journalData[i].entry.length; j++) {
                    entry = this.journalData[i].entry[j];
                    template = this.getTemplate("journalEntry");
                    temp = TemplateHelper(template).searchField("particular");
                    if (temp.name === "particular") {
                        temp.text = [];
                    }
                    TemplateHelper.setTemplateTextByFormValues(template, entry);
                    if ($S.isArray(entry.particularEntry)) {
                        for (k = 0; k < entry.particularEntry.length; k++) {
                            particularFieldTemplate = this.getTemplate("journalEntryParticular");
                            TemplateHelper.setTemplateTextByFormValues(particularFieldTemplate, entry.particularEntry[k]);
                            temp.text.push(particularFieldTemplate);
                        }
                    }
                    journalRowData.push(template);
                }
            }
        }
        this.setState({journalRowData: journalRowData}, function() {
            this.setLedgerRowData();
        });
        return true;
    }
    fetchData() {
        var self = this;
        $S.loadJsonData(null, accountDataApi, function(response) {
            self.accountDataLoaded = true;
            if ($S.isArray(response)) {
                self.accountData = response;
            } else {
                $S.log("Invalid response (accountData):" + response);
            }
        }, function() {
            self.dataLoadComplete();
        }, null, Api.getAjaxApiCallMethod());
        $S.loadJsonData(null, accountTemplateApi, function(response) {
            self.accountTemplateLoaded = true;
            if ($S.isObject(response)) {
                Object.assign(self.accountTemplate, response);
            } else {
                $S.log("Invalid response (accountTemplate):" + response);
            }
        }, function() {
            self.dataLoadComplete();
        }, null, Api.getAjaxApiCallMethod());
        $S.loadJsonData(null, journalDataApi, function(response) {
            self.journalDataLoaded = true;
            if ($S.isObject(response)) {
                self.journalData.push(response);
            } else {
                $S.log("Invalid response (journalData):" + response);
            }
        }, function() {
            self.finalJournalData = AccountHelper.getFinalJournalData(self.journalData);
            self.dataLoadComplete();
        }, null, Api.getAjaxApiCallMethod());
    }
    userChange(currentUserName) {
        this.currentUserName = currentUserName;
        /*Reseting all values */
        this.accountTemplateLoaded = false;
        this.journalDataLoaded = false;
        this.accountDataLoaded = false;
        this.accountTemplate = {};
        this.journalData = [];
        this.finalJournalData = [];
        this.accountData = [];
        this.setState({
            isLoaded: false,
            journalRowData: [],
            dataByCompany: {},
            ledgerDataFields: [],
            trialBalanceFields: [],
            currentBalanceFields: []
        }, function() {
            var userDataNotFound = true;
            for(var i=0; i<this.userControlData.length; i++) {
                if (this.userControlData[i].username === this.currentUserName) {
                    this.companyName = this.userControlData[i]["companyname"];
                    setDataApi(this.userControlData[i]);
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
                self.userControlData = response;
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
                        userControlData: this.userControlData, currentUserName: this.currentUserName};

        var home = <Home state={this.state} data={commonData} methods={methods}/>;

        var trial = <TrialBalance state={this.state} data={commonData} methods={methods} heading="Trial Balance"/>;

        var journal = <Journal state={this.state} data={commonData} methods={methods} heading="Journal"/>;

        var ledger = <LedgerBook state={this.state} data={commonData} methods={methods}
                    renderFieldRow={this.state.ledgerDataFields} heading="Ledger Book"/>;

        var currentbal = <LedgerBook state={this.state} data={commonData} methods={methods}
                    renderFieldRow={this.state.currentBalanceFields} heading="Current Balance"/>;

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

