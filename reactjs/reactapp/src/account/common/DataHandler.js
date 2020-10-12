import $S from '../../interface/stack.js';
// import TemplateHelper from '../../common/TemplateHelper';
import Api from '../../common/Api';

import Config from "./Config";
import AccountHelper from "./AccountHelper";
import AccountHelper2 from "./AccountHelper2";
import Template from "./Template";

var DataHandler;

(function($S){

var DT = $S.getDT();
var RequestId = $S.getRequestId();

var CurrentData = $S.getDataObj();

var keys = ["userControlData", "apiJournalData",
            "finalJournalData", "apiJournalDataByDate",
            "customiseDebitAccountData", "customiseCreditAccountData", "customeAccountData",
            "customiseCalenderAccountData"];

keys.push("accountTemplate");
keys.push("metaData");
keys.push("dataByCompany");

keys.push("dateSelectionParameter");
keys.push("combinedDateSelectionParameter");
keys.push("selectedDateType");
keys.push("dateSelectionFields");
keys.push("dropdownFields");
keys.push("accounts");


keys.push("firstTimeDataLoadStatus");
keys.push("appControlDataLoadStatus");
keys.push("templateDataLoadStatus");
keys.push("metaDataLoadStatus");
keys.push("journalDataCsvLoadStatus");
keys.push("journalDataJsonLoadStatus");

keys.push("errorsData");
keys.push("currentUserName");
keys.push("currentUserControlData");
keys.push("currentPageName");
keys.push("availableDataPageName");


CurrentData.setKeys(keys);
CurrentData.setData("firstTimeDataLoadStatus", "not-started");
CurrentData.setData("journalDataCsvLoadStatus", "not-started");
CurrentData.setData("appControlDataLoadStatus", "not-started");


DataHandler = function(arg) {
    return new DataHandler.fn.init(arg);
};

DataHandler.fn = DataHandler.prototype = {
    constructor: DataHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    },
    toFixed: function(decimal) {
        if ($S.isNumber(decimal) && $S.isNumeric(this.arg)) {
            this.arg = this.arg.toFixed(2)*1;
        }
        return this.arg;
    },
    update: function(name, data) {
        if (!$S.isObject(this.arg)) {
            return;
        }
        if (typeof this.arg[name] === typeof data) {
            if (typeof data === "object") {
                if ($S.isArray(data) === $S.isArray(this.arg[name])) {
                    this.arg[name] = data;
                } else if ($S.isObject(data) === $S.isObject(this.arg[name])) {
                    this.arg[name] = data;
                }
            } else {
                this.arg[name] = data;
            }
        }
    }
};
$S.extendObject(DataHandler);
DataHandler.extend({
    setData: function(key, value) {
        return CurrentData.setData(key, value);
    },
    getData: function(key, defaultValue) {
        return CurrentData.getData(key, defaultValue);
    },
    addDataInArray: function(key, value) {
        var arrayData = this.getData(key, []);
        if ($S.isArray(arrayData)) {
            arrayData.push(value);
            this.setData(key, arrayData);
        }
    },
    initData: function() {
        var defaultData, allData = CurrentData.getAllData();
        for (var i = 0; i < keys.length; i++) {
            if (["userControlData", "accountTemplate",
                "currentUserName", "currentPageName", "selectedDateType",
                "firstTimeDataLoadStatus", "appControlDataLoadStatus", "metaDataLoadStatus",
                "journalDataCsvLoadStatus", "journalDataJsonLoadStatus", "templateDataLoadStatus",
                "dropdownFields","dateSelectionFields"].indexOf(keys[i]) >= 0) {
                continue;
            }
            defaultData = [];
            if ($S.isObject(allData[keys[i]])) {
                defaultData = {};
            }
            CurrentData.setData(keys[i], defaultData);
        }
    }
});

DataHandler.extend({
    getDataLoadStatus: function() {
        var dataLoadStatus = [];
        dataLoadStatus.push(DataHandler.getData("appControlDataLoadStatus", ""));
        dataLoadStatus.push(DataHandler.getData("metaDataLoadStatus", ""));
        dataLoadStatus.push(DataHandler.getData("journalDataCsvLoadStatus", ""));
        dataLoadStatus.push(DataHandler.getData("journalDataJsonLoadStatus", ""));
        dataLoadStatus.push(DataHandler.getData("templateDataLoadStatus", ""));
        for (var i = 0; i < dataLoadStatus.length; i++) {
            if (dataLoadStatus[i] !== "completed") {
                return "";
            }
        }
        return "completed";
    }
});

DataHandler.extend({
    getApisFromUserData: function(apiName) {
        var currentUserControlData = DataHandler.getData("currentUserControlData", {});
        var apis = [];
        if ($S.isObject(currentUserControlData) && $S.isArray(currentUserControlData[apiName])) {
            for (var i = 0; i < currentUserControlData[apiName].length; i++) {
                apis.push(Config.baseapi + currentUserControlData[apiName][i] + "?" + RequestId);
            }
        }
        return apis;
    },
    getFinancialStatementConfigFromUserData: function() {
        var currentUserControlData = DataHandler.getData("currentUserControlData", {});
        if ($S.isObject(currentUserControlData.financialStatementConfig)) {
            return currentUserControlData.financialStatementConfig;
        }
        return {};
    },
    getCompanyName: function() {
        var currentUserControlData = DataHandler.getData("currentUserControlData", {});
        if ($S.isString(currentUserControlData.companyname) && currentUserControlData.companyname.length > 0) {
            return currentUserControlData.companyname;
        }
        var currentUserName = DataHandler.getData("currentUserName", "");
        return currentUserName;
    },
    getMetaDataAccounts: function() {
        var metaData = DataHandler.getData("metaData", {});
        if ($S.isObject(metaData) && $S.isArray(metaData.accounts)) {
            return metaData.accounts;
        }
        return [];
    },
    getMetaDataDateSelection: function() {
        var metaData = DataHandler.getData("metaData", {});
        if ($S.isObject(metaData) && $S.isArray(metaData.dateSelection)) {
            return metaData.dateSelection;
        }
        return [];
    },
    getMetaDataDropdownFields: function() {
        var metaData = DataHandler.getData("metaData", {});
        var dropdownFields = [];
        if ($S.isObject(metaData) && $S.isArray(metaData.dropdownFields)) {
            for (var i = 0; i < metaData.dropdownFields.length; i++) {
                metaData.dropdownFields[i].toUrl = Config.pages[metaData.dropdownFields[i].name];
                if (!this.isDisabledPage(metaData.dropdownFields[i].name)) {
                    dropdownFields.push(metaData.dropdownFields[i]);
                }
            }
        }
        return dropdownFields;
    },
    getMetaDataHomeFields: function() {
        var metaData = DataHandler.getData("metaData", {});
        var homeFields = [];
        if ($S.isObject(metaData) && $S.isArray(metaData.homeFields)) {
            for (var i = 0; i < metaData.homeFields.length; i++) {
                metaData.homeFields[i].toUrl = Config.pages[metaData.homeFields[i].name];
                if (!this.isDisabledPage(metaData.homeFields[i].name)) {
                    homeFields.push(metaData.homeFields[i]);
                }
            }
        }
        return homeFields;
    },
    getMetaDataPageHeading: function(pageName) {
        var pageHeading = "Page Not Found";
        if (this.isDisabledPage(pageName)) {
            return pageHeading;
        }
        if ($S.isString(Config.pages[pageName]) && Config.pages[pageName].length > 0) {
            pageHeading = $S.capitalize(pageName.trim());
        }
        var dropdownFields = DataHandler.getData("dropdownFields", []);
        for (var i = 0; i < dropdownFields.length; i++) {
            if (dropdownFields[i].name === pageName) {
                pageHeading = dropdownFields[i].toText;
                break;
            }
        }
        return pageHeading;
    },
    isDisabledPage: function(pageName) {
        var metaData = DataHandler.getData("metaData", {});
        var disabledPages = metaData.disabledPages;
        if ($S.isArray(disabledPages) && $S.isString(pageName)) {
            return disabledPages.indexOf(pageName) >= 0;
        }
        return false;
    }
});

DataHandler.extend({
    AppComponentDidMount: function(appStateCallback, appDataCallback) {
        DataHandler.setData("appControlDataLoadStatus", "in-progress");
        $S.loadJsonData(null, Config.appControlApi, function(response, apiName, ajax){
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
                DataHandler.setData("userControlData", response);
                if (response.length > 0) {
                    DataHandler.setData("currentUserName", response[0].username);
                    if ($S.isString(response[0].dateSelectionType)) {
                        DataHandler.setData("selectedDateType", response[0].dateSelectionType);
                    }
                } else {
                    DataHandler.addDataInArray({"text":ajax.url, "href":ajax.url});
                    $S.log("Invalid response (userControlDataApi):" + response);
                }
            }
        }, function() {
            DataHandler.setData("appControlDataLoadStatus", "completed");
            DataHandler.OnUserChange(appStateCallback, appDataCallback, true);
        }, null, Api.getAjaxApiCallMethod());
    },
    PageComponentMount: function(appStateCallback, appDataCallback, pageName) {
        DataHandler.setData("currentPageName", pageName);
        DataHandler.setCurrentPageData(appStateCallback, appDataCallback);
    },
    DateSelectionChange: function(appStateCallback, appDataCallback, selectedDateType) {
        DataHandler.setData("availableDataPageName", "");
        DataHandler.setData("selectedDateType", selectedDateType);
        var combinedDateSelectionParameter = DataHandler.getData("combinedDateSelectionParameter", {});
        DataHandler.setData("dateSelectionParameter", combinedDateSelectionParameter[selectedDateType]);
        DataHandler.setCurrentPageData(appStateCallback, appDataCallback);
    },
    UserChange: function(appStateCallback, appDataCallback, username) {
        DataHandler.setData("currentUserName", username);
        DataHandler.OnUserChange(appStateCallback, appDataCallback, false);
    },
    FireRender: function(appStateCallback, appDataCallback) {
        var currentUserName = DataHandler.getData("currentUserName", "");
        var currentPageName = DataHandler.getData("currentPageName", "");
        var dataLoadStatus = DataHandler.getDataLoadStatus();
        var companyName = DataHandler.getCompanyName();
        appDataCallback("userControlData", DataHandler.getData("userControlData", []));
        appDataCallback("companyName", companyName);
        appDataCallback("pageHeading", DataHandler.getMetaDataPageHeading(currentPageName));
        appDataCallback("dateSelectionFields", DataHandler.getData("dateSelectionFields", []));
        appDataCallback("homeFields", DataHandler.getMetaDataHomeFields());
        appDataCallback("dropdownFields", DataHandler.getData("dropdownFields", []));
        appDataCallback("currentUserName", currentUserName);
        appDataCallback("currentPageName", currentPageName);
        appDataCallback("selectedDateType", DataHandler.getData("selectedDateType", ""));
        appDataCallback("errorsData", DataHandler.getData("errorsData", []));
        appDataCallback("renderFieldRow", AccountHelper.getRenderTemplate());
        appDataCallback("dataLoadStatus", dataLoadStatus);
        appDataCallback("firstTimeDataLoadStatus", DataHandler.getData("firstTimeDataLoadStatus"));
        var reloadText = "Reload";
        if (dataLoadStatus !== "completed") {
            reloadText = "Loading...";
        }
        appDataCallback("reloadText", reloadText);
        appStateCallback();
    }
});

