import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from "./components/Home";
import JournalByDate from "./components/JournalByDate";
import LedgerBook from "./components/LedgerBook";

// import AccountHelper from "./common/AccountHelper";
// import AccountHelper2 from "./common/AccountHelper2";
import Config from "./common/Config";
import DataHandler from "./common/DataHandler";


import $S from "../interface/stack.js";
// import Api from "../common/Api";


// var RequestId = $S.getRequestId();
// var DT = $S.getDT();

// var baseapi = Config.baseapi;

// var backIconUrl = baseapi + Config.backIconUrl;

// var userControlDataApi = baseapi + Config.userControlDataApi + "?" + RequestId;

// var accountTemplateApi = [];
// var journalDataApi = [];
// var journalDataApiCSV = [];
// var accountDataApi = [];

var pages = Config.pages;
// var pageHeading = Config.pageHeading;

// var Data = $S.getDataObj();

// var keys = ["userControlData", "currentUserControlData", "apiJournalData",
//             "finalJournalData", "apiJournalDataByDate",
//             "customiseDebitAccountData", "customiseCreditAccountData", "customeAccountData",
//             "customiseCalenderAccountData"];

// keys.push("accountTemplate");
// keys.push("accountData");
// keys.push("dataByCompany");
// keys.push("dateSelectionFieldsParameter");
// keys.push("combinedDateSelectionFieldsParameter");

// function setDataApi() {
//     var userData = Data.getData("currentUserControlData", {});
//     accountTemplateApi = [];
//     journalDataApi = [];
//     journalDataApiCSV = [];
//     accountDataApi = [];
//     if ($S.isArray(userData.accountTemplateApi)) {
//         accountTemplateApi = userData.accountTemplateApi.map(function(el, i, arr) {
//             return baseapi+el + "?" + RequestId;
//         });
//     }
//     if ($S.isArray(userData.journalDataApi)) {
//         journalDataApi = userData.journalDataApi.map(function(el, i, arr) {
//             return baseapi+el + "?" + RequestId;
//         });
//     }
//     if ($S.isArray(userData.journalDataApiCSV)) {
//         journalDataApiCSV = userData.journalDataApiCSV.map(function(el, i, arr) {
//             return baseapi+el + "?" + RequestId;
//         });
//     }
//     if ($S.isArray(userData.accountDataApi)) {
//         accountDataApi = userData.accountDataApi.map(function(el, i, arr) {
//             return baseapi+el + "?" + RequestId;
//         });
//     }
// }

// var ErrorsData = [];

// Data.getTemplate = function(key, defaultTemplate) {
    // var allTemplate = Data.getData("accountTemplate");
    // if ($S.isObject(allTemplate)) {
    //     if ($S.isDefined(allTemplate[key])) {
    //         return allTemplate[key];
    //     }
    // }
//     return defaultTemplate;
// };

// Data.initData = function() {
//     var defaultData, allData = Data.getAllData();
//     for (var i = 0; i < keys.length; i++) {
//         if (["userControlData", "accountTemplate"].indexOf(keys[i]) >= 0) {
//             continue;
//         }
//         defaultData = [];
//         if ($S.isObject(allData[keys[i]])) {
//             defaultData = {};
//         }
//         Data.setData(keys[i], defaultData);
//     }
// };

// Data.addError = function(er) {
//     ErrorsData.push(er);
// };

// Data.clearError = function() {
//     ErrorsData = [];
// };

