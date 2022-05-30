import $S from '../../interface/stack.js';
// import TemplateHelper from '../../common/TemplateHelper';
import Api from '../../common/Api';
import AppHandler from "../../common/app/common/AppHandler";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";

import Config from "./Config";
// import AccountHelper from "./AccountHelper";
// import AccountHelper2 from "./AccountHelper2";
import DataHandlerV2 from "./DataHandlerV2";
// import Template from "./Template";
import TemplateHandler from "./TemplateHandler";

var DataHandler;

(function($S){

// var DT = $S.getDT();

var CurrentData = $S.getDataObj();

var keys = ["userControlData", "apiJournalDataJson", "apiJournalDataCsv",
            "finalJournalData", "apiJournalDataByDate",
            "customiseDebitAccountData", "customiseCreditAccountData", "customeAccountData",
            "customiseCalenderAccountData"];

keys.push("metaData");

keys.push("pageName");
keys.push("pathParams");
keys.push("appControlData");
keys.push("appControlMetaData");
keys.push("displayLoading");
keys.push("currentList3Id");
keys.push("sortingFields");
keys.push("dbViewData");

// keys.push("companyName");
keys.push("dataByCompany");

keys.push("dateSelectionParameter");
keys.push("combinedDateSelectionParameter");
keys.push("selectedDateType");
keys.push("homeFields");
keys.push("dropdownFields");
keys.push("accounts");

keys.push("loginUserDetailsLoadStatus");
keys.push("dbDataLoadStatus");
keys.push("firstTimeDataLoadStatus");
keys.push("appControlDataLoadStatus");
keys.push("metaDataLoadStatus");
keys.push("tableDataLoadStatus");
// keys.push("journalDataJsonLoadStatus");

keys.push("errorsData");
keys.push("currentUserName");
keys.push("currentUserControlData");
// keys.push("currentPageName");
keys.push("availableDataPageName");


CurrentData.setKeys(keys);
CurrentData.setData("firstTimeDataLoadStatus", "not-started");
CurrentData.setData("loginUserDetailsLoadStatus", "not-started");
CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("dbDataLoadStatus", "not-started");
CurrentData.setData("tableDataLoadStatus", "not-started");


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
        return $S.numberToFixed(this.arg, decimal);
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
    // initData: function() {
    //     var defaultData, allData = CurrentData.getAllData();
    //     for (var i = 0; i < keys.length; i++) {
    //         if (["userControlData", "errorsData",
    //             "currentUserName", "companyName", "selectedDateType",
    //             "firstTimeDataLoadStatus", "appControlDataLoadStatus", "metaDataLoadStatus",
    //             "journalDataCsvLoadStatus", "journalDataJsonLoadStatus",
    //             "homeFields", "dropdownFields"].indexOf(keys[i]) >= 0) {
    //             continue;
    //         }
    //         defaultData = [];
    //         if ($S.isObject(allData[keys[i]])) {
    //             defaultData = {};
    //         }
    //         CurrentData.setData(keys[i], defaultData);
    //     }
    // },
    getPageUrl: function(appId, pageName) {
        var url = Config.basepathname;
        if (!$S.isStringV2(appId)) {
            appId = "0";
        }
        url += "/" + appId;
        if ($S.isStringV2(pageName)) {
            url += "/" + pageName;
        }
        return url;
    },
    getOtherPagesUrlByPageName: function(pageName) {
        var appId = this.getPathParamsData("pid", "");
        return this.getPageUrl(appId, pageName);
    },
    send: function(trackingAction, eventCategory, eventLabel) {
        if (Config.gtag) {
            $S.pushGAEvent(Config.gtag, trackingAction, eventCategory, eventLabel);
        }
    },
    TrackPageView: function(pageName) {
        if (!$S.isString(pageName) || pageName.length < 1) {
            pageName = "empty-pageName";
        }
        DataHandler.send("pageView", pageName, DataHandler.getPageUrl());
    },
    TrackSectionView: function(trackingAction, userName) {
        if (!$S.isString(userName) || userName.length < 1) {
            userName = "empty-userName";
        }
        DataHandler.send("sectionView", userName+":"+trackingAction, DataHandler.getPageUrl());
    },
    TrackDateSelection: function(selectedDateType) {
        if (!$S.isString(selectedDateType) || selectedDateType.length < 1) {
            selectedDateType = "empty-selectedDateType";
        }
        var currentUserName = DataHandler.getData("currentUserName", "");
        if (!$S.isString(currentUserName) || currentUserName.length < 1) {
            currentUserName = "empty-currentUserName";
        }
        DataHandler.send("dateSelection", currentUserName+":"+selectedDateType, DataHandler.getPageUrl());
    }
});