DataHandler.extend({
    OnUserChange: function(appStateCallback, appDataCallback, flushError) {
        if (!$S.isBooleanTrue(false)) {
            DataHandler.setData("errorsData", []);
        }
        // clear all data in appData
        DataHandler.initData();
        var userControlData = DataHandler.getData("userControlData", []);
        var currentUserName = DataHandler.getData("currentUserName", "");
        for(var i=0; i<userControlData.length; i++) {
            if (userControlData[i].username === currentUserName) {
                DataHandler.setData("currentUserControlData", userControlData[i]);
                DataHandler.loadCurrentUserData(appStateCallback, appDataCallback);
                break;
            }
        }
        DataHandler.FireRender(appStateCallback, appDataCallback);
    }
});

DataHandler.extend({
    setCurrentPageData: function(appStateCallback, appDataCallback) {
        var pageName = DataHandler.getData("currentPageName", "");
        var availableDataPageName = DataHandler.getData("availableDataPageName", "");
        if (availableDataPageName === pageName) {
            return;
        }
        DataHandler.setData("availableDataPageName", pageName);
        DataHandler.FireRender(appStateCallback, appDataCallback);
    },
    getTemplate: function(key, defaultTemplate) {
        var allTemplate = Template;
        if ($S.isObject(allTemplate)) {
            if ($S.isDefined(allTemplate[key])) {
                return $S.clone(allTemplate[key]);
            }
        }
        return defaultTemplate;
    }
});

