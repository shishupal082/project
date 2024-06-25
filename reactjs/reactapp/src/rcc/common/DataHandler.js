import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandlerV3 from "./DataHandlerV3";
import TemplateHandler from "./TemplateHandler";

import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";

import RCCHandler from "./RCCHandler";

var DataHandler;

(function($S){

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

//TA page
//Add Field Report Page
keys.push("addentry.submitStatus");

keys.push("isSinglePageApp");

CurrentData.setKeys(keys);


CurrentData.setData("loginUserDetailsLoadStatus", "not-started");
CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("metaDataLoadStatus", "not-started");
CurrentData.setData("dbDataLoadStatus", "not-started");
CurrentData.setData("attendanceDataLoadStatus", "not-started");
CurrentData.setData("tableDataLoadStatus", "not-started");

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
        var pageName2 = this.getPathParamsData("pageName", "");
        var pageName1 = this.getData("pageName", "");
        if ([Config.home].indexOf(pageName1) >= 0) {
            dataLoadStatusKey.push("metaDataLoadStatus");
        }
        var pageRequiredDbDataLoadStatus = [Config.dbview, Config.dbview_rcc, Config.rcc_view, Config.rcc_summary];
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
    updatePathParameter: function(key, value) {
        if ($S.isStringV2(key) && $S.isStringV2(value)) {
            var pathParams = this.getData("pathParams", {});
            if (!$S.isObject(pathParams)) {
                pathParams = {};
            }
            pathParams[key] = value;
            this.setData("pathParams", pathParams);
        }
    },
    getPathParamsData: function(key, defaultValue) {
        var pathParams = this.getData("pathParams", {});
        return AppHandler.getPathParamsData(pathParams, key, defaultValue);
    },
    getAppComponentClassName: function() {
        var pageName = this.getPathParamsData("pageName", "");
        if ($S.isStringV2(pageName)) {
            return pageName;
        }
        return this.getData("pageName", "");
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
        var pageRequiredDbDataLoadStatus = [Config.dbview, Config.dbview_rcc, Config.rcc_view, Config.rcc_summary];
        var dbTableDataIndex = this.getAppData("dbTableDataIndex", {});
        if (pageRequiredDbDataLoadStatus.indexOf(pageName) >= 0) {
            if (dbDataLoadStatus === "in_progress") {
                return;
            } else if (dbDataLoadStatus === "completed") {
                this.loadTableData(pageName, callback);
            } else {
                var dbDataApis = this.getAppData("dbDataApis", []);
                DataHandlerV3.handlePageLoad(dbDataApis, dbTableDataIndex, function() {
                    DataHandler.loadTableData(pageName, callback);
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
        if (tableDataLoadStatus === "completed") {
            $S.callMethod(callback);
        } else if (tableDataLoadStatus === "in_progress") {
            return;
        } else if ($S.isStringV2(getTableDataApiNameKey)) {
            DataHandlerV3.loadTableData(getTableDataApiNameKey, tableFilterParam, dbTableDataIndex, combineTableData, function() {
                $S.callMethod(callback);
            });
        } else {
            $S.callMethod(callback);
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
    },
    handleSinglePageApp: function() {
        var tempConfig = Config.tempConfig;
        var isSinglePageApp = false;
        if ($S.isObject(tempConfig) && $S.isBooleanTrue(tempConfig.isSinglePageApp)) {
            isSinglePageApp = true;
        }
        var appControlData = DataHandler.getData("appControlData", []);
        var currentAppData = {};
        if ($S.isArray(appControlData) && appControlData.length > 0 && $S.isObject(appControlData[0])) {
            currentAppData = appControlData[0];
            if ($S.isBooleanTrue(currentAppData["isSinglePageApp"])) {
                isSinglePageApp = true;
            }
        }
        if (isSinglePageApp && $S.isStringV2(currentAppData["id"])) {
            DataHandler.setData("isSinglePageApp", true);
            DataHandler.updatePathParameter("pid", currentAppData["id"]);
            DataHandler.updatePathParameter("pageName", Config.dbview);
            DataHandler.setData("pageName", Config.otherPages);
        }
    }
});
DataHandler.extend({
    AppDidMount: function(appStateCallback, appDataCallback) {
        DataHandler.loadUserRelatedData(function() {
            DataHandler.loadAppControlData(function() {
                DataHandler.handleSinglePageApp();
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
    OnList1Change: function(appStateCallback, appDataCallback, list1Id) {
        AppHandler.TrackDropdownChange("list1", list1Id);
        DataHandler.setData("metaDataLoadStatus", "not-started");
        DataHandler.setData("dbDataLoadStatus", "not-started");
        DataHandler.setData("attendanceDataLoadStatus", "not-started");
        DataHandler.setData("tableDataLoadStatus", "not-started");
        if ($S.isBooleanTrue(DataHandler.getData("isSinglePageApp", false))) {
            DataHandler.loadDataByAppId(function() {
                DataHandler.handleApiDataLoad();
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        }
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
        if ($S.isBooleanTrue(DataHandler.getData("isSinglePageApp", false))) {
            DataHandler.handleApiDataLoad();
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        }
    },
    OnList3Change: function(appStateCallback, appDataCallback, list3Id) {
        AppHandler.TrackDropdownChange("list3", list3Id);
        DataHandler.setData("currentList3Id", list3Id);
        DataHandler.generateDateParameter();
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
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
        // DataHandlerTA.SubmitFormClick(function() {
        //     DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        // });
    },
    OnFormSubmit: function(appStateCallback, appDataCallback, name, value) {
        // DataHandlerAddFieldReport.SubmitForm(function() {
        //     DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        // });
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
        DataHandler.setFieldsData(name, value);
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
    getRenderData: function() {
        var pageName = this.getData("pageName", "");
        if ([Config.home, Config.projectHome].indexOf(pageName) >= 0) {
            return [];
        }
        pageName = this.getPathParamsData("pageName", "");
        if (DataHandlerV3.isPageDisabled(pageName)) {
            return [];
        }
        // var dateArray = [];
        // var dateParameters = this.getData("dateParameters", {});
        var dateSelect = this.getData("date-select", "");
        if ([Config.update].indexOf(pageName) >= 0) {
            dateSelect = "monthly";
        }
        // if ($S.isObject(dateParameters) && $S.isArray(dateParameters[dateSelect])) {
        //     dateArray = dateParameters[dateSelect];
        // }
        var renderData = [], currentList3Data;
        var currentAppData = DataHandler.getCurrentAppData({});
        var metaData = DataHandler.getMetaData({});
        var userData = DataHandler.getData("dbViewDataTable", []);
        var filterOptions = DataHandler.getData("filterOptions", []);
        var filteredUserData = AppHandler.getFilteredData(currentAppData, metaData, userData, filterOptions, "name");
        // var sortableValue = DataHandler.getData("sortableValue", "");
        // var sortableName = DataHandler.getData("sortable", "");
        var sortingFields = DataHandler.getData("sortingFields", []);
        var dateParameterField = $S.findParam([currentAppData, metaData], "dateParameterField", {});

        if ([Config.rcc_view, Config.rcc_summary].indexOf(pageName) >= 0) {
            filteredUserData = RCCHandler.getRccRenderData();
        } else if ([Config.dbview, Config.dbview_rcc].indexOf(pageName) < 0) {
            filteredUserData = $S.sortResultV2(filteredUserData, sortingFields, "name");
        }
        switch(pageName) {
            case Config.dbview:
            case Config.dbview_rcc:
            case Config.rcc_view:
            case Config.rcc_summary:
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
        var pageName1 = DataHandler.getData("pageName", "");
        var pageName2 = DataHandler.getPathParamsData("pageName", "");
        var renderFieldRow = TemplateHandler.GetPageRenderField(dataLoadStatus, renderData, footerData, pageName2);
        var list1Data = [];
        var list2Data = [];
        var list3Data = [];
        var filterOptions = [];
        if (dataLoadStatus && [Config.home, Config.projectHome].indexOf(pageName1) < 0) {
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
        appDataCallback("currentList1Id", this.getPathParamsData("pid", ""));
        appDataCallback("filterOptions", filterOptions);
        appDataCallback("isSinglePageApp", this.getData("isSinglePageApp", false));
        appDataCallback("enableFooter", this.getBooleanParam("enableFooter", true));
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