// Data.setKeys(keys);
// Data.initData();
// Data.setData("accountTemplate", Config.Template);


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        // this.state = {
        //     isLoaded: false,
        //     homeFields: Config.homeFields,
        //     journalDataFields: [],
        //     journalDataByDateFields: [],
        //     ledgerDataFields: [],
        //     trialBalanceFields: [],
        //     currentBalanceFields: [],
        //     currentBalanceByDateFields: [],
        //     accountSummaryFields: [],
        //     accountSummaryByDateFields: [],
        //     accountSummaryByCalenderFields: [],
        //     customiseDebitAccountSummary: [],
        //     customiseCreditAccountSummary: [],
        //     customiseAccountSummary: [],
        //     profitAndLossFields: [],
        //     noMatchFields: Data.getTemplate("noPageFound"),
        //     pageTracking: []
        // };
        var dateSelection = Config.dateSelection;
        if (!$S.isArray(dateSelection)) {
            dateSelection = [];
        }
        this.appData = {
            "firstTimeDataLoadStatus": "",
            "dataLoadStatus": "",
            "backIconUrl": Config.backIconUrl,
            "pages": pages,
            "reloadText": "Reload",

            "userControlData": [],
            "currentUserName": "",
            "currentPageName": "",
            "companyName": "",
            "pageHeading": "",
            "pageTab": [],

            "homeFields": [],
            "dropdownFields": [],
            "renderFieldRow": [],
            "errorsData": [],

            "selectedDateType": "",
            "dateSelectionFields": dateSelection
        };

        this.appStateCallback = this.appStateCallback.bind(this);
        this.appDataCallback = this.appDataCallback.bind(this);
        this.addTab = this.addTab.bind(this);
        this.removeTab = this.removeTab.bind(this);

        // this.accountTemplateLoaded = false;
        // this.journalDataLoaded = false;
        // this.journalDataCSVLoaded = false;
        // this.accountDataLoaded = false;

        // this.getChildExposedMethod = this.getChildExposedMethod.bind(this);
        // this.childrenMethod = {};

        // this.userChange = this.userChange.bind(this);
        // this.onDateSelectionFieldsTypeChange = this.onDateSelectionFieldsTypeChange.bind(this);

        // this.companyName = Config.defaultCompanyName;
        // this.currentUserName = Config.defaultUserName;


        // this.dateSelectionFields = Config.dateSelectionFields;

        // this.dateSelectionFieldsType = Config.defaultDateSelectionFieldsType;

        // this.validDateSelectionFieldsType = this.dateSelectionFields.map(function(el, i, isArray) {
        //     return el.value;
        // });

        // this.trackPage = this.trackPage.bind(this);
        // this.removeTrackPage = this.removeTrackPage.bind(this);
        // this.trackPageInfo = {};
    }
    addTab(pageName) {
        if (this.appData.pageTab.indexOf(pageName) >= 0) {
            return;
        }
        this.appData.pageTab.push(pageName);
    }
    removeTab(pageName) {
        this.appData.pageTab = this.appData.pageTab.filter(function(el, i, arr) {
            if (pageName === el) {
                return false;
            }
            return true;
        });
        this.appStateCallback();
    }
    // setDateSelectionFieldsParameter() {
    //     var dateSelectionFields = [], finalJournalData, i, j, allDate = [], temp, dObj;
    //     finalJournalData = Data.getData("finalJournalData", []);
    //     var startDate, endDate, heading;

    //     var dailyDateSelectionFields = [];
    //     var monthlyDateSelectionFields = [];
    //     var yearlyDateSelectionFields = [];

    //     for (i=0; i<finalJournalData.length; i++) {
    //         if ($S.isArray(finalJournalData[i].entry)) {
    //             for (j=0; j<finalJournalData[i].entry.length; j++) {
    //                 temp = finalJournalData[i].entry[j].date;
    //                 temp = DT.getDateObj(temp);
    //                 if (temp !== null) {
    //                     temp = DT.formateDateTime("YYYY/-/MM/-/DD", "/", temp);
    //                     if (allDate.indexOf(temp) < 0) {
    //                         allDate.push(temp);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     /*Daily Date Selection*/
    //     for (i=0; i<allDate.length; i++) {
    //         temp = allDate[i];
    //         dailyDateSelectionFields.push({"dateRange": [temp+" 00:00", temp+" 23:59"], "dateHeading": temp});
    //     }
    //     /*Monthly Date Selection*/
    //     temp = [];
    //     for (i=0; i<allDate.length; i++) {
    //         dObj = DT.getDateObj(allDate[i]);
    //         if (dObj !== null) {
    //             dObj.setDate(1);
    //             heading = DT.formateDateTime("MMM/ /YYYY", "/", dObj);
    //             startDate = DT.formateDateTime("YYYY/-/MM/-/DD/ 00:00", "/", dObj);
    //             dObj.setMonth(dObj.getMonth()+1);
    //             dObj.setDate(0);
    //             endDate = DT.formateDateTime("YYYY/-/MM/-/DD/ 23:59", "/", dObj);
    //         } else {
    //             continue;
    //         }
    //         if (temp.indexOf(heading) < 0) {
    //             monthlyDateSelectionFields.push({"dateRange": [startDate, endDate], "dateHeading": heading});
    //             temp.push(heading);
    //         }
    //     }
    //     /*Yearly Date Selection*/
    //     temp = [];
    //     for (i=0; i<allDate.length; i++) {
    //         dObj = DT.getDateObj(allDate[i]);
    //         if (dObj !== null) {
    //             dObj.setDate(1);
    //             heading = DT.formateDateTime("YYYY", "/", dObj);
    //             startDate = heading +"-01-01 00:00";
    //             endDate = heading +"-12-31 23:59";
    //         } else {
    //             continue;
    //         }
    //         if (temp.indexOf(heading) < 0) {
    //             yearlyDateSelectionFields.push({"dateRange": [startDate, endDate], "dateHeading": heading});
    //             temp.push(heading);
    //         }
    //     }
    //     if (this.dateSelectionFieldsType === "daily") {
    //         dateSelectionFields = $S.clone(dailyDateSelectionFields);
    //     } else if (this.dateSelectionFieldsType === "monthly") {
    //         dateSelectionFields = $S.clone(monthlyDateSelectionFields);
    //     } else if (this.dateSelectionFieldsType === "yearly") {
    //         dateSelectionFields = $S.clone(yearlyDateSelectionFields);
    //     } else if (this.dateSelectionFieldsType === "all") {
    //         heading = "All";
    //         if (allDate.length > 0) {
    //             startDate = allDate[0] + " 00:00";
    //             endDate = allDate[allDate.length-1] + " 23:59";
    //         }
    //         dateSelectionFields.push({"dateRange": [startDate, endDate], "dateHeading": heading});
    //     }
    //     Data.setData("dateSelectionFieldsParameter", dateSelectionFields);
    //     Data.setData("combinedDateSelectionFieldsParameter", {
    //         dailyDateSelectionFields: dailyDateSelectionFields,
    //         monthlyDateSelectionFields: monthlyDateSelectionFields,
    //         yearlyDateSelectionFields: yearlyDateSelectionFields,
    //         dateSelectionFields: dateSelectionFields
    //     });

    //     console.log("dateSelectionFields");
    //     console.log(dateSelectionFields);
    //     return dateSelectionFields;
    // }
    // getChildExposedMethod(name, method) {
    //     if (this.childrenMethod[name]) {
    //         console.log("Method: " + name +" already defined.");
    //     } else {
    //         this.childrenMethod[name] = method;
    //     }
    // }
    // getTemplate(templateName) {
    //     return Data.getTemplate(templateName, null);
    // }
    // getLedgerRowData() {
    //     var dataByCompany, accountData, ledgerDataFields;
    //     accountData = Data.getData("accountData", []);
    //     dataByCompany = Data.getData("dataByCompany", {});
    //     ledgerDataFields = AccountHelper.getLedgerBookFields(this, accountData, dataByCompany);
    //     return ledgerDataFields;
    // }
    // getCurrentBalRowData() {
    //     var accountData, dataByCompany, currentBalanceFields;
    //     accountData = Data.getData("accountData", []);
    //     dataByCompany = Data.getData("dataByCompany", {});
    //     currentBalanceFields = AccountHelper.getCurrentBalanceFields(this, dataByCompany, accountData);
    //     return currentBalanceFields;
    // }
    // getCurrentBalByDateRowData() {
    //     var accountData, dataByCompany, currentBalanceFields, dateSelectionFields;
    //     accountData = Data.getData("accountData", []);
    //     dataByCompany = Data.getData("dataByCompany", {});
    //     dateSelectionFields = Data.getData("dateSelectionFieldsParameter", []);
    //     currentBalanceFields = AccountHelper.getCurrentBalByDateRowData(Data, dataByCompany, accountData, dateSelectionFields);
    //     return currentBalanceFields;
    // }
    // getAccountSummaryFields() {
    //     var accountData, dataByCompany, accountSummaryFields, dateSelectionFields;
    //     accountData = Data.getData("accountData", []);
    //     dataByCompany = Data.getData("dataByCompany", {});
    //     dateSelectionFields = Data.getData("dateSelectionFieldsParameter", []);
    //     accountSummaryFields = AccountHelper.getAccountSummaryFields(Data, dataByCompany, accountData, dateSelectionFields);
    //     return accountSummaryFields;
    // }
    // getAccountSummaryByDateFields() {
    //     var accountData, dataByCompany, dateSelectionFields, accountSummaryByDateFields;
    //     accountData = Data.getData("accountData", []);
    //     dateSelectionFields = Data.getData("dateSelectionFieldsParameter", []);
    //     dataByCompany = Data.getData("dataByCompany", {});
    //     accountSummaryByDateFields = AccountHelper.getAccountSummaryByDateFields(Data, accountData, dateSelectionFields, dataByCompany);
    //     return accountSummaryByDateFields;
    // }
    // getTrialBalanceRowData() {
    //     var accountData, dataByCompany, trialBalanceFields;
    //     accountData = Data.getData("accountData", []);
    //     dataByCompany = Data.getData("dataByCompany", {});
    //     trialBalanceFields = AccountHelper.getTrialBalanceFields(Data, dataByCompany, accountData);
    //     return trialBalanceFields;
    // }
    // getJournalDataByDateFields() {
    //     var journalDataByDateFields, apiJournalDataByDate, dateSelectionFields;
    //     apiJournalDataByDate = Data.getData("apiJournalDataByDate", []);
    //     dateSelectionFields = Data.getData("dateSelectionFieldsParameter", []);
    //     journalDataByDateFields = AccountHelper.getJournalDataByDateFields(Data, apiJournalDataByDate, dateSelectionFields);
    //     return journalDataByDateFields;
    // }
    // getAccountSummaryByCalenderFields() {
    //     var accountData, accountSummaryByCalenderFields, dataByCompany, yearlyDateSelectionFields;
    //     accountData = Data.getData("accountData", []);
    //     yearlyDateSelectionFields = Data.getData("combinedDateSelectionFieldsParameter", {}).yearlyDateSelectionFields;
    //     dataByCompany = Data.getData("dataByCompany", {});
    //     accountSummaryByCalenderFields = AccountHelper.getAccountSummaryByCalenderFields(Data, accountData, dataByCompany, yearlyDateSelectionFields);
    //     return accountSummaryByCalenderFields;
    // }
    // getCustomisedDebitAccountSummaryByCalenderFields() {
    //     var customisedAccountData, customiseDebitAccountSummary, dataByCompany, yearlyDateSelectionFields;
    //     customisedAccountData = Data.getData("customiseDebitAccountData", []);
    //     yearlyDateSelectionFields = Data.getData("combinedDateSelectionFieldsParameter", {}).yearlyDateSelectionFields;
    //     dataByCompany = Data.getData("dataByCompany", {});
    //     customiseDebitAccountSummary = AccountHelper.getCustomisedAccountSummaryByCalenderFields(Data, customisedAccountData, dataByCompany, yearlyDateSelectionFields, "Dr");
    //     return customiseDebitAccountSummary;
    // }
    // getCustomisedCreditAccountSummaryByCalenderFields() {
    //     var customiseCreditAccountData, customiseCreditAccountSummary, dataByCompany, yearlyDateSelectionFields;
    //     customiseCreditAccountData = Data.getData("customiseCreditAccountData", []);
    //     yearlyDateSelectionFields = Data.getData("combinedDateSelectionFieldsParameter", {}).yearlyDateSelectionFields;
    //     dataByCompany = Data.getData("dataByCompany", {});
    //     customiseCreditAccountSummary = AccountHelper.getCustomisedAccountSummaryByCalenderFields(Data, customiseCreditAccountData, dataByCompany, yearlyDateSelectionFields, "Cr");
    //     return customiseCreditAccountSummary;
    // }
    // getCustomiseAccountSummaryFields() {
    //     var customeAccountData, customiseAccountSummary, dataByCompany, yearlyDateSelectionFields;
    //     customeAccountData = Data.getData("customeAccountData", []);
    //     yearlyDateSelectionFields = Data.getData("combinedDateSelectionFieldsParameter", {}).yearlyDateSelectionFields;
    //     dataByCompany = Data.getData("dataByCompany", {});
    //     customiseAccountSummary = AccountHelper.getCustomiseAccountSummaryFields(Data, customeAccountData, dataByCompany, yearlyDateSelectionFields);
    //     return customiseAccountSummary;
    // }
    // getProfitAndLossFields() {
    //     var profitAndLossFields, dataByCompany, yearlyDateSelectionFields, financialStatementConfig;
    //     dataByCompany = Data.getData("dataByCompany", {});
    //     yearlyDateSelectionFields = Data.getData("combinedDateSelectionFieldsParameter", {}).yearlyDateSelectionFields;
    //     financialStatementConfig = Data.getData("currentUserControlData", {}).financialStatementConfig;
    //     profitAndLossFields = AccountHelper2.getProfitAndLossFields(Data, dataByCompany, yearlyDateSelectionFields, financialStatementConfig);
    //     return profitAndLossFields;
    // }
    // dataSetComplete() {
    //     var journalDataFields = AccountHelper.getJournalFields(Data, Data.getData("apiJournalData",[]));
    //     var ledgerDataFields = this.getLedgerRowData();
    //     var currentBalanceFields = this.getCurrentBalRowData();
    //     var trialBalanceFields = this.getTrialBalanceRowData();

    //     var journalDataByDateFields = this.getJournalDataByDateFields();
    //     var currentBalanceByDateFields = this.getCurrentBalByDateRowData();

    //     var accountSummaryFields = this.getAccountSummaryFields();
    //     var accountSummaryByDateFields = this.getAccountSummaryByDateFields();

    //     var accountSummaryByCalenderFields = this.getAccountSummaryByCalenderFields();
    //     var customiseDebitAccountSummary = this.getCustomisedDebitAccountSummaryByCalenderFields();
    //     var customiseCreditAccountSummary = this.getCustomisedCreditAccountSummaryByCalenderFields();
    //     var customiseAccountSummary = this.getCustomiseAccountSummaryFields();
    //     var profitAndLossFields = this.getProfitAndLossFields();

    //     this.setState({journalDataFields: journalDataFields, ledgerDataFields: ledgerDataFields,
    //             trialBalanceFields: trialBalanceFields, currentBalanceFields: currentBalanceFields,
    //             journalDataByDateFields: journalDataByDateFields,
    //             currentBalanceByDateFields: currentBalanceByDateFields,
    //             accountSummaryFields: accountSummaryFields,
    //             accountSummaryByDateFields: accountSummaryByDateFields,
    //             accountSummaryByCalenderFields: accountSummaryByCalenderFields,
    //             customiseDebitAccountSummary: customiseDebitAccountSummary,
    //             customiseCreditAccountSummary: customiseCreditAccountSummary,
    //             customiseAccountSummary: customiseAccountSummary,
    //             profitAndLossFields: profitAndLossFields}, function() {
    //                 $S.log("Data.getAllData()");
    //                 console.log(Data.getAllData());
    //                 $S.log("this.state");
    //                 console.log(this.state);
    //             });
    //     return true;
    // }
    // dataLoadComplete() {
    //     var dataLoadStatus = [];
    //     dataLoadStatus.push(this.accountTemplateLoaded);
    //     dataLoadStatus.push(this.journalDataLoaded);
    //     dataLoadStatus.push(this.journalDataCSVLoaded);
    //     dataLoadStatus.push(this.accountDataLoaded);
    //     var i;
    //     for (i = 0; i < dataLoadStatus.length; i++) {
    //         if (dataLoadStatus[i] === false) {
    //             return false;
    //         }
    //     }
    //     var customiseAccountData = {};

    //     var currentUserControlData = Data.getData("currentUserControlData", {});
    //     var accountData = Data.getData("accountData", []);

    //     customiseAccountData["customiseDebitAccount"] = AccountHelper2.getCustomAccountsData(currentUserControlData, accountData, "customiseDebitAccount");
    //     customiseAccountData["customiseCreditAccount"] = AccountHelper2.getCustomAccountsData(currentUserControlData, accountData, "customiseCreditAccount");
    //     customiseAccountData["customiseCalenderAccount"] = AccountHelper2.getCustomAccountsData(currentUserControlData, accountData, "customiseCalenderAccount");
    //     customiseAccountData["customeAccountData"] = AccountHelper2.getCustomAccountsData(currentUserControlData, accountData, "customeAccount");

    //     Data.setData("customiseDebitAccountData", customiseAccountData["customiseDebitAccount"]);
    //     Data.setData("customiseCreditAccountData", customiseAccountData["customiseCreditAccount"]);
    //     Data.setData("customiseCalenderAccountData", customiseAccountData["customiseCalenderAccount"]);
    //     Data.setData("customeAccountData", customiseAccountData["customeAccountData"])

    //     var apiJournalDataByDate = AccountHelper.getApiJournalDataByDate(Data, Data.getData("apiJournalData",[]));
    //     Data.setData("apiJournalDataByDate", apiJournalDataByDate);

    //     var finalJournalData = AccountHelper.getFinalJournalData(Data, apiJournalDataByDate);
    //     Data.setData("finalJournalData", finalJournalData);
    //     this.setDateSelectionFieldsParameter();
    //     var dataByCompany = AccountHelper.getDataByCompany(Data, finalJournalData, Data.getData("accountData",[]));
    //     Data.setData("dataByCompany", dataByCompany);
    //     this.dataSetComplete();
    //     return true;
    // }
    // fetchData() {
    //     var self = this;
    //     this.accountTemplateLoaded = false;
    //     this.journalDataLoaded = false;
    //     this.journalDataCSVLoaded = false;
    //     this.accountDataLoaded = false;
    //     if ($S.isArray(accountDataApi) && accountDataApi.length) {
    //         $S.loadJsonData(null, accountDataApi, function(response, apiName, ajaxDetails) {
    //             self.accountDataLoaded = true;
    //             if ($S.isArray(response)) {
    //                 // checking unique accountName
    //                 var temp = {};
    //                 for (var i=0; i<response.length; i++) {
    //                     if (temp[response[i].accountName]) {
    //                         alert("Duplicate entry: " + response[i].accountName);
    //                     } else {
    //                         temp[response[i].accountName] = 1;
    //                     }
    //                 }
    //                 Data.setData("accountData", response);
    //             } else {
    //                 Data.addError({"text":ajaxDetails.url, "href":ajaxDetails.url});
    //                 $S.log("Invalid response (accountData):" + response);
    //             }
    //         }, function() {
    //             self.dataLoadComplete();
    //         }, null, Api.getAjaxApiCallMethod());
    //     } else {
    //         self.accountDataLoaded = true;
    //     }
    //     if ($S.isArray(accountTemplateApi) && accountTemplateApi.length) {
    //         var accountTemplate = Data.getData("accountTemplate", {});
    //         $S.loadJsonData(null, accountTemplateApi, function(response, apiName, ajaxDetails) {
    //             if ($S.isObject(response)) {
    //                 Object.assign(accountTemplate, response);
    //             } else {
    //                 Data.addError({"text":ajaxDetails.url, "href":ajaxDetails.url});
    //                 $S.log("Invalid response (accountTemplate):" + response);
    //             }
    //         }, function() {
    //             self.accountTemplateLoaded = true;
    //             Data.setData("accountTemplate", accountTemplate);
    //             self.dataLoadComplete();
    //         }, null, Api.getAjaxApiCallMethod());
    //     } else {
    //         self.accountTemplateLoaded = true;
    //     }
    //     if ($S.isArray(journalDataApi) && journalDataApi.length) {
    //         var journalData = [];
    //         $S.loadJsonData(null, journalDataApi, function(response, apiName, ajaxDetails) {
    //             if ($S.isObject(response)) {
    //                 journalData.push(response);
    //             } else {
    //                 Data.addError({"text":ajaxDetails.url, "href":ajaxDetails.url});
    //                 $S.log("Invalid response (journalData):" + response);
    //             }
    //         }, function() {
    //             self.journalDataLoaded = true;
    //             var apiJournalData = Data.getData("apiJournalData", []);
    //             apiJournalData = apiJournalData.concat(journalData);
    //             Data.setData("apiJournalData", apiJournalData);
    //             self.dataLoadComplete();
    //         }, null, Api.getAjaxApiCallMethod());
    //     } else {
    //         self.journalDataLoaded = true;
    //     }
    //     if ($S.isArray(journalDataApiCSV) && journalDataApiCSV.length) {
    //         var apiJournalDataCSV = [];
    //         $S.loadJsonData(null, journalDataApiCSV, function(response, apiName, ajaxDetails) {
    //             if ($S.isString(response)) {
    //                 apiJournalDataCSV.push(response);
    //             } else {
    //                 Data.addError({"text":ajaxDetails.url, "href":ajaxDetails.url});
    //                 $S.log("Invalid response (journalData):" + response);
    //             }
    //         }, function() {
    //             self.journalDataCSVLoaded = true;
    //             var csvToJSONJournalData = AccountHelper.convertCSVToJsonJournalData(Data, apiJournalDataCSV);;
    //             var apiJournalData = Data.getData("apiJournalData",[]);
    //             apiJournalData = apiJournalData.concat(csvToJSONJournalData);
    //             Data.setData("apiJournalData", apiJournalData);
    //             self.dataLoadComplete();
    //         }, null, Api.getAjaxApiCallMethodV2());
    //     } else {
    //         self.journalDataCSVLoaded = true;
    //     }
    // }
    // userChange(currentUserName, disableFlushError) {
    //     Data.initData();
    //     this.currentUserName = currentUserName;
        /*Reseting all values */
        // this.setState({
        //     isLoaded: false,
        //     journalDataFields: [],
        //     journalDataByDateFields: [],
        //     ledgerDataFields: [],
        //     trialBalanceFields: [],
        //     currentBalanceFields: [],
        //     currentBalanceByDateFields: [],
        //     accountSummaryFields: [],
        //     accountSummaryByDateFields: [],
        //     accountSummaryByCalenderFields: [],
        //     customiseDebitAccountSummary: [],
        //     customiseCreditAccountSummary: [],
        //     customiseAccountSummary: [],
        //     profitAndLossFields: []
        // }, function() {
        //     if (!$S.isBooleanTrue(disableFlushError)) {
        //         Data.clearError();
        //     }
        //     var userDataNotFound = true;
        //     var userControlData = Data.getData("userControlData", []);
        //     for(var i=0; i<userControlData.length; i++) {
        //         if (userControlData[i].username === this.currentUserName) {
        //             this.companyName = userControlData[i]["companyname"];
        //             Data.setData("currentUserControlData", userControlData[i]);
        //             setDataApi();
        //             this.fetchData();
        //             userDataNotFound = false;
        //             break;
        //         }
        //     }
        //     if (userDataNotFound) {
        //         this.companyName = "No Data Found";
        //         this.setState({isLoaded: false});
        //     }
        // });
    //     return 1;
    // }
    // onDateSelectionFieldsTypeChange(dateSelectionFieldsType) {
    //     if (this.dateSelectionFieldsType === dateSelectionFieldsType || this.validDateSelectionFieldsType.indexOf(dateSelectionFieldsType) < 0) {
    //         return false;
    //     }
    //     this.dateSelectionFieldsType = dateSelectionFieldsType;
    //     this.setDateSelectionFieldsParameter();
    //     var dataLoadStatus = [], i;
    //     dataLoadStatus.push(this.accountTemplateLoaded);
    //     dataLoadStatus.push(this.journalDataLoaded);
    //     dataLoadStatus.push(this.accountDataLoaded);
    //     for (i = 0; i < dataLoadStatus.length; i++) {
    //         if (dataLoadStatus[i] === false) {
    //             this.setState({isLoaded: false});
    //             return false;
    //         }
    //     }
    //     this.dataSetComplete();
    //     return true;
    // }

    appStateCallback(stateData) {
        $S.log("App:appStateCallback");
        this.setState({isLoaded: true});
    }
    appDataCallback(name, data) {
        DataHandler(this.appData).update(name, data);
    }
    componentDidMount() {
        $S.log("App:componentDidMount");
        var appDataCallback = this.appDataCallback;
        var appStateCallback = this.appStateCallback;
        DataHandler.AppComponentDidMount(appStateCallback, appDataCallback);
        // var self = this;
        // $S.loadJsonData(null, [userControlDataApi], function(response, apiName, ajaxDetails) {
            // if ($S.isArray(response)) {
            //     // checking unique username
            //     var temp = {};
            //     for (var i=0; i<response.length; i++) {
            //         if (temp[response[i].username]) {
            //             alert("Duplicate entry: " + response[i].username);
            //         } else {
            //             temp[response[i].username] = 1;
            //         }
            //     }
            //     Data.setData("userControlData", response);
            //     if (response.length > 0) {
            //         self.currentUserName = response[0].username;
            //         if ($S.isString(response[0].dateSelectionFieldsType)) {
            //             if (self.validDateSelectionFieldsType.indexOf(response[0].dateSelectionFieldsType) >= 0) {
            //                 self.dateSelectionFieldsType = response[0].dateSelectionFieldsType;
            //             }
            //         }
            //     }
            // } else {
            //     Data.addError({"text":ajaxDetails.url, "href":ajaxDetails.url});
            //     $S.log("Invalid response (userControlDataApi):" + response);
            // }
        //     self.userChange(self.currentUserName, true);
        // }, null, null, Api.getAjaxApiCallMethod());
    }
    render() {
        var methods = {
                appStateCallback: this.appStateCallback,
                appDataCallback: this.appDataCallback,
                addTab: this.addTab, removeTab: this.removeTab
            };

        var commonData = this.appData;

        const journal = (props) => (<JournalByDate {...props} data={commonData} methods={methods}
                        renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.journal}/>);

        const trial = (props) => (<JournalByDate {...props} data={commonData} methods={methods}
                            renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.trialbalance}/>);

        const journalbydate = (props) => (<JournalByDate {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.journalbydate}/>);

        const ledger = (props) => (<LedgerBook {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.ledger}/>);

        const currentbal = (props) => (<LedgerBook {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.currentbal}/>);

        const currentbalbydate = (props) => (<JournalByDate {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.currentbalbydate}/>);

        const summary = (props) => (<JournalByDate {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.summary}/>);

        const summaryByDate = (props) => (<JournalByDate {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.accountsummarybydate}/>);

        const accountsummarybycalander = (props) => (<JournalByDate {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.accountsummarybycalander}/>);

        const customisedebit = (props) => (<JournalByDate {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.customisedebit}/>);

        const customisecredit = (props) => (<JournalByDate {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.customisecredit}/>);

        const custompage = (props) => (<JournalByDate {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.custompage}/>);

        const profitandloss = (props) => (<JournalByDate {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.profitandloss}/>);

        return (<BrowserRouter>
            <Switch>
                <Route exact path={pages.home}
                    render={props => (
                        <Home {...props} data={commonData} methods={methods} currentPageName="home"/>
                    )}
                />
                <Route path={pages.journal} component={journal}/>
                <Route path={pages.journalbydate} component={journalbydate}/>
                <Route path={pages.currentbal} component={currentbal}/>
                <Route path={pages.currentbalbydate} component={currentbalbydate}/>
                <Route path={pages.ledger} component={ledger}/>
                <Route path={pages.summary} component={summary}/>
                <Route path={pages.accountsummarybydate} component={summaryByDate}/>
                <Route path={pages.trialbalance} component={trial} />
                <Route path={pages.accountsummarybycalander} component={accountsummarybycalander} />
                <Route path={pages.customisedebit} component={customisedebit} />
                <Route path={pages.customisecredit} component={customisecredit} />
                <Route path={pages.custompage} component={custompage} />
                <Route path={pages.profitandloss} component={profitandloss} />
                <Route render={props => (
                    <JournalByDate {...props} data={commonData} methods={methods}
                        renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.noMatch}/>
                    )}
                />
            </Switch>
        </BrowserRouter>);
    }
}

export default App;

