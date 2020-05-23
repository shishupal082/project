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

var backIconUrl = baseapi + "/static/img/icons/back-32.png";

var accountTemplateApi = [baseapi+"/pvt/app-data/account/accountTemplate.json"];
var journalDataApi = [baseapi+"/pvt/app-data/account/journalData2.json"];
var accountDataApi = [baseapi+"/pvt/app-data/account/accounts.json"];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            journalRowData: [],
            dataByCompany: {},
            ledgerData: []
        };
        this.accountTemplateLoaded = false;
        this.journalDataLoaded = false;
        this.accountDataLoaded = false;
        this.accountTemplate = {};
        this.journalData = []; // [{}]
        this.accountData = [];
        this.companyName = "";
        this.childrenMethod = {};
        this.getChildExposedMethod = this.getChildExposedMethod.bind(this);
        this.getTemplate = this.getTemplate.bind(this);
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
        var dataByCompany = {}, ledgerData = [];
        var validAccountName = this.accountData.map(function(el, index, arr) {
            return el.accountName;
        });
        dataByCompany = AccountHelper.getDataByCompany(this.journalData, validAccountName);
        console.log(dataByCompany);
        ledgerData = AccountHelper.getLeaderBookFields(this, this.accountData, dataByCompany);
        this.setState({dataByCompany: dataByCompany, ledgerData: ledgerData})
        console.log(ledgerData);
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
        if (this.journalData.length && this.journalData[0]["name"]) {
            this.companyName = this.journalData[0]["name"];
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
    componentDidMount() {
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
            self.dataLoadComplete();
        }, null, Api.getAjaxApiCallMethod());
    }
    render() {
        var methods = {};
        var home = <Home state={this.state}/>;
        var data = {accountTemplate: this.accountTemplate, journalData: this.journalData,
                    companyName: this.companyName, backIconUrl: backIconUrl};

        var ledgerData = {accountTemplate: this.accountTemplate, backIconUrl: backIconUrl,
                        companyName: this.companyName};

        var journal = <Journal state={this.state} data={data} heading="Journal"/>;
        var ledger = <LedgerBook state={this.state} data={ledgerData} methods={methods} heading="Ledger Book"/>;
        var trial = <TrialBalance state={this.state} data={data} methods={methods} heading="Trial Balance"/>;
        return (<BrowserRouter><Switch>
                  <Route exact path="/">
                    {home}
                  </Route>
                  <Route path="/journal">
                    {journal}
                  </Route>
                  <Route path="/ledger">
                    {ledger}
                  </Route>
                  <Route path="/trial">
                    {trial}
                  </Route>
                  <Route>
                    {home}
                  </Route>
            </Switch></BrowserRouter>);
    }
}

export default App;