DataHandler.extend({
    getDataLoadStatus: function() {
        var dataLoadStatusKey = [];
        dataLoadStatusKey.push("loginUserDetailsLoadStatus");
        dataLoadStatusKey.push("appControlDataLoadStatus");
        var pageName1 = this.getData("pageName", "");
        var pageName2 = this.getPathParamsData("pageName", "");
        if ([Config.home, Config.otherPages].indexOf(pageName1) >= 0) {
            dataLoadStatusKey.push("metaDataLoadStatus");
        }
        var pageRequiredDbDataLoadStatus = Config.otherPagesList;
        if (pageRequiredDbDataLoadStatus.indexOf(pageName2) >= 0) {
            dataLoadStatusKey.push("dbDataLoadStatus");
            dataLoadStatusKey.push("tableDataLoadStatus");
        }
        if(CommonDataHandler.getDataLoadStatusByKeyV2(this, dataLoadStatusKey) !== "completed") {
            return false;
        }
        DataHandler.setData("firstTimeDataLoadStatus", "completed");
        return true;
    },
    setAppData: function(appStateCallback, appDataCallback) {
        var pageName = this.getData("pageName", "");
        if ([Config.projectHome, Config.noMatch].indexOf(pageName) >= 0) {
            this.setData("metaDataLoadStatus", "not-started");
            this.setData("dbDataLoadStatus", "not-started");
            this.setData("tableDataLoadStatus", "not-started");
        } else if ([Config.home].indexOf(pageName) >= 0) {
            this.setData("dbDataLoadStatus", "not-started");
            this.setData("tableDataLoadStatus", "not-started");
        }
    }
});

