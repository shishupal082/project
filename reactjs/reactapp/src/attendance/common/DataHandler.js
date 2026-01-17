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
import CommonConfig from "../../common/app/common/CommonConfig";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
// import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";
import DBViewAttendanceInterface from "../../common/app/common/DBViewAttendanceInterface";

var DataHandler;

(function($S){
// var DT = $S.getDT();

var CurrentData = $S.getDataObj();
var keys = [];

keys.push("renderData");
keys.push("renderFieldRow");

keys.push("currentList3Id");
keys.push("pageName");
keys.push("pathParams");
keys.push("displayLoading");
keys.push("date-select");

keys.push("filterValues");
keys.push("filterOptions");


keys.push("appControlData");
keys.push("appControlMetaData");
keys.push("metaData");
keys.push("userData");
keys.push("filteredUserData");
keys.push("latestAttendanceData");

keys.push("loginUserDetailsLoadStatus");
keys.push("appControlDataLoadStatus");
keys.push("metaDataLoadStatus");
keys.push("attendanceDataLoadStatus");

// keys.push("sortable");
// keys.push("sortableValue");
keys.push("sortingFields");
keys.push("dbViewData");
keys.push("dbViewDataTable");
keys.push("dbDataLoadStatus");

keys.push("firstTimeDataLoadStatus");

keys.push("dateParameters");

keys.push("fieldsData");

keys.push("tableDataLoadStatus");

keys.push("toggleClickStatus");

//TA page
//Add Field Report Page
keys.push("addentry.submitStatus");

CurrentData.setKeys(keys);


CurrentData.setData("loginUserDetailsLoadStatus", "not-started");
CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("metaDataLoadStatus", "not-started");
CurrentData.setData("dbDataLoadStatus", "not-started");
CurrentData.setData("attendanceDataLoadStatus", "not-started");
CurrentData.setData("tableDataLoadStatus", "not-started");

CurrentData.setData("addentry.submitStatus", "not-started");

CurrentData.setData("firstTimeDataLoadStatus", "not-started");

CurrentData.setData("toggleClickStatus", false);

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
        var pageName2 = this.getPathParamsData("pageName", "");
        var pageName1 = this.getData("pageName", "");
        if ([Config.home].indexOf(pageName1) >= 0) {
            dataLoadStatusKey.push("metaDataLoadStatus");
        }
        var pageRequiredDbDataLoadStatus = [Config.entry, Config.update,
                    Config.summary, Config.ta, Config.dbview,
                    Config.dbview_summary, Config.custom_dbview, Config.add_field_report];
        if (pageRequiredDbDataLoadStatus.indexOf(pageName2) >= 0) {
            dataLoadStatusKey.push("metaDataLoadStatus");
            dataLoadStatusKey.push("dbDataLoadStatus");
        }
        if(DataHandler.getDataLoadStatusByKey(dataLoadStatusKey) !== "completed") {
            return false;
        }
        DataHandler.setData("firstTimeDataLoadStatus", "completed");
        return true;
    },
    getPageUrlByPageName: function(pageName) {
        var appId = this.getPathParamsData("pid", "");
        return this.getPageUrl(appId, pageName);
    },
    getPageUrlByAppId: function(appId) {
        var pageName = this.getPathParamsData("pageName", "");
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
    },
    getPathParamsData: function(key, defaultValue) {
        var pathParams = this.getData("pathParams", {});
        return AppHandler.getPathParamsData(pathParams, key, defaultValue);
    },
    getAppComponentClassName: function() {
        var pageName = this.getPathParamsData("pageName", "");
        var appComponentClassName = this.getAppData("appComponentClassName", "");
        if (!$S.isString(pageName)) {
            pageName = "";
        }
        if (!$S.isString(appComponentClassName)) {
            appComponentClassName = "";
        }
        if ($S.isStringV2(appComponentClassName)) {
            pageName += " ";
        }
        return pageName + appComponentClassName;
    },
    isContainerClassRequired: function(isDisplayOnlyDataTable) {
        if ($S.isBooleanTrue(isDisplayOnlyDataTable)) {
            return false;
        }
        var addContainerClass = this.getAppData("addContainerClass", "");
        return !$S.isBooleanFalse(addContainerClass);
    },
    setAppData: function(appStateCallback, appDataCallback) {
        var pageName = this.getData("pageName", "");
        if ([Config.projectHome, Config.noMatch].indexOf(pageName) >= 0) {
            this.setData("metaDataLoadStatus", "not-started");
            this.setData("dbDataLoadStatus", "not-started");
            this.setData("attendanceDataLoadStatus", "not-started");
        } else if ([Config.home].indexOf(pageName) >= 0) {
            this.setData("dbDataLoadStatus", "not-started");
            this.setData("attendanceDataLoadStatus", "not-started");
        }
    }
});
DataHandler.extend({
    generateDateParameter: function() {
        var currentAppData = DataHandler.getCurrentAppData({});
        var metaData = DataHandler.getMetaData({});
        var currentList3Data = this.getCurrentList3Data();
        var dateRange = $S.findParam([currentList3Data, currentAppData, metaData], "dateRange", []);
        DataHandler.setData("dateParameters", AppHandler.GetDataParameterFromDate(dateRange));
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
    getMetaData: function(defaultMetaData) {
        var currentAppData = this.getCurrentAppData({});
        var currentAppId = this.getPathParamsData("pid", "");
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
        var currentList3Id = DataHandler.getData("currentList3Id", "");
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
        return AppHandler.getHeadingText(currentAppData, Config.projectHeading);
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
    isExpressionEnabled: function(pageName) {
        var expressionEnabledPage = DataHandler.getAppData("expression_enabled_page", []);
        if ($S.isArray(expressionEnabledPage) && expressionEnabledPage.indexOf(pageName) >= 0) {
            return true;
        }
        return false;
    },
    applyResetFilter: function() {
        var filterOptions = DataHandler.getData("filterOptions", []);
        if ($S.isArray(filterOptions)) {
            for (var i = 0; i<filterOptions.length; i++) {
                if ($S.isStringV2(filterOptions[i].allFieldValue)) {
                    filterOptions[i].selectedValue = filterOptions[i].allFieldValue;
                } else {
                    filterOptions[i].selectedValue = "";
                }
            }
        }
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler.setData("filterValues", {});
    }
});

DataHandler.extend({
    loadUserRelatedData: function(callback) {
        var loginUserDetailsApi = CommonConfig.getApiUrl("getLoginUserDetailsApi", null, true);
        if ($S.isString(loginUserDetailsApi)) {
            DataHandler.setData("loginUserDetailsLoadStatus", "in_progress");
            AppHandler.LoadLoginUserDetails(loginUserDetailsApi, function() {
                var isLogin = AppHandler.GetUserData("login", false);
                if ($S.isBooleanTrue(Config.forceLogin) && isLogin === false) {
                    AppHandler.LazyRedirect(CommonConfig.getApiUrl("loginRedirectUrl", "", true), 250);
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
    getDateParameterField: function(identifier, value) {
        var dateParameterField = null;
        var currentList3Data = DataHandler.getCurrentList3Data();
        if ($S.isObjectV2(currentList3Data) && $S.isObjectV2(currentList3Data["dateParameterField"])) {
            dateParameterField = currentList3Data["dateParameterField"];
        } else {
            dateParameterField = this.getAppData("dateParameterField", {});
        }
        return dateParameterField;
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
    loadDataByAppId: function(callback) {
        var metaDataLoadStatus = this.getData("metaDataLoadStatus", "");
        var pageName = this.getData("pageName", "");
        if ([Config.projectHome].indexOf(pageName) >= 0) {
            return DataHandler.loadDbData(callback);
        }
        if (["completed"].indexOf(metaDataLoadStatus) >= 0) {
            return DataHandler.loadDbData(callback);
        } else if (["in_progress"].indexOf(metaDataLoadStatus) >= 0) {
            return;
        }
        var appControlData = DataHandler.getCurrentAppData({});
        var request = [], metaDataApi = [];
        if ($S.isArray(appControlData["metaDataApi"])) {
            metaDataApi = appControlData["metaDataApi"];
        }
        metaDataApi = metaDataApi.map(function(el, i, arr) {
            return Config.baseApi + el + "?v=" + Config.appVersion + "&role_id=" + Config.roleId;
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
                    DataHandlerV3.handleMetaDataLoad(request[i].response);
                }
            }
            DataHandler.setData("metaDataLoadStatus", "completed");
            $S.log("currentAppData load complete");
            DataHandler.loadDbData(callback);
        });
    },
    loadDbData: function(callback) {
        var dbDataLoadStatus = this.getData("dbDataLoadStatus", "");
        var pageName = this.getPathParamsData("pageName", "");
        var pageRequiredDbDataLoadStatus = [Config.entry, Config.update,
                    Config.summary, Config.ta, Config.dbview,
                    Config.dbview_summary, Config.custom_dbview, Config.add_field_report];
        var dbTableDataIndex = this.getAppData("dbTableDataIndex", {});
        if (pageRequiredDbDataLoadStatus.indexOf(pageName) >= 0) {
            if (dbDataLoadStatus === "in_progress") {
                return;
            } else if (dbDataLoadStatus === "completed") {
                this.loadAttendanceData(callback, dbTableDataIndex);
            } else {
                var dbDataApis = this.getAppData("dbDataApis", []);
                DataHandlerV3.handlePageLoad(dbDataApis, dbTableDataIndex, function() {
                    DataHandler.loadAttendanceData(callback, dbTableDataIndex);
                });
            }
        } else {
            $S.callMethod(callback);
        }
    },
    loadTableData: function(pageName, callback) {
        var tableDataLoadStatus = this.getData("tableDataLoadStatus", "");
        var dbTableDataIndex = this.getAppData("dbTableDataIndex", "");
        var combineTableData = this.getAppData("combineTableData", "");
        var getTableDataApiNameKey = this.getAppData("getTableDataApiNameKey", null);
        var tableFilterParam = this.getAppData("tableFilterParam", {});
        var dynamicFilenamesFilterParam = this.getAppData("dynamicFilenamesFilterParam", {});
        if (tableDataLoadStatus === "completed") {
            $S.callMethod(callback);
        } else if (tableDataLoadStatus === "in_progress") {
            return;
        } else if ($S.isStringV2(getTableDataApiNameKey)) {
            DataHandlerV3.loadTableData(getTableDataApiNameKey, tableFilterParam, dynamicFilenamesFilterParam, dbTableDataIndex, combineTableData, function() {
                $S.callMethod(callback);
            });
        } else {
            DataHandlerV3.applyDefaultSort();
            $S.callMethod(callback);
        }
    },
    loadAttendanceData: function(callback) {
        var pageName = this.getPathParamsData("pageName", "");
        var attendanceDataLoadStatus = this.getData("attendanceDataLoadStatus", "");
        var dbTableDataIndex = this.getAppData("dbTableDataIndex", {});
        if (attendanceDataLoadStatus === "completed") {
            this.loadTableData(pageName, callback);
        } else if (attendanceDataLoadStatus === "in_progress") {
            return;
        } else {
            DataHandlerV3.loadAttendanceData(function() {
                DataHandler.loadTableData(pageName, callback);
            }, dbTableDataIndex);
        }
    },
    handleApiDataLoad: function() {
        var pageName = this.getPathParamsData("pageName", "");
        var resultCriteria = this.getAppData("resultCriteria", []);
        var pageResultCriteria = this.getAppData("resultCriteria." + pageName, null);
        if ($S.isArray(pageResultCriteria)) {
            resultCriteria = pageResultCriteria;
        }
        DataHandlerV3.handleAttendanceDataLoad();
        DataHandlerV3.setCurrentList3Id();
        DataHandler.generateDateParameter();
        DataHandlerV3.generateFinalTable(resultCriteria);
        DataHandlerV3.generateFilterOptions();
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
    }
});
DataHandler.extend({
    AppDidMount: function(appStateCallback, appDataCallback) {
        DataHandler.loadUserRelatedData(function() {
            DataHandler.loadAppControlData(function() {
                DataHandler.loadDataByAppId(function() {
                    AppHandler.TrackPageView(DataHandler.getData("pageName", ""));
                    DataHandler.handleApiDataLoad();
                    DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
                });
            });
        });
    },
    OnReloadClick: function(appStateCallback, appDataCallback) {
        AppHandler.TrackEvent("reloadClick");
        DataHandler.setData("metaDataLoadStatus", "not-started");
        DataHandler.setData("dbDataLoadStatus", "not-started");
        DataHandler.setData("attendanceDataLoadStatus", "not-started");
        DataHandler.setData("tableDataLoadStatus", "not-started");
        DataHandler.loadDataByAppId(function() {
            DataHandler.handleApiDataLoad();
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
    },
    OnToggleClick: function(appStateCallback, appDataCallback) {
        var toggleClickStatus = DataHandler.getData("toggleClickStatus", false);
        if ($S.isBooleanTrue(toggleClickStatus)) {
            toggleClickStatus = false;
        } else {
            toggleClickStatus = true;
        }
        DataHandler.setData("toggleClickStatus", toggleClickStatus);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnList1Change: function(appStateCallback, appDataCallback, list1Id) {
        AppHandler.TrackDropdownChange("list1", list1Id);
        DataHandler.setData("metaDataLoadStatus", "not-started");
        DataHandler.setData("dbDataLoadStatus", "not-started");
        DataHandler.setData("attendanceDataLoadStatus", "not-started");
        DataHandler.setData("tableDataLoadStatus", "not-started");
    },
    OnList2Change: function(appStateCallback, appDataCallback, list2Id) {
        var pages = Config.pages;
        AppHandler.TrackDropdownChange("list2", list2Id);
        if (!$S.isString(pages[list2Id])) {
            var currentList2Data = DataHandlerV3.getList2DataByName(list2Id);
            if ($S.isObject(currentList2Data) && $S.isStringV2(currentList2Data.toUrl)) {
                AppHandler.TrackPageView(list2Id);
                AppHandler.LazyRedirect(currentList2Data.toUrl, 250);
                return;
            }
        }
    },
    OnList3Change: function(appStateCallback, appDataCallback, list3Id) {
        AppHandler.TrackDropdownChange("list3", list3Id);
        DataHandler.setData("currentList3Id", list3Id);
        DataHandler.generateDateParameter();
        var realodOnDateRangeChange = this.getAppData("attendance.realodOnDateRangeChange", false);
        var pageName2 = this.getPathParamsData("pageName", "");
        var dbTableDataIndex = this.getAppData("dbTableDataIndex", {});
        var pageRequiredAttendanceDataReloadStatus = [Config.entry, Config.update, Config.summary];
        if ($S.isBooleanTrue(realodOnDateRangeChange) && pageRequiredAttendanceDataReloadStatus.indexOf(pageName2) >= 0) {
            DataHandler.setData("attendanceDataLoadStatus", "not-started");
            DataHandlerV3.loadAttendanceData(function() {
                DataHandlerV3.handleAttendanceDataLoad();
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            }, dbTableDataIndex);
        } else {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        }
    },
    PageComponentDidMount: function(appStateCallback, appDataCallback) {
        this.setAppData();
        var pageName = this.getPathParamsData("pageName", "");
        var displayLoading = this.getData("displayLoading");
        if ([Config.custom_dbview].indexOf(pageName) >= 0) {
            DataHandler.applyResetFilter();
        }
        DataHandler.loadDataByAppId(function() {
            DataHandler.handleApiDataLoad();
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
        if ($S.isBooleanTrue(displayLoading)) {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
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
        var pageName = DataHandler.getPathParamsData("pageName", "");
        var dbTableDataIndex = this.getAppData("dbTableDataIndex", {});
        if ([Config.update].indexOf(pageName) >= 0) {
            DataHandlerV2.callAddTextApi(name, value, function() {
                DataHandler.setData("attendanceDataLoadStatus", "not-started");
                DataHandlerV3.loadAttendanceData(function() {
                    DataHandlerV3.handleAttendanceDataLoad();
                    DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
                }, dbTableDataIndex);
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
        var pageName = this.getData("pageName", "");
        if ([Config.home, Config.projectHome, Config.add_field_report].indexOf(pageName) >= 0) {
            return [];
        }
        pageName = this.getPathParamsData("pageName", "");
        if (DataHandlerV3.isPageDisabled(pageName)) {
            return [];
        }
        var dateArray = [];
        var dateParameters = this.getData("dateParameters", {});
        var dateSelect = this.getData("date-select", "");
        if ([Config.update].indexOf(pageName) >= 0) {
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
        var dateParameterField = this.getDateParameterField();
        var filteredUserData = AppHandler.getFilteredData(currentAppData, metaData, userData, filterOptions, "name", dateParameterField);
        var sortingFields = DataHandler.getData("sortingFields", []);
        var displayDateSummary = DataHandler.getBooleanParam("displayDateSummary", false);
        var dbviewSummaryAggregatePattern, isExpressionEnabled;
        if ([Config.summary].indexOf(pageName) >= 0) {
            filteredUserData = this._generateSummaryUserData(filteredUserData);
        } else if ([Config.ta].indexOf(pageName) >= 0) {
            DataHandler.setData("filteredUserData", filteredUserData);
            filteredUserData = $S.sortResultV2(filteredUserData, sortingFields, "name");
        } else if ([Config.dbview, Config.dbview_summary, Config.custom_dbview].indexOf(pageName) < 0) {
            filteredUserData = $S.sortResultV2(filteredUserData, sortingFields, "name");
        }
        switch(pageName) {
            case "entry":
            case "update":
                renderData = DataHandlerV2.GenerateEntryUpdateUserData(dateArray, filteredUserData, pageName);
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
            case "custom_dbview":
                currentList3Data = this.getCurrentList3Data();
                renderData = DBViewAttendanceInterface.getDBViewRenderField(filteredUserData, currentList3Data, sortingFields, dateParameterField, dateSelect);
            break;
            case "dbview_summary":
                currentList3Data = this.getCurrentList3Data();
                dbviewSummaryAggregatePattern = DataHandler.getAppData("resultPattern.dbview_summary_aggregate", []);
                isExpressionEnabled = DataHandler.isExpressionEnabled(pageName);
                renderData = DBViewAttendanceInterface.getDBViewSummaryRenderField(filteredUserData, currentList3Data, sortingFields, dateParameterField, dateSelect, dbviewSummaryAggregatePattern, isExpressionEnabled);
            break;
            default:
                renderData = [];
            break;
        }
        return renderData;
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        var dataLoadStatus = this.isDataLoadComplete();
        var isDisplayOnlyDataTable = TemplateHandler.isDisplayOnlyDataTable();
        var renderData = null;
        var footerData = null;
        var appHeading = null;
        var dateSelection = null;
        if (dataLoadStatus) {
            renderData = this.getRenderData();
            footerData = AppHandler.GetFooterData(this.getMetaData({}));
            dateSelection = Config.dateSelection;
        }
        if (dataLoadStatus && !isDisplayOnlyDataTable) {
            appHeading = TemplateHandler.GetHeadingField(this.getHeadingText());
        }
        var pageName1 = DataHandler.getData("pageName", "");
        var pageName2 = DataHandler.getPathParamsData("pageName", "");
        var renderFieldRow = TemplateHandler.GetPageRenderField(dataLoadStatus, renderData, footerData, pageName2);
        var list1Data = [];
        var list2Data = [];
        var list3Data = [];
        var filterOptions = [];
        if (dataLoadStatus && !isDisplayOnlyDataTable && [Config.home, Config.projectHome].indexOf(pageName1) < 0) {
            list1Data = this.getData("appControlData", []);
            list2Data = DataHandlerV3.getList2Data();
            list3Data = DataHandlerV3.getList3Data();
            filterOptions = DataHandler.getData("filterOptions", []);
            filterOptions = AppHandler.getFilterData(filterOptions);
        }
        var dateSelectionRequired = Config.dateSelectionRequired;
        if (DataHandlerV3.isPageDisabled(pageName2)) {
            filterOptions = [];
            dateSelectionRequired = null;
        } else if(dateSelectionRequired.indexOf(pageName2) >= 0) {
            dateSelectionRequired = [pageName1];
        }
        appDataCallback("renderFieldRow", renderFieldRow);
        appDataCallback("appHeading", appHeading);
        appDataCallback("list1Data", list1Data);
        appDataCallback("addContainerClass", this.isContainerClassRequired(isDisplayOnlyDataTable));
        appDataCallback("appComponentClassName", this.getAppComponentClassName());
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
        appDataCallback("selectedDateType", DataHandler.getData("date-select", ""));

        appDataCallback("firstTimeDataLoadStatus", "completed");
        appStateCallback();
    }
});

})($S);

export default DataHandler;
