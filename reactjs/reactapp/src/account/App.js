import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from "./components/Home";
import Journal from "./components/Journal";
import LedgerBook from "./components/LedgerBook";
import TrialBalance from "./components/TrialBalance";

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
            ledgerData: []
        };
        this.accountTemplateLoaded = false;
        this.journalDataLoaded = false;
        this.accountDataLoaded = false;
        this.accountTemplate = {};
        this.journalData = []; // [{}]
        this.accountData = [];
        this.companyName = "";
    }
    getTemplate(templateName) {
        if ($S.isDefined(this.accountTemplate[templateName])) {
            return $S.clone(this.accountTemplate[templateName]);
        }
        return null;
    }
    setLedgerRowData() {
        var ledgerData = [], entry = {}, dataByCompany = {};
        var ledgerRowTemplate = {}, particularEntry = {};
        var i, j, k, minLength, maxLength, temp, accountName, companyData, ledgerRowFields;
        var validAccountName = this.accountData.map(function(el, i, arr) {
            return el.accountName;
        });
        for (i=0; i<this.journalData.length; i++) {
            if ($S.isArray(this.journalData[i].entry)) {
                for (j = 0; j < this.journalData[i].entry.length; j++) {
                    entry = this.journalData[i].entry[j];
                    if ($S.isArray(entry.particularEntry)) {
                        for (k = 0; k < entry.particularEntry.length; k++) {
                            accountName = entry.particularEntry[k].account;
                            if (validAccountName.indexOf(accountName) < 0) {
                                console.log("Invalid accountName: " + accountName);
                            }
                            if ($S.isString(accountName) && accountName.length) {
                                if ($S.isUndefined(dataByCompany[accountName])) {
                                    dataByCompany[accountName] = {"accountName": accountName, ledgerRowData: {"dr": [], "cr": []}};
                                }
                                particularEntry = $S.clone(entry.particularEntry[k]);
                                particularEntry.date = entry.date;
                                if ($S.isDefined(particularEntry.dr)) {
                                    dataByCompany[accountName].ledgerRowData["dr"].push(particularEntry);
                                } else if ($S.isDefined(particularEntry.cr)) {
                                    dataByCompany[accountName].ledgerRowData["cr"].push(particularEntry);
                                }
                            }
                        }
                    }
                }
            }
        }
        console.log(dataByCompany);
        for (i=0; i<this.accountData.length; i++) {
            if (dataByCompany[this.accountData[i].accountName]) {
                companyData = dataByCompany[this.accountData[i].accountName];
                ledgerRowFields = {accountName: "", fields: []};
                ledgerRowFields.accountName = this.accountData[i].accountName;
                ledgerRowFields.fields.push(this.getTemplate("ledgerHeading"));
                if ($S.isArray(companyData.ledgerRowData.dr) && $S.isArray(companyData.ledgerRowData.cr)) {
                    maxLength = companyData.ledgerRowData.dr.length;
                    minLength = companyData.ledgerRowData.cr.length;
                    if (maxLength < companyData.ledgerRowData.cr.length) {
                        maxLength = companyData.ledgerRowData.cr.length;
                        minLength = companyData.ledgerRowData.dr.length
                    }
                    temp = {};
                    for (j=0; j<minLength; j++) {
                        temp.debitDate = companyData.ledgerRowData.dr[j].date;
                        temp.debitAmount = companyData.ledgerRowData.dr[j].dr;
                        temp.debitParticular = companyData.ledgerRowData.dr[j].particularText;
                        if (companyData.ledgerRowData.dr[j].ledgerText) {
                            temp.debitParticular = companyData.ledgerRowData.dr[j].ledgerText;
                        }
                        temp.creditDate = companyData.ledgerRowData.cr[j].date;
                        temp.creditAmount = companyData.ledgerRowData.cr[j].cr;
                        temp.creditParticular = companyData.ledgerRowData.cr[j].particularText;
                        if (companyData.ledgerRowData.cr[j].ledgerText) {
                            temp.debitParticular = companyData.ledgerRowData.cr[j].ledgerText;
                        }
                        ledgerRowTemplate = this.getTemplate("ledgerRow");
                        TemplateHelper.setTemplateTextByFormValues(ledgerRowTemplate, temp);
                        ledgerRowFields.fields.push(ledgerRowTemplate);
                    }
                    temp = {};
                    for (j=minLength; j<maxLength; j++) {
                        if (companyData.ledgerRowData.cr.length > minLength) {
                            temp.creditDate = companyData.ledgerRowData.cr[j].date;
                            temp.creditAmount = companyData.ledgerRowData.cr[j].cr;
                            temp.creditParticular = companyData.ledgerRowData.cr[j].particularText;
                            if (companyData.ledgerRowData.cr[j].ledgerText) {
                                temp.debitParticular = companyData.ledgerRowData.cr[j].ledgerText;
                            }
                        } else {
                            temp.debitDate = companyData.ledgerRowData.dr[j].date;
                            temp.debitAmount = companyData.ledgerRowData.dr[j].dr;
                            temp.debitParticular = companyData.ledgerRowData.dr[j].particularText;
                            if (companyData.ledgerRowData.dr[j].ledgerText) {
                                temp.debitParticular = companyData.ledgerRowData.dr[j].ledgerText;
                            }
                        }
                        ledgerRowTemplate = this.getTemplate("ledgerRow");
                        TemplateHelper.setTemplateTextByFormValues(ledgerRowTemplate, temp);
                        ledgerRowFields.fields.push(ledgerRowTemplate);
                    }
                }
                ledgerData.push(ledgerRowFields);
            }
        }
        console.log(ledgerData);
        this.setState({ledgerData: ledgerData});
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
        var home = <Home state={this.state}/>;
        var data = {accountTemplate: this.accountTemplate, journalData: this.journalData,
                    companyName: this.companyName, backIconUrl: backIconUrl};
        var journal = <Journal state={this.state} data={data} heading="Journal"/>;
        var ledger = <LedgerBook state={this.state} data={data} heading="Ledger Book"/>;
        var trial = <TrialBalance state={this.state} data={data} heading="Ledger Book"/>;
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