DataHandler.extend({
    getList3DataById: function(list3Id) {
        var list3Data = [];//DataHandlerV3.getList3Data();
        var currentList3Data = {};
        if ($S.isArray(list3Data)) {
            for(var i=0; i<list3Data.length; i++) {
                if ($S.isObject(list3Data[i])) {
                    if (list3Data[i]["name"] === list3Id) {
                        currentList3Data = list3Data[i];
                        break;
                    }
                }
            }
        }
        return currentList3Data;
    },
    getCurrentList3Data: function() {
        var currentList3Id = DataHandler.getData("currentList3Id", "");
        return this.getList3DataById(currentList3Id);
    },
    getPathParamsData: function(key, defaultValue) {
        var pathParams = this.getData("pathParams", {});
        return AppHandler.getPathParamsData(pathParams, key, defaultValue);
    },
    getCurrentAppData: function(defaultCurrentAppData) {
        var appControlData = this.getData("appControlData", []);
        var currentAppId = this.getPathParamsData("pid", "");
        var currentAppData = defaultCurrentAppData;
        if ($S.isArray(appControlData)) {
            for (var i = 0; i < appControlData.length; i++) {
                if (appControlData[i]["id"] === currentAppId) {
                    currentAppData = appControlData[i];
                    break;
                }
            }
        }
        return currentAppData;
    },
    getAppData: function(key, defaultValue) {
        if (!$S.isStringV2(key)) {
            return defaultValue;
        }
        var currentAppData = this.getCurrentAppData(null);
        var metaData = this.getMetaData(null);
        var tempConfig = null;
        if ($S.isObject(currentAppData) || $S.isObject(metaData)) {
            tempConfig = Config.tempConfig;
        }
        return $S.findParam([currentAppData, metaData, tempConfig], key, defaultValue);
    },
    getMetaData: function(defaultMetaData) {
        var currentAppData = this.getCurrentAppData({});
        var currentAppId = this.getPathParamsData("pid", "");
        var metaData = defaultMetaData;
        if ($S.isObject(currentAppData) && currentAppData.id === currentAppId) {
            metaData = this.getData("metaData", {});
        }
        return metaData;
    },
    getBooleanParam: function(name, defaultValue) {
        var currentAppData = this.getCurrentAppData({});
        var metaData = this.getMetaData({});
        var booleanVal = $S.findParam([currentAppData, metaData], name);
        if ($S.isBoolean(booleanVal)) {
            return booleanVal;
        }
        return defaultValue;
    },
    getApisFromUserData: function(apiName) {
        var currentUserControlData = DataHandler.getData("currentUserControlData", {});
        var apis = [];
        var requestId = $S.getUniqueNumber();
        if ($S.isObject(currentUserControlData) && $S.isArray(currentUserControlData[apiName])) {
            for (var i = 0; i < currentUserControlData[apiName].length; i++) {
                apis.push(Config.baseapi + currentUserControlData[apiName][i] + "?v=" + requestId);
            }
        }
        return apis;
    },
    // getFinancialStatementConfigFromUserData: function() {
    //     var currentUserControlData = DataHandler.getData("currentUserControlData", {});
    //     if ($S.isObject(currentUserControlData.financialStatementConfig)) {
    //         return currentUserControlData.financialStatementConfig;
    //     }
    //     return {};
    // },
    getCompanyName: function() {
        var currentUserControlData = DataHandler.getData("currentUserControlData", {});
        if ($S.isString(currentUserControlData.name) && currentUserControlData.name.length > 0) {
            return currentUserControlData.name;
        }
        var currentUserName = DataHandler.getData("currentUserName", "");
        return currentUserName;
    },
    getHeadingText: function() {
        var currentAppData = this.getCurrentAppData({});
        return AppHandler.getHeadingText(currentAppData, Config.projectHeading);
    },
    getEnableFooterStatus: function() {
        var currentUserControlData = DataHandler.getData("currentUserControlData", {});
        if ($S.isBoolean(currentUserControlData.enableFooter)) {
            return currentUserControlData.enableFooter;
        }
        return false;
    },
    getMetaDataAccounts: function() {
        var metaData = DataHandler.getData("metaData", {});
        if ($S.isObject(metaData) && $S.isArray(metaData.accounts)) {
            return metaData.accounts;
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
        // if (dropdownFields.length < 1) {
        //     dropdownFields = $S.isArray(Config.defaultPageFields) ? Config.defaultPageFields : [];
        // }
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
        // if (homeFields.length < 1) {
        //     homeFields = $S.isArray(Config.defaultPageFields) ? Config.defaultPageFields : [];
        // }
        return homeFields;
    },
    GetMetaDataPageHeading: function(pageName) {
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
    },
    loadUserRelatedData: function(callback) {
        var loginUserDetailsApi = Config.getApiUrl("getLoginUserDetails", null, true);
        if ($S.isString(loginUserDetailsApi)) {
            DataHandler.setData("loginUserDetailsLoadStatus", "in_progress");
            AppHandler.LoadLoginUserDetails(Config.getApiUrl("getLoginUserDetails", null, true), function() {
                var isLogin = AppHandler.GetUserData("login", false);
                if ($S.isBooleanTrue(Config.forceLogin) && isLogin === false) {
                    AppHandler.LazyRedirect(Config.getApiUrl("loginRedirectUrl", "", true), 250);
                    return;
                }
                TemplateHandler.SetHeadingUsername(AppHandler.GetUserData("username", ""));
                DataHandler.setData("loginUserDetailsLoadStatus", "completed");
                $S.callMethod(callback);
            });
        } else {
            DataHandler.setData("loginUserDetailsLoadStatus", "completed");
            $S.callMethod(callback);
        }
    },
    loadAppControlData: function(callback) {
        DataHandler.setData("appControlDataLoadStatus", "in_progress");
        var appControlApi = Config.getApiUrl("appControlData", null, true);
        AppHandler.loadAppControlData(appControlApi, Config.baseApi, Config.appControlDataPath, Config.validAppControl, function(appControlData, metaData) {
            DataHandler.setData("appControlData", appControlData);
            DataHandler.setData("appControlMetaData", metaData);
            $S.log("appControlData load complete");
            DataHandler.setData("appControlDataLoadStatus", "completed");
            $S.callMethod(callback);
        });
    },
    _handleDataLoadComplete: function() {
        var dataLoadStatusKey = ["dbDataLoadStatus", "tableDataLoadStatus"];
        if(CommonDataHandler.getDataLoadStatusByKeyV2(this, dataLoadStatusKey) !== "completed") {
            return false;
        }
        var dbViewData = this.getData("dbViewData", {});
        var combineTableData = this.getAppData("combineTableData", []);
        AppHandler.CombineTableData(dbViewData, combineTableData);
        this.setData("dbViewData", dbViewData);
        DataHandlerV2.createDateSelectionParameter();
    },
    loadDbData: function(callback) {
        var dbDataLoadStatus = this.getData("dbDataLoadStatus", "");
        var pageName = this.getPathParamsData("pageName", "");
        var pageRequiredDbDataLoadStatus = Config.otherPagesList;
        if (pageRequiredDbDataLoadStatus.indexOf(pageName) >= 0) {
            if (dbDataLoadStatus === "in_progress") {
                return;
            } else if (dbDataLoadStatus === "completed") {
                $S.callMethod(callback);
            } else {
                var dbDataApis = this.getAppData("dbDataApis", []);
                DataHandlerV2.handlePageLoad(dbDataApis, function() {
                    DataHandler._handleDataLoadComplete();
                    $S.callMethod(callback);
                });
            }
        } else {
            $S.callMethod(callback);
        }
    },
    loadTableData: function(callback) {
        var tableDataLoadStatus = this.getData("tableDataLoadStatus", "");
        var dbTableDataIndex = this.getAppData("dbTableDataIndex", "");
        var getTableDataApiNameKey = this.getAppData("getTableDataApiNameKey", null);
        var tableFilterParam = this.getAppData("tableFilterParam", {});
        var dynamicFilenamesFilterParam = this.getAppData("dynamicFilenamesFilterParam", {});

        var pageName = this.getPathParamsData("pageName", "");
        var pageRequiredTableDataLoadStatus = Config.otherPagesList;
        if (pageRequiredTableDataLoadStatus.indexOf(pageName) >= 0) {
            if (tableDataLoadStatus === "in_progress") {
                return;
            } else if (tableDataLoadStatus === "completed") {
                $S.callMethod(callback);
            } else if ($S.isStringV2(getTableDataApiNameKey)) {
                DataHandlerV2.loadTableData(getTableDataApiNameKey, tableFilterParam, dynamicFilenamesFilterParam, dbTableDataIndex, function() {
                    DataHandler._handleDataLoadComplete();
                    $S.callMethod(callback);
                });
            } else {
                this.setData("tableDataLoadStatus", "completed");
                $S.callMethod(callback);
            }
        } else {
            $S.callMethod(callback);
        }
    },
    handleMetaDataLoad: function(metaDataResponse) {
        var finalMetaData = {}, i, tempMetaData, temp;
        var appControlMetaData = DataHandler.getData("appControlMetaData", {});
        if ($S.isObject(appControlMetaData)) {
            finalMetaData = appControlMetaData;
        }
        if ($S.isArray(metaDataResponse)) {
            for (i=0; i<metaDataResponse.length; i++) {
                if ($S.isObject(metaDataResponse[i])) {
                    tempMetaData = metaDataResponse[i];
                    temp = tempMetaData.metaData;
                    if ($S.isObject(temp)) {
                        temp = Object.keys(temp);
                        if (temp.length > 0) {
                            tempMetaData = tempMetaData.metaData;
                        }
                    }
                    finalMetaData = Object.assign(finalMetaData, tempMetaData);
                }
            }
        }
        DataHandler.setData("metaData", finalMetaData);
        var dateSelect = DataHandler.getData("selectedDateType", "");
        if (dateSelect === "") {
            dateSelect = DataHandler.getAppData("dateSelectionType", Config.defaultDateSelect);
        }
        DataHandler.setData("selectedDateType", dateSelect);
        DataHandlerV2.setCurrentList3Id();
    },
    loadDataByAppId: function(callback) {
        var metaDataLoadStatus = this.getData("metaDataLoadStatus", "");
        var pageName = this.getData("pageName", "");
        if ([Config.projectHome].indexOf(pageName) >= 0) {
            DataHandler.loadDbData(callback);
            DataHandler.loadTableData(callback);
            return;
        }
        if (["completed"].indexOf(metaDataLoadStatus) >= 0) {
            DataHandler.loadDbData(callback);
            DataHandler.loadTableData(callback);
            return;
        } else if (["in_progress"].indexOf(metaDataLoadStatus) >= 0) {
            return;
        }
        var appControlData = DataHandler.getCurrentAppData({});
        var request = [], metaDataApi = [];
        if ($S.isArray(appControlData["metaDataApi"])) {
            metaDataApi = appControlData["metaDataApi"];
        }
        metaDataApi = metaDataApi.map(function(el, i, arr) {
            return Config.baseApi + el + "?v=" + Config.appVersion;
        });
        var metaDataRequest = {
                            "url": metaDataApi,
                            "apiName": "metaData",
                            "requestMethod": Api.getAjaxApiCallMethod()};
        request.push(metaDataRequest);
        DataHandler.setData("metaDataLoadStatus", "in_progress");
        AppHandler.LoadDataFromRequestApi(request, function() {
            for(var i=0; i<request.length; i++) {
                if (request[i].apiName === "metaData") {
                    DataHandler.handleMetaDataLoad(request[i].response);
                }
            }
            DataHandler.setData("metaDataLoadStatus", "completed");
            $S.log("currentAppData load complete");
            DataHandler.loadDbData(callback);
            DataHandler.loadTableData(callback);
        });
    }
});

DataHandler.extend({
    PageComponentDidMount: function(appStateCallback, appDataCallback) {
        this.setAppData();
        // var displayLoading = this.getData("displayLoading");
        DataHandler.loadDataByAppId(function() {
            var dataLoadStatus = DataHandler.getDataLoadStatus();
            if (dataLoadStatus) {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            }
        });
        // if ($S.isBooleanTrue(displayLoading)) {
            // DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        // }
    },
    AppDidMount: function(appStateCallback, appDataCallback) {
        var pageName1, pageName2;
        DataHandler.loadUserRelatedData(function() {
            DataHandler.loadAppControlData(function() {
                pageName1 = DataHandler.getData("pageName", "");
                if (pageName1 === Config.otherPages) {
                    pageName2 = DataHandler.getPathParamsData("pageName", "");
                    AppHandler.TrackPageView(pageName2);
                } else {
                    AppHandler.TrackPageView(pageName1);
                }
                appStateCallback();
            });
        });
    },
    OnList1Change: function(appStateCallback, appDataCallback, list1Id) {
        AppHandler.TrackDropdownChange("list1", list1Id);
        DataHandler.setData("metaDataLoadStatus", "not-started");
        DataHandler.setData("dbDataLoadStatus", "not-started");
        DataHandler.setData("tableDataLoadStatus", "not-started");
    },
    PageComponentMount: function(appStateCallback, appDataCallback, pageName) {
        // DataHandler.setData("currentPageName", pageName);
        // DataHandler.setCurrentPageData(appStateCallback, appDataCallback);
    },
    DateSelectionChange: function(appStateCallback, appDataCallback, selectedDateType) {
        DataHandler.setData("availableDataPageName", "");
        DataHandler.setData("selectedDateType", selectedDateType);
        var combinedDateSelectionParameter = DataHandler.getData("combinedDateSelectionParameter", {});
        DataHandler.setData("dateSelectionParameter", combinedDateSelectionParameter[selectedDateType]);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    // setPageData: function(appStateCallback, appDataCallback, name) {
    //     $S.log("setPageData:"+name);
    //     var currentPageName = DataHandler.getData("currentPageName", "");
    //     var availableDataPageName = DataHandler.getData("availableDataPageName", "");
    //     var dataLoadStatus = DataHandler.getDataLoadStatus();
    //     if (dataLoadStatus === "completed" && currentPageName !== availableDataPageName) {
    //         var list1Data = DataHandler.getData("userControlData", []);
    //         var list2Data = DataHandler.getData("dropdownFields", []);
    //         if (currentPageName === "home") {
    //             list1Data = [];
    //             list2Data = [];
    //         }
    //         DataHandler.setData("availableDataPageName", currentPageName);
    //         // appDataCallback("goBackLinkData", goBackLinkData);
    //         appDataCallback("list1Data", list1Data);
    //         appDataCallback("currentList1Id", DataHandler.getData("currentUserName", ""));
    //         appDataCallback("list2Data", list2Data);
    //         appDataCallback("currentList2Id", currentPageName);
    //         appDataCallback("appHeading", TemplateHandler.getAppHeading(currentPageName));
    //         // appDataCallback("pageHeading", DataHandler.GetMetaDataPageHeading(currentPageName));
    //         appDataCallback("selectedDateType", DataHandler.getData("selectedDateType", ""));
    //         // appDataCallback("errorsData", DataHandler.getData("errorsData", []));
    //         appDataCallback("dateSelection", Config.dateSelection);
    //         appDataCallback("dateSelectionRequiredPages", Config.dateSelectionRequired);
    //         // appDataCallback("dataLoadStatus", dataLoadStatus);
    //         appDataCallback("firstTimeDataLoadStatus", DataHandler.getData("firstTimeDataLoadStatus"));
    //         appDataCallback("renderFieldRow", AccountHelper.getRenderTemplate());
    //         appDataCallback("enableFooter", DataHandler.getEnableFooterStatus());
    //         appStateCallback();
    //     }
    // }
});

DataHandler.extend({
    // setCurrentPageData: function(appStateCallback, appDataCallback) {
    //     var pageName = DataHandler.getData("currentPageName", "");
    //     var availableDataPageName = DataHandler.getData("availableDataPageName", "");
    //     if (availableDataPageName === pageName) {
    //         return;
    //     }
    //     DataHandler.setPageData(appStateCallback, appDataCallback, "setCurrentPageData");
    // },
    // getTemplate: function(key, defaultTemplate) {
    //     var allTemplate = Template;
    //     if ($S.isObject(allTemplate)) {
    //         if ($S.isDefined(allTemplate[key])) {
    //             return $S.clone(allTemplate[key]);
    //         }
    //     }
    //     return defaultTemplate;
    // }
});

DataHandler.extend({
    // loadCurrentUserData: function(appStateCallback, appDataCallback) {
    //     DataHandler.setData("metaDataLoadStatus", "in-progress");
    //     DataHandler.setData("journalDataCsvLoadStatus", "in-progress");
    //     DataHandler.setData("journalDataJsonLoadStatus", "in-progress");
    //     var metaDataApi = DataHandler.getApisFromUserData("metaDataApi");
    //     var journalDataCsvApi = DataHandler.getApisFromUserData("journalDataApiCSV");
    //     var journalDataJsonApi = DataHandler.getApisFromUserData("journalDataApi");
    //     if (metaDataApi.length > 0) {
    //         $S.loadJsonData(null, metaDataApi, function(response, apiName, ajaxDetails) {
    //             if ($S.isObject(response)) {
    //                 // checking unique accountName
    //                 var accountsData = $S.isArray(response.accounts) ? response.accounts : [];
    //                 var temp = {};
    //                 for (var i=0; i<accountsData.length; i++) {
    //                     if (temp[accountsData[i].accountName]) {
    //                         alert("Duplicate entry: " + accountsData[i].accountName);
    //                     } else {
    //                         temp[accountsData[i].accountName] = 1;
    //                     }
    //                 }
    //                 DataHandler.setData("metaData", response);
    //             } else {
    //                 DataHandler.addDataInArray("errorsData", {"text":ajaxDetails.url, "href":ajaxDetails.url});
    //                 $S.log("Invalid response (metaData):" + response);
    //             }
    //         }, function() {
    //             $S.log("metaData load completed");
    //             DataHandler.setData("metaDataLoadStatus", "completed");
    //             DataHandler.setData("homeFields", DataHandler.getMetaDataHomeFields());
    //             DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    //         }, null, Api.getAjaxApiCallMethod());
    //     } else {
    //         DataHandler.setData("metaDataLoadStatus", "completed");
    //     }
    //     if (journalDataCsvApi.length > 0) {
    //         var apiJournalDataCsv = [];
    //         $S.loadJsonData(null, journalDataCsvApi, function(response, apiName, ajaxDetails) {
    //             if ($S.isString(response)) {
    //                 apiJournalDataCsv.push(response);
    //             } else {
    //                 DataHandler.addDataInArray("errorsData", {"text":ajaxDetails.url, "href":ajaxDetails.url});
    //                 $S.log("Invalid response (apiJournalDataCsv):" + response);
    //             }
    //         }, function() {
    //             $S.log("csvData load completed");
    //             DataHandler.setData("journalDataCsvLoadStatus", "completed");
    //             var csvToJSONJournalData = AccountHelper.convertCSVToJsonJournalData(apiJournalDataCsv);
    //             DataHandler.setData("apiJournalDataCsv", csvToJSONJournalData);
    //             DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    //         }, null, Api.getAjaxApiCallMethodV2());
    //     } else {
    //         DataHandler.setData("journalDataCsvLoadStatus", "completed");
    //     }
    //     if (journalDataJsonApi.length > 0) {
    //         var apiJournalDataJson = [];
    //         $S.loadJsonData(null, journalDataJsonApi, function(response, apiName, ajaxDetails) {
    //             if ($S.isObject(response)) {
    //                 apiJournalDataJson.push(response);
    //             } else {
    //                 DataHandler.addDataInArray("errorsData", {"text":ajaxDetails.url, "href":ajaxDetails.url});
    //                 $S.log("Invalid response (apiJournalDataJson):" + response);
    //             }
    //         }, function() {
    //             $S.log("jsonData load completed");
    //             DataHandler.setData("journalDataJsonLoadStatus", "completed");
    //             DataHandler.setData("apiJournalDataJson", apiJournalDataJson);
    //             DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    //         }, null, Api.getAjaxApiCallMethod());
    //     } else {
    //         DataHandler.setData("journalDataJsonLoadStatus", "completed");
    //     }
    // }
});
var count = 0;
DataHandler.extend({
    // getApiJournalData: function() {
    //     var apiJournalDataJson = DataHandler.getData("apiJournalDataJson", []);
    //     var apiJournalDataCsv = DataHandler.getData("apiJournalDataCsv", []);
    //     var apiJournalData = [];
    //     apiJournalData = apiJournalData.concat(apiJournalDataJson);
    //     apiJournalData = apiJournalData.concat(apiJournalDataCsv);
    //     return apiJournalData;
    // },
    // handleDataLoadCompleteOld: function(appStateCallback, appDataCallback) {
    //     var dataLoadStatus = DataHandler.getDataLoadStatus();
    //     if (dataLoadStatus !== "completed") {
    //         return false;
    //     }
    //     var apiJournalData = DataHandler.getApiJournalData();
    //     var apiJournalDataByDate = AccountHelper.getApiJournalDataByDate(apiJournalData);
    //     var finalJournalData = AccountHelper.getFinalJournalData(apiJournalDataByDate);
    //     DataHandler.setData("apiJournalDataByDate", apiJournalDataByDate);
    //     DataHandler.setData("finalJournalData", finalJournalData);

    //     DataHandler.setData("availableDataPageName", "");
    //     DataHandler.setData("dropdownFields", DataHandler.getMetaDataDropdownFields());
    //     DataHandler.setData("accounts", DataHandler.getMetaDataAccounts());

    //     var dataByCompany = AccountHelper.getDataByCompany(finalJournalData);
    //     DataHandler.setData("dataByCompany", dataByCompany);

    //     var currentUserControlData = DataHandler.getData("currentUserControlData", []);
    //     var customiseDebitAccountData = AccountHelper2.getCustomAccountsData(currentUserControlData, "customiseDebitAccount");
    //     var customiseCreditAccountData = AccountHelper2.getCustomAccountsData(currentUserControlData, "customiseCreditAccount");
    //     var customiseCalenderAccountData = AccountHelper2.getCustomAccountsData(currentUserControlData, "customiseCalenderAccount");
    //     var customeAccountData = AccountHelper2.getCustomAccountsData(currentUserControlData, "customeAccount");
    //     DataHandler.setData("customiseDebitAccountData", customiseDebitAccountData);
    //     DataHandler.setData("customiseCreditAccountData", customiseCreditAccountData);
    //     DataHandler.setData("customiseCalenderAccountData", customiseCalenderAccountData);
    //     DataHandler.setData("customeAccountData", customeAccountData);

    //     var allDateStr = [], i, j, temp;
    //     if ($S.isArray(finalJournalData)) {
    //         for (i = 0; i < finalJournalData.length; i++) {
    //             if ($S.isArray(finalJournalData[i].entry)) {
    //                 for (j=0; j<finalJournalData[i].entry.length; j++) {
    //                     temp = finalJournalData[i].entry[j].date;
    //                     temp = DT.getDateObj(temp);
    //                     if (temp !== null) {
    //                         temp = DT.formateDateTime("YYYY/-/MM/-/DD", "/", temp);
    //                         if (allDateStr.indexOf(temp) < 0) {
    //                             allDateStr.push(temp);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     var allDateSelection = DataHandler._generateDateSelectionParameter(allDateStr);
    //     var dateSelectionType = DataHandler.getData("selectedDateType", "");
    //     DataHandler.setData("combinedDateSelectionParameter", allDateSelection);
    //     DataHandler.setData("dateSelectionParameter", allDateSelection[dateSelectionType]);
    //     DataHandler.setCurrentPageData(appStateCallback, appDataCallback);
    // },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        console.log("handleDataLoadComplete: " + count++);
        var dataLoadStatus = DataHandler.getDataLoadStatus();
        var renderData = null;
        var appHeading = null;
        var list1Data = [], list2Data = [], list3Data = [];
        var dateSelectionRequired = Config.dateSelectionRequired;
        var dateSelection = Config.dateSelection;
        var filterOptions = [];
        var footerData = null;
        var pageName1 = this.getData("pageName", "");
        var pageName2 = this.getPathParamsData("pageName", "");
        if (!dataLoadStatus) {
            return false;
        }
        if ([Config.home, Config.projectHome].indexOf(pageName1) < 0) {
            list1Data = this.getData("appControlData", []);
            list2Data = CommonDataHandler.getList2Data(this, Config.otherPagesList);
        }
        appHeading = TemplateHandler.GetHeadingField(this.getHeadingText());
        renderData = DataHandlerV2.getRenderData();
        var renderFieldRow = TemplateHandler.GetPageRenderField(dataLoadStatus, renderData, footerData, pageName2);
        if (CommonDataHandler.isPageDisabled(this, pageName2)) {
            filterOptions = [];
            dateSelectionRequired = null;
        } else if(dateSelectionRequired.indexOf(pageName2) >= 0) {
            dateSelectionRequired = [pageName1];
        }
        appDataCallback("renderFieldRow", renderFieldRow);
        appDataCallback("appHeading", appHeading);
        appDataCallback("list1Data", list1Data);
        appDataCallback("currentList1Id", this.getPathParamsData("pid", ""));
        appDataCallback("filterOptions", filterOptions);
        appDataCallback("enableFooter", this.getBooleanParam("enableFooter", false));
        appDataCallback("enableToggleButton", this.getBooleanParam("enableToggleButton", true));

        appDataCallback("list2Data", list2Data);
        appDataCallback("currentList2Id", this.getPathParamsData("pageName", ""));
        appDataCallback("list3Data", list3Data);
        appDataCallback("currentList3Id", this.getData("currentList3Id", ""));

        appDataCallback("dateSelectionRequiredPages", dateSelectionRequired);
        appDataCallback("dateSelection", dateSelection);
        appDataCallback("selectedDateType", DataHandler.getData("selectedDateType", ""));

        appDataCallback("firstTimeDataLoadStatus", "completed");
        appStateCallback();
    }
});

})($S);

export default DataHandler;
