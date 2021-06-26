import $S from "../../interface/stack.js";
// import $$$ from '../../interface/global';
import Config from "./Config";
import DataHandlerTA from "./DataHandlerTA";
import DataHandlerV2 from "./DataHandlerV2";
import DataHandlerV3 from "./DataHandlerV3";
import DataHandlerAddFieldReport from "./DataHandlerAddFieldReport";
import TemplateHandler from "./TemplateHandler";

import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";

var DataHandler;

(function($S){
// var DT = $S.getDT();

var CurrentData = $S.getDataObj();
var keys = [];

keys.push("renderData");
keys.push("renderFieldRow");



keys.push("currentList1Id");
keys.push("currentList2Id");
keys.push("currentList3Id");
keys.push("date-select");

keys.push("filterValues");
keys.push("filterOptions");


keys.push("appControlData");
keys.push("appControlMetaData");
keys.push("metaData");
keys.push("userData");
keys.push("filteredUserData");
keys.push("attendanceData");
keys.push("latestAttendanceData");

keys.push("loginUserDetailsLoadStatus");
keys.push("appControlDataLoadStatus");
keys.push("appRelatedDataLoadStatus");

// keys.push("sortable");
// keys.push("sortableValue");
keys.push("sortingFields");
keys.push("dbViewData");
keys.push("dbViewDataTable");
keys.push("dbViewDataLoadStatus");

keys.push("firstTimeDataLoadStatus");

keys.push("dateParameters");

keys.push("fieldsData");

//TA page
//Add Field Report Page
keys.push("addentry.submitStatus");

CurrentData.setKeys(keys);


CurrentData.setData("loginUserDetailsLoadStatus", "not-started");
CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("appRelatedDataLoadStatus", "not-started");
CurrentData.setData("dbViewDataLoadStatus", "not-started");

CurrentData.setData("addentry.submitStatus", "not-started");

CurrentData.setData("firstTimeDataLoadStatus", "not-started");

DataHandler = function(arg) {
    return new DataHandler.fn.init(arg);
};
DataHandler.fn = DataHandler.prototype = {
    constructor: DataHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(DataHandler);

DataHandler.extend({
    setData: function(key, value, isDirect) {
        return CurrentData.setData(key, value, isDirect);
    },
    getData: function(key, defaultValue, isDirect) {
        return CurrentData.getData(key, defaultValue, isDirect);
    },
    setFieldsData: function(key, value) {
        var fieldsData = this.getData("fieldsData", {});
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        if ($S.isString(value)) {
            value = value.trim();
        }
        fieldsData[key] = value;
        this.setData("fieldsData", fieldsData);
    },
    getFieldsData: function(key, defaultValue) {
        var fieldsData = this.getData("fieldsData", {});
        if ($S.isString(key) && key.length > 0) {
            if ($S.isObject(fieldsData)) {
                if ($S.isUndefined(fieldsData[key])) {
                    return defaultValue;
                } else {
                    return fieldsData[key];
                }
            }
        }
        return defaultValue;
    },
    getDataLoadStatusByKey: function(keys) {
        var dataLoadStatus = [], i;
        var loadStatus;
        if ($S.isArray(keys)) {
            for (i = 0; i < keys.length; i++) {
                if ($S.isString(keys[i])) {
                    loadStatus = DataHandler.getData(keys[i], "");
                    dataLoadStatus.push(loadStatus);
                }
            }
        } else {
            return "";
        }
        for (i = 0; i < dataLoadStatus.length; i++) {
            if (dataLoadStatus[i] !== "completed") {
                return "";
            }
        }
        return "completed";
    },
    isDataLoadComplete: function() {
        var dataLoadStatusKey = [];
        dataLoadStatusKey.push("loginUserDetailsLoadStatus");
        dataLoadStatusKey.push("appControlDataLoadStatus");
        dataLoadStatusKey.push("appRelatedDataLoadStatus");
        var currentList2Id = this.getData("currentList2Id", "");
        var pageRequiredDataLoadStatus = [Config.entry, Config.update,
                    Config.summary, Config.ta, Config.dbview,
                    Config.dbview_summary, Config.custom_dbview];
        if (pageRequiredDataLoadStatus.indexOf(currentList2Id) >= 0) {
            dataLoadStatusKey.push("dbViewDataLoadStatus");
        }
        if(DataHandler.getDataLoadStatusByKey(dataLoadStatusKey) !== "completed") {
            return false;
        }
        DataHandler.setData("firstTimeDataLoadStatus", "completed");
        return true;
    },
    getPageUrlByPageName: function(pageName) {
        var appId = this.getData("currentList1Id", "");
        return this.getPageUrl(appId, pageName);
    },
    getPageUrlByAppId: function(appId) {
        var pageName = this.getData("currentList2Id", "");
        return this.getPageUrl(appId, pageName);
    },
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
    }
});
DataHandler.extend({
    // GetDataParameterFromDate: function(dateRange) {
    //     var allDate, tempAllDate, arrangedDate, startLimit, endLimit;
    //     var i;
    //     if ($S.isArray(dateRange) && dateRange.length === 2) {
    //         allDate = AppHandler.GenerateDateBetween2Date(dateRange[0], dateRange[1]);
    //         startLimit = dateRange[0];
    //         endLimit = dateRange[1];
    //         tempAllDate = allDate.map(function(el, index, arr) {
    //             return el.dateStr;
    //         });
    //         arrangedDate = AppHandler.generateDateSelectionParameter(tempAllDate);
    //         if ($S.isObject(arrangedDate)) {
    //             for(var key in arrangedDate) {
    //                 if ($S.isArray(arrangedDate[key])) {
    //                     for (i=0; i<arrangedDate[key].length; i++) {
    //                         if ($S.isArray(arrangedDate[key][i].dateRange) && arrangedDate[key][i].dateRange.length === 2) {
    //                             arrangedDate[key][i].allDate = AppHandler.GenerateDateBetween2Date(arrangedDate[key][i].dateRange[0], arrangedDate[key][i].dateRange[1], startLimit, endLimit);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return arrangedDate;
    // },
    generateDateParameter: function() {
        var currentAppData = DataHandler.getCurrentAppData({});
        var metaData = DataHandler.getMetaData({});
        var currentList3Data = this.getCurrentList3Data();
        var dateRange = $S.findParam([currentList3Data, currentAppData, metaData], "dateRange", []);
        DataHandler.setData("dateParameters", AppHandler.GetDataParameterFromDate(dateRange));
    },
    getCurrentAppData: function(defaultCurrentAppData) {
        var appControlData = this.getData("appControlData", []);
        var currentAppId = this.getData("currentList1Id", "");
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
    getMetaData: function(defaultMetaData) {
        var currentAppData = this.getCurrentAppData({});
        var currentAppId = this.getData("currentList1Id", "");
        var metaData = defaultMetaData;
        if ($S.isObject(currentAppData) && currentAppData.id === currentAppId) {
            metaData = this.getData("metaData", {});
        }
        return metaData;
    },
    getList3DataById: function(list3Id) {
        var list3Data = DataHandlerV3.getList3Data();
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
        var currentList3Id = DataHandlerV3.getCurrentList3Id();
        return this.getList3DataById(currentList3Id);
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
    getHeadingText: function() {
        var currentAppData = this.getCurrentAppData({});
        return AppHandler.getHeadingText(currentAppData, "App Heading");
    },
    getUserInfoById: function(userId) {
        var userData = DataHandler.getData("filteredUserData", []);
        if (!$S.isString(userId) || userId.length === 0 || !$S.isArray(userData)) {
            return {};
        }
        for (var i = 0; i < userData.length; i++) {
            if (!$S.isArray(userData[i])) {
                continue;
            }
            for (var j=0; j<userData[i].length; j++) {
                if (userData[i][j].name === "userId" && userId === userData[i][j].value) {
                    return userData[i];
                }
            }
        }
        return {};
    },
    applyResetFilter: function() {
        var filterOptions = DataHandler.getData("filterOptions", []);
        if ($S.isArray(filterOptions)) {
            for (var i = 0; i<filterOptions.length; i++) {
                filterOptions[i].selectedValue = "";
            }
        }
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler.setData("filterValues", {});
    }
});

DataHandler.extend({
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
    }
});

DataHandler.extend({
    getReportDataApi: function() {
        var currentFileId = DataHandler.getData("currentList2Id", "");
        if ($S.isString(currentFileId) && currentFileId.length > 0) {
            return [Config.baseApi + DataHandler.generateApi(currentFileId)];
        }
        var currentAppData = this.getCurrentAppData({});
        var api = [];
        if ($S.isObject(currentAppData) && $S.isArray(currentAppData.dataPathApi)) {
            for (var i = 0; i < currentAppData.dataPathApi.length; i++) {
                if ($S.isString(currentAppData.dataPathApi[i]) && currentAppData.dataPathApi[i].length > 0) {
                    api.push(Config.baseApi + DataHandler.generateApi(currentAppData.dataPathApi[i]));
                    break;
                }
            }
        }
        return api;
    },
    generateApi: function(path) {
        var currentAppData = this.getCurrentAppData({});
        if ($S.isBooleanTrue(currentAppData.loadReportDataFromApi)) {
            return "/view/file/" + path + "?u=" + AppHandler.GetUserData("username", "") + "&iframe=false";
        }
        return path;
    },
    getAllReportDataApi: function() {
        var currentAppData = this.getCurrentAppData({});
        var api = [];
        if ($S.isObject(currentAppData) && $S.isArray(currentAppData.dataPathApi)) {
            for (var i = 0; i < currentAppData.dataPathApi.length; i++) {
                if ($S.isString(currentAppData.dataPathApi[i]) && currentAppData.dataPathApi[i].length > 0) {
                    api.push(Config.baseApi + DataHandler.generateApi(currentAppData.dataPathApi[i]));
                }
            }
        }
        return api;
    },
    getAllReportDataApiV2: function() {
        var currentAppData = this.getCurrentAppData({});
        var api = [];
        if ($S.isObject(currentAppData) && $S.isArray(currentAppData.dataPathApi)) {
            for (var i = 0; i < currentAppData.dataPathApi.length; i++) {
                if ($S.isString(currentAppData.dataPathApi[i]) && currentAppData.dataPathApi[i].length > 0) {
                    api.push(currentAppData.dataPathApi[i]);
                }
            }
        }
        return api;
    },
    loadDataByAppId: function(callback) {
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
        DataHandler.setData("appRelatedDataLoadStatus", "in_progress");
        DataHandler.setData("dbViewDataLoadStatus", "not-started");
        AppHandler.LoadDataFromRequestApi(request, function() {
            for(var i=0; i<request.length; i++) {
                if (request[i].apiName === "metaData") {
                    DataHandlerV3.handleMetaDataLoad(request[i].response);
                }
            }
            DataHandler.generateDateParameter();
            DataHandler.setData("appRelatedDataLoadStatus", "completed");
            $S.log("currentAppData load complete");
            DataHandler.handlePageRouting(null, callback);
        });
    },
    loadAttendanceData: function(attendanceDataApis, callback) {
        var isAttendanceDataSameAsDbData = this.getAppData("isAttendanceDataSameAsDbData", false);
        var attendanceDbTable;
        if ($S.isBooleanTrue(isAttendanceDataSameAsDbData)) {
            attendanceDbTable = DataHandler.getData("dbViewData", []);
            DataHandlerV3.handleAttendanceDataLoad(attendanceDbTable);
            $S.callMethod(callback);
        } else {
            DataHandlerV3.loadAttendanceData(attendanceDataApis, function() {
                attendanceDbTable = DataHandler.getData("attendanceData", []);
                DataHandlerV3.handleAttendanceDataLoad(attendanceDbTable);
                $S.callMethod(callback);
            });
        }
    },
    handleApiDataLoad: function() {
        var currentList2Id = this.getData("currentList2Id", "");
        var resultCriteria = this.getAppData("resultCriteria", []);
        var pageResultCriteria = this.getAppData("resultCriteria." + currentList2Id, null);
        if ($S.isArray(pageResultCriteria)) {
            resultCriteria = pageResultCriteria;
        }
        DataHandlerV3.generateFinalTable(currentList2Id, resultCriteria);
        DataHandlerV3.generateFilterOptions();
    },
    handlePageRouting: function(reason, callback) {
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        var dbDataApis = this.getAppData("dbDataApis", []);
        var attendanceDataApis = this.getAppData("attendanceDataApis", []);
        if ([Config.summary, Config.entry, Config.update, Config.dbview, Config.ta, Config.dbview_summary, Config.custom_dbview, Config.add_field_report].indexOf(currentList2Id) >= 0) {
            DataHandlerV3.handlePageLoad(dbDataApis, function() {
                DataHandler.loadAttendanceData(attendanceDataApis, function() {
                    DataHandler.handleApiDataLoad();
                    $S.callMethod(callback);
                });
            });
        } else if (reason !== "pageComponentDidMount" || [Config.home, Config.projectHome].indexOf(currentList2Id) >= 0) {
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
            DataHandler.loadDataByAppId(function() {
                $S.callMethod(callback);
            });
        });
    }
});
DataHandler.extend({
    AppDidMount: function(appStateCallback, appDataCallback) {
        DataHandler.loadUserRelatedData(function() {
            DataHandler.loadAppControlData(function() {
                AppHandler.TrackPageView(DataHandler.getData("currentList2Id", ""));
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        });
    },
    OnReloadClick: function(appStateCallback, appDataCallback, currentList1Id) {
        AppHandler.TrackEvent("reloadClick");
        DataHandler.loadDataByAppId(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
        // DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnList1Change: function(appStateCallback, appDataCallback, list1Id) {
        AppHandler.TrackDropdownChange("list1", list1Id);
        DataHandler.setData("currentList1Id", list1Id);
        this.OnReloadClick(appStateCallback, appDataCallback, list1Id);
    },
    SetAppId: function(appStateCallback, appDataCallback, appId) {
        var oldAppId = this.getData("currentList1Id", "");
        this.setData("currentList1Id", appId);
        if (oldAppId !== appId) {
            DataHandler.loadDataByAppId(function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        }
    },
    OnList2Change: function(appStateCallback, appDataCallback, list2Id) {
        var pages = Config.pages;
        if (!$S.isString(pages[list2Id])) {
            var currentList2Data = DataHandlerV3.getList2DataByName(list2Id);
            if ($S.isObject(currentList2Data) && $S.isStringV2(currentList2Data.toUrl)) {
                AppHandler.TrackPageView(list2Id);
                AppHandler.LazyRedirect(currentList2Data.toUrl, 250);
            }
            return;
        }
        var oldList2Id = DataHandler.getData("currentList2Id", "");
        DataHandler.setData("currentList2Id", list2Id);
        if (DataHandlerV3.isPageDisabled(oldList2Id)) {
            DataHandler.loadDataByAppId(function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        }
        if ([Config.custom_dbview].indexOf(list2Id) >= 0) {
            DataHandler.applyResetFilter();
        }
        AppHandler.TrackPageView(list2Id);
        DataHandler.handleApiDataLoad();
        DataHandler.generateDateParameter();
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnList3Change: function(appStateCallback, appDataCallback, list3Id) {
        AppHandler.TrackDropdownChange("list3", list3Id);
        DataHandler.setData("currentList3Id", list3Id);
        DataHandler.generateDateParameter();
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    PageComponentDidMount: function(appStateCallback, appDataCallback, list2Id) {
        var oldList2Id = DataHandler.getData("currentList2Id", "");
        if (oldList2Id !== list2Id) {
            // AppHandler.TrackPageView(list2Id);
            if ([Config.custom_dbview].indexOf(list2Id) >= 0) {
                DataHandler.applyResetFilter();
            }
            DataHandler.setData("currentList2Id", list2Id);
            this.handlePageRouting("pageComponentDidMount", function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        }
    },
    OnDateSelectClick: function(appStateCallback, appDataCallback, value) {
        AppHandler.TrackEvent("dateSelect:" + value);
        DataHandler.setData("date-select", value);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    SubmitFormClick: function(appStateCallback, appDataCallback) {
        DataHandlerTA.SubmitFormClick(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
    },
    OnFormSubmit: function(appStateCallback, appDataCallback, name, value) {
        DataHandlerAddFieldReport.SubmitForm(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
    },
    SortClick: function(appStateCallback, appDataCallback, value) {
        AppHandler.TrackEvent("sort:" + value);
        var sortingFields = DataHandler.getData("sortingFields", []);
        var finalSortingField = DBViewDataHandler.UpdateSortingFields(sortingFields, value);
        DataHandler.setData("sortingFields", finalSortingField);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnFilterChange: function(appStateCallback, appDataCallback, name, value) {
        var filterValues = DataHandler.getData("filterValues", {});
        var filterOptions = DataHandler.getData("filterOptions", []);
        AppHandler.TrackEvent("filterChange:" + value);
        if (!$S.isObject(filterValues)) {
            filterValues = {};
        }
        filterValues[name] = value;
        if ($S.isArray(filterOptions)) {
            for (var i = 0; i<filterOptions.length; i++) {
                if (filterOptions[i].selectName === name) {
                    filterOptions[i].selectedValue = value;
                }
            }
        }
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler.setData("filterValues", filterValues);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnDropdownChange: function(appStateCallback, appDataCallback, name, value) {
        if (name === "") {
            return;
        }
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        if ([Config.update].indexOf(currentList2Id) >= 0) {
            var attendanceDataApis = this.getAppData("attendanceDataApis", []);
            DataHandlerV2.callAddTextApi(name, value, function() {
                DataHandler.loadAttendanceData(attendanceDataApis, function() {
                    DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
                });
            });
        } else {
            DataHandler.setFieldsData(name, value);
        }
    },
    OnResetClick: function(appStateCallback, appDataCallback, name, value) {
        AppHandler.TrackEvent("resetClick");
        DataHandler.applyResetFilter();
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnInputChange: function(appStateCallback, appDataCallback, name, value) {
        this.setFieldsData(name, value);
    }
});
DataHandler.extend({
    _generateSummaryUserData: function(filteredUserData) {
        if (!$S.isArray(filteredUserData)) {
            filteredUserData = [];
        }
        var displayAllSummaryEntry = this.getBooleanParam("displayAllSummaryEntry", false);
        if ($S.isBooleanTrue(displayAllSummaryEntry)) {
            return filteredUserData;
        }
        var attendanceData = DataHandler.getData("latestAttendanceData", {});
        if (!$S.isObject(attendanceData)) {
            attendanceData = {};
        }
        var userDataV2 = [];
        var i, userId;
        for (i = 0; i < filteredUserData.length; i++) {
            userId = $S.findParam(filteredUserData[i], "userId", "", "name", "value");
            if ($S.isObject(attendanceData[userId])) {
                if ($S.isArray(attendanceData[userId].attendance) && attendanceData[userId].attendance.length > 0) {
                    userDataV2.push(filteredUserData[i]);
                }
            }
        }
        return userDataV2;
    },
    getRenderData: function() {
        var currentList2Id = this.getData("currentList2Id", "");
        if (DataHandlerV3.isPageDisabled(currentList2Id) || [Config.home, Config.projectHome, Config.add_field_report].indexOf(currentList2Id) >= 0) {
            return [];
        }
        var dateArray = [];
        var dateParameters = this.getData("dateParameters", {});
        var dateSelect = this.getData("date-select", "");
        if ([Config.update].indexOf(currentList2Id) >= 0) {
            dateSelect = "monthly";
        }
        if ($S.isObject(dateParameters) && $S.isArray(dateParameters[dateSelect])) {
            dateArray = dateParameters[dateSelect];
        }
        var renderData = [], i, currentList3Data;
        var currentAppData = DataHandler.getCurrentAppData({});
        var metaData = DataHandler.getMetaData({});
        var userData = DataHandler.getData("dbViewDataTable", []);
        var filterOptions = DataHandler.getData("filterOptions", []);
        var filteredUserData = AppHandler.getFilteredData(currentAppData, metaData, userData, filterOptions, "name");
        // var sortableValue = DataHandler.getData("sortableValue", "");
        // var sortableName = DataHandler.getData("sortable", "");
        var sortingFields = DataHandler.getData("sortingFields", []);
        var displayDateSummary = DataHandler.getBooleanParam("displayDateSummary", false);
        var dateParameterField = $S.findParam([currentAppData, metaData], "dateParameterField", {});

        if ([Config.summary].indexOf(currentList2Id) >= 0) {
            filteredUserData = this._generateSummaryUserData(filteredUserData);
        } else if ([Config.ta].indexOf(currentList2Id) >= 0) {
            DataHandler.setData("filteredUserData", filteredUserData);
            filteredUserData = $S.sortResultV2(filteredUserData, sortingFields, "name");
        } else if ([Config.dbview, Config.dbview_summary, Config.custom_dbview].indexOf(currentList2Id) < 0) {
            filteredUserData = $S.sortResultV2(filteredUserData, sortingFields, "name");
        }
        switch(currentList2Id) {
            case "entry":
            case "update":
                renderData = DataHandlerV2.GenerateEntryUpdateUserData(dateArray, filteredUserData, currentList2Id);
            break;
            case "summary":
                renderData = DataHandlerV2.GenerateSummaryUserData(dateArray, filteredUserData);
                for (i=0; i<renderData.length; i++) {
                    if ($S.isObject(renderData[i]) && $S.isArray(renderData[i].tableData)) {
                        renderData[i].tableData = $S.sortResultV2(renderData[i].tableData, sortingFields, "name");
                    }
                }
                if (!displayDateSummary) {
                    DataHandlerV2.GenerateSummaryTotalRow(renderData);
                }
            break;
            case "ta":
                renderData = DataHandlerV2.GenerateFinalTaUserData(filteredUserData);
            break;
            case "dbview":
            case "dbview_summary":
            case "custom_dbview":
                currentList3Data = this.getCurrentList3Data();
                renderData = DBViewDataHandler.GenerateFinalDBViewData(filteredUserData, currentList3Data, dateParameterField, dateSelect);
                renderData = DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
            break;
            default:
                renderData = [];
            break;
        }
        return renderData;
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        var dataLoadStatus = this.isDataLoadComplete();
        var renderData = null;
        var footerData = null;
        var appHeading = null;
        var dateSelection = null;
        if (dataLoadStatus) {
            renderData = this.getRenderData();
            footerData = AppHandler.GetFooterData(this.getMetaData({}));
            appHeading = TemplateHandler.GetHeadingField(this.getHeadingText());
            dateSelection = Config.dateSelection;
        }
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        var renderFieldRow = TemplateHandler.GetPageRenderField(dataLoadStatus, renderData, footerData, currentList2Id);
        var list1Data = [];
        var list2Data = [];
        var list3Data = [];
        var filterOptions = [];
        if (dataLoadStatus && [Config.home, Config.projectHome].indexOf(currentList2Id) < 0) {
            list1Data = this.getData("appControlData", []);
            list2Data = DataHandlerV3.getList2Data();
            list3Data = DataHandlerV3.getList3Data();
            filterOptions = DataHandler.getData("filterOptions", []);
            filterOptions = AppHandler.getFilterData(filterOptions);
        }
        var dateSelectionRequired = Config.dateSelectionRequired;
        if (DataHandlerV3.isPageDisabled(currentList2Id)) {
            filterOptions = [];
            dateSelectionRequired = null;
        }
        appDataCallback("renderFieldRow", renderFieldRow);
        appDataCallback("appHeading", appHeading);
        appDataCallback("list1Data", list1Data);
        appDataCallback("currentList1Id", this.getData("currentList1Id", ""));
        appDataCallback("filterOptions", filterOptions);
        appDataCallback("disableFooter", this.getBooleanParam("disableFooter", false));
        appDataCallback("enableToggleButton", this.getBooleanParam("enableToggleButton", true));

        appDataCallback("list2Data", list2Data);
        appDataCallback("currentList2Id", DataHandler.getData("currentList2Id", ""));
        appDataCallback("list3Data", list3Data);
        appDataCallback("currentList3Id", DataHandlerV3.getCurrentList3Id());

        appDataCallback("dateSelectionRequiredPages", dateSelectionRequired);
        appDataCallback("dateSelection", dateSelection);
        appDataCallback("selectedDateType", DataHandler.getData("date-select", ""));

        appDataCallback("firstTimeDataLoadStatus", "completed");
        appStateCallback();
    }
});

})($S);

export default DataHandler;