DataHandler.extend({
    loadCurrentUserData: function(appStateCallback, appDataCallback) {
        DataHandler.setData("templateDataLoadStatus", "in-progress");
        DataHandler.setData("metaDataLoadStatus", "in-progress");
        DataHandler.setData("journalDataCsvLoadStatus", "in-progress");
        DataHandler.setData("journalDataJsonLoadStatus", "in-progress");
        var templateDataApi = DataHandler.getApisFromUserData("accountTemplateApi");
        var metaDataApi = DataHandler.getApisFromUserData("metaDataApi");
        var journalDataCsvApi = DataHandler.getApisFromUserData("journalDataApiCSV");
        var journalDataJsonApi = DataHandler.getApisFromUserData("journalDataApi");
        if (templateDataApi.length > 0) {
            var accountTemplate = {};
            $S.loadJsonData(null, templateDataApi, function(response, apiName, ajaxDetails) {
                if ($S.isObject(response)) {
                    Object.assign(accountTemplate, response);
                } else {
                    DataHandler.addDataInArray("errorsData", {"text":ajaxDetails.url, "href":ajaxDetails.url});
                    $S.log("Invalid response (accountTemplate):" + response);
                }
            }, function() {
                DataHandler.setData("templateDataLoadStatus", "completed");
                DataHandler.setData("accountTemplate", accountTemplate);
                DataHandler.dataLoadComplete(appStateCallback, appDataCallback);
            }, null, Api.getAjaxApiCallMethod());
        } else {
            DataHandler.setData("templateDataLoadStatus", "completed");
        }
        if (metaDataApi.length > 0) {
            $S.loadJsonData(null, metaDataApi, function(response, apiName, ajaxDetails) {
                if ($S.isObject(response)) {
                    // checking unique accountName
                    var accountsData = $S.isArray(response.accounts) ? response.accounts : [];
                    var temp = {};
                    for (var i=0; i<accountsData.length; i++) {
                        if (temp[accountsData[i].accountName]) {
                            alert("Duplicate entry: " + accountsData[i].accountName);
                        } else {
                            temp[accountsData[i].accountName] = 1;
                        }
                    }
                    DataHandler.setData("metaData", response);
                } else {
                    DataHandler.addDataInArray("errorsData", {"text":ajaxDetails.url, "href":ajaxDetails.url});
                    $S.log("Invalid response (metaData):" + response);
                }
            }, function() {
                DataHandler.setData("metaDataLoadStatus", "completed");
                DataHandler.dataLoadComplete(appStateCallback, appDataCallback);
            }, null, Api.getAjaxApiCallMethod());
        } else {
            DataHandler.setData("metaDataLoadStatus", "completed");
        }
        if (journalDataCsvApi.length > 0) {
            var apiJournalDataCSV = [];
            $S.loadJsonData(null, journalDataCsvApi, function(response, apiName, ajaxDetails) {
                if ($S.isString(response)) {
                    apiJournalDataCSV.push(response);
                } else {
                    DataHandler.addDataInArray("errorsData", {"text":ajaxDetails.url, "href":ajaxDetails.url});
                    $S.log("Invalid response (csvJournalData):" + response);
                }
            }, function() {
                DataHandler.setData("journalDataCsvLoadStatus", "completed");
                var csvToJSONJournalData = AccountHelper.convertCSVToJsonJournalData(apiJournalDataCSV);;
                var apiJournalData = DataHandler.getData("apiJournalData",[]);
                apiJournalData = apiJournalData.concat(csvToJSONJournalData);
                DataHandler.setData("apiJournalData", apiJournalData);
                DataHandler.dataLoadComplete(appStateCallback, appDataCallback);
            }, null, Api.getAjaxApiCallMethodV2());
        } else {
            DataHandler.setData("journalDataCsvLoadStatus", "completed");
        }
        if (journalDataJsonApi.length > 0) {
            var journalData = [];
            $S.loadJsonData(null, journalDataJsonApi, function(response, apiName, ajaxDetails) {
                if ($S.isObject(response)) {
                    journalData.push(response);
                } else {
                    DataHandler.addDataInArray("errorsData", {"text":ajaxDetails.url, "href":ajaxDetails.url});
                    $S.log("Invalid response (jsonJournalData):" + response);
                }
            }, function() {
                DataHandler.setData("journalDataJsonLoadStatus", "completed");
                var apiJournalData = DataHandler.getData("apiJournalData", []);
                apiJournalData = apiJournalData.concat(journalData);
                DataHandler.setData("apiJournalData", apiJournalData);
                DataHandler.dataLoadComplete(appStateCallback, appDataCallback);
            }, null, Api.getAjaxApiCallMethod());
        } else {
            DataHandler.setData("journalDataJsonLoadStatus", "completed");
        }
    }
});

DataHandler.extend({
    _generateDateSelectionParameter: function(allDateStr) {
        var dailyDateSelection = [];
        var monthlyDateSelection = [];
        var yearlyDateSelection = [];
        var allDateSelection = [];
        var allDate = [];
        if ($S.isArray(allDateStr)) {
            allDate = allDateStr;
        }
        var i, temp, heading, startDate, endDate;
        /*Daily Date Selection*/
        for (i=0; i<allDate.length; i++) {
            temp = allDate[i];
            dailyDateSelection.push({"dateRange": [temp+" 00:00", temp+" 23:59"], "dateHeading": temp});
        }
        /*Monthly Date Selection*/
        temp = [];
        var dObj;
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
                monthlyDateSelection.push({"dateRange": [startDate, endDate], "dateHeading": heading});
                temp.push(heading);
            }
        }
        /*Yearly Date Selection*/
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
                yearlyDateSelection.push({"dateRange": [startDate, endDate], "dateHeading": heading});
                temp.push(heading);
            }
        }
        /*All Date Selection*/
        if (allDate.length > 0) {
            allDateSelection.push({"dateRange": [allDate[0] + " 00:00", allDate[allDate.length-1] + " 23:59"], "dateHeading": "All"});
        }
        var combinedDateSelectionParameter = {};
        combinedDateSelectionParameter["daily"] = dailyDateSelection;
        combinedDateSelectionParameter["monthly"] = monthlyDateSelection;
        combinedDateSelectionParameter["yearly"] = yearlyDateSelection;
        combinedDateSelectionParameter["all"] = allDateSelection;
        return combinedDateSelectionParameter;
    },
    dataLoadComplete: function(appStateCallback, appDataCallback) {
        var dataLoadStatus = DataHandler.getDataLoadStatus();
        if (dataLoadStatus !== "completed") {
            return false;
        }
        DataHandler.setData("firstTimeDataLoadStatus", "completed");
        var apiJournalData = DataHandler.getData("apiJournalData", []);
        var apiJournalDataByDate = AccountHelper.getApiJournalDataByDate(apiJournalData);
        var finalJournalData = AccountHelper.getFinalJournalData(apiJournalDataByDate);
        DataHandler.setData("apiJournalDataByDate", apiJournalDataByDate);
        DataHandler.setData("finalJournalData", finalJournalData);

        DataHandler.setData("availableDataPageName", "");
        DataHandler.setData("dateSelectionFields", DataHandler.getMetaDataDateSelection());
        DataHandler.setData("dropdownFields", DataHandler.getMetaDataDropdownFields());
        DataHandler.setData("accounts", DataHandler.getMetaDataAccounts());

        var dataByCompany = AccountHelper.getDataByCompany(finalJournalData);
        DataHandler.setData("dataByCompany", dataByCompany);

        var currentUserControlData = DataHandler.getData("currentUserControlData", []);
        var customiseDebitAccountData = AccountHelper2.getCustomAccountsData(currentUserControlData, "customiseDebitAccount");
        var customiseCreditAccountData = AccountHelper2.getCustomAccountsData(currentUserControlData, "customiseCreditAccount");
        var customiseCalenderAccountData = AccountHelper2.getCustomAccountsData(currentUserControlData, "customiseCalenderAccount");
        var customeAccountData = AccountHelper2.getCustomAccountsData(currentUserControlData, "customeAccount");
        DataHandler.setData("customiseDebitAccountData", customiseDebitAccountData);
        DataHandler.setData("customiseCreditAccountData", customiseCreditAccountData);
        DataHandler.setData("customiseCalenderAccountData", customiseCalenderAccountData);
        DataHandler.setData("customeAccountData", customeAccountData);

        var allDateStr = [], i, j, temp;
        if ($S.isArray(finalJournalData)) {
            for (i = 0; i < finalJournalData.length; i++) {
                if ($S.isArray(finalJournalData[i].entry)) {
                    for (j=0; j<finalJournalData[i].entry.length; j++) {
                        temp = finalJournalData[i].entry[j].date;
                        temp = DT.getDateObj(temp);
                        if (temp !== null) {
                            temp = DT.formateDateTime("YYYY/-/MM/-/DD", "/", temp);
                            if (allDateStr.indexOf(temp) < 0) {
                                allDateStr.push(temp);
                            }
                        }
                    }
                }
            }
        }
        var allDateSelection = DataHandler._generateDateSelectionParameter(allDateStr);
        var dateSelectionType = DataHandler.getData("selectedDateType", "");
        DataHandler.setData("combinedDateSelectionParameter", allDateSelection);
        DataHandler.setData("dateSelectionParameter", allDateSelection[dateSelectionType]);
        DataHandler.setCurrentPageData(appStateCallback, appDataCallback);
    }
});

})($S);

export default DataHandler;
