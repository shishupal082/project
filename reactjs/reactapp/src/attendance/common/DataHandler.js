import $S from "../../interface/stack.js";
// import $$$ from '../../interface/global';
import Config from "./Config";
import DataHandlerV2 from "./DataHandlerV2";
import DataHandlerTA from "./DataHandlerTA";
import DataHandlerDBView from "./DataHandlerDBView";
import TemplateHandler from "./TemplateHandler";

import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";

var DataHandler;

(function($S){
// var DT = $S.getDT();

var CurrentData = $S.getDataObj();
var keys = [];

keys.push("renderData");
keys.push("renderFieldRow");



keys.push("currentList1Id");
keys.push("currentList2Id");
keys.push("date-select");

keys.push("filterValues");
keys.push("filterOptions");


keys.push("appControlData");
keys.push("metaData");
keys.push("userData");
keys.push("filteredUserData");
keys.push("attendanceData");
keys.push("latestAttendanceData");

keys.push("loginUserDetailsLoadStatus");
keys.push("appControlDataLoadStatus");
keys.push("appRelatedDataLoadStatus");

keys.push("sortable");
keys.push("sortableValue");
keys.push("dbViewData");
keys.push("dbViewDataTable");
keys.push("dbViewDataLoadStatus");

keys.push("firstTimeDataLoadStatus");

keys.push("dateParameters");

keys.push("fieldsData");

CurrentData.setKeys(keys);


CurrentData.setData("loginUserDetailsLoadStatus", "not-started");
CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("appRelatedDataLoadStatus", "not-started");
CurrentData.setData("dbViewDataLoadStatus", "not-started");

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
        if (currentList2Id === Config.dbview) {
            dataLoadStatusKey.push("dbViewDataLoadStatus");
        }
        if(DataHandler.getDataLoadStatusByKey(dataLoadStatusKey) !== "completed") {
            return false;
        }
        DataHandler.setData("firstTimeDataLoadStatus", "completed");
        return true;
    }
});

DataHandler.extend({
    setCurrentAppId: function(appId) {
        var appControlData = this.getData("appControlData", []);
        var currentList1Id = "";
        if ($S.isArray(appControlData) && appControlData.length > 0) {
            if ($S.isString(appControlData[0]["id"])) {
                currentList1Id = appControlData[0]["id"];
            }
        }
        DataHandler.setData("currentList1Id", currentList1Id);
    },
    handleAppIdChange: function() {
        var currentAppData = DataHandler.getCurrentAppData();
        var allDate, tempAllDate, arrangedDate, startLimit, endLimit;
        var i;
        if ($S.isArray(currentAppData.dateRange) && currentAppData.dateRange.length === 2) {
            allDate = AppHandler.GenerateDateBetween2Date(currentAppData.dateRange[0], currentAppData.dateRange[1]);
            startLimit = currentAppData.dateRange[0];
            endLimit = currentAppData.dateRange[1];
            tempAllDate = allDate.map(function(el, i, arr){
                return el.dateStr;
            });
            arrangedDate = AppHandler.generateDateSelectionParameter(tempAllDate);
            if ($S.isObject(arrangedDate)) {
                for(var key in arrangedDate) {
                    if ($S.isArray(arrangedDate[key])) {
                        for (i=0; i<arrangedDate[key].length; i++) {
                            if ($S.isArray(arrangedDate[key][i].dateRange) && arrangedDate[key][i].dateRange.length === 2) {
                                arrangedDate[key][i].allDate = AppHandler.GenerateDateBetween2Date(arrangedDate[key][i].dateRange[0], arrangedDate[key][i].dateRange[1], startLimit, endLimit);
                            }
                        }
                    }
                }
            }
        }
        DataHandler.setData("dateParameters", arrangedDate);
    },
    getCurrentAppData: function() {
        var appControlData = this.getData("appControlData", []);
        var currentAppId = this.getData("currentList1Id", "");
        var currentAppData = {};
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
    getDisableFooterStatus: function() {
        var currentAppData = this.getCurrentAppData();
        var disableFooter = true;
        if ($S.isBooleanFalse(currentAppData.disableFooter)) {
            disableFooter = false;
        }
        return disableFooter;
    },
    getHeadingText: function() {
        var currentAppData = this.getCurrentAppData();
        return AppHandler.getHeadingText(currentAppData, "App Heading");
    },
    getUserInfoById: function(userId) {
        var userData = DataHandler.getData("filteredUserData", []);
        if (!$S.isString(userId) || userId.length === 0 || !$S.isArray(userData)) {
            return {};
        }
        for (var i = 0; i < userData.length; i++) {
            if ($S.isObject(userData[i])) {
                if (userId === userData[i].userId) {
                    return userData[i];
                }
            }
        }
        return {};
    },
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
    }
});

DataHandler.extend({
    getReportDataApi: function() {
        var currentFileId = DataHandler.getData("currentList2Id", "");
        if ($S.isString(currentFileId) && currentFileId.length > 0) {
            return [Config.baseApi + DataHandler.generateApi(currentFileId)];
        }
        var currentAppData = this.getCurrentAppData();
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
        var currentAppData = this.getCurrentAppData();
        if ($S.isBooleanTrue(currentAppData.loadReportDataFromApi)) {
            return "/view/file/" + path + "?u=" + AppHandler.GetUserData("username", "") + "&iframe=false";
        }
        return path;
    },
    getAllReportDataApi: function() {
        var currentAppData = this.getCurrentAppData();
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
        var currentAppData = this.getCurrentAppData();
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
    loadAttendanceData: function(callback) {
        var appControlData = DataHandler.getCurrentAppData();//{}
        var request = [], attendanceDataApi = [];
        if ($S.isArray(appControlData["attendanceDataApi"])) {
            attendanceDataApi = appControlData["attendanceDataApi"];
        }
        attendanceDataApi = attendanceDataApi.map(function(el, i, arr) {
            return Config.baseApi + el;
        });
        var attendanceDataRequest = {
                            "url": attendanceDataApi,
                            "apiName": "attendanceData",
                            "requestMethod": Api.getAjaxApiCallMethodV2()};
        request.push(attendanceDataRequest);
        AppHandler.LoadDataFromRequestApi(request, function() {
            var i;
            for(i=0; i<request.length; i++) {
                if (request[i].apiName === "attendanceData") {
                    DataHandlerV2.handleAttendanceDataLoad(request[i].response);
                    continue;
                }
            }
            $S.log("attendanceData load complete");
            $S.callMethod(callback);
        });
    },
    loadDataByAppId: function(callback) {
        var appControlData = DataHandler.getCurrentAppData();//{}
        var request = [], metaDataApi = [];
        if ($S.isArray(appControlData["metaDataApi"])) {
            metaDataApi = appControlData["metaDataApi"];
        }
        metaDataApi = metaDataApi.map(function(el, i, arr) {
            return Config.baseApi + el;
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
                    DataHandlerV2.handleMetaDataLoad(request[i].response);
                }
            }
            DataHandler.setData("appRelatedDataLoadStatus", "completed");
            $S.log("currentAppData load complete");
            DataHandler.handlePageRouting(callback);
        });
    },
    handlePageRouting: function(callback) {
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        if ([Config.dbview].indexOf(currentList2Id) >= 0) {
            DataHandlerDBView.handlePageLoad(callback);
        } else if ([Config.summary, Config.ta, Config.entry, Config.update].indexOf(currentList2Id) >= 0) {
            DataHandlerDBView.handlePageLoadV2(function() {
                DataHandlerV2.handleUserDataLoad();
                DataHandlerV2.handleAttendanceDataLoad();
                DataHandlerV2.generateFilterOptions();
                $S.callMethod(callback);
            });
        } else {
            $S.callMethod(callback);
        }
    },
    loadAppControlData: function(callback) {
        DataHandler.setData("appControlDataLoadStatus", "in_progress");
        var appControlApi = Config.getApiUrl("appControlData", null, true);
        AppHandler.loadAppControlData(appControlApi, Config.baseApi, Config.appControlDataPath, Config.validAppControl, function(response) {
            DataHandler.setData("appControlData", response);
            $S.log("appControlData load complete");
            DataHandler.setData("appControlDataLoadStatus", "completed");
            DataHandler.setCurrentAppId();
            DataHandler.handleAppIdChange();
            DataHandler.loadDataByAppId(function() {
                $S.callMethod(callback);
            });
        });
    },
    AppDidMount: function(appStateCallback, appDataCallback) {
        DataHandler.loadUserRelatedData(function() {
            DataHandler.loadAppControlData(function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        });
    }
});
DataHandler.extend({
    OnReloadClick: function(appStateCallback, appDataCallback, currentList1Id) {
        DataHandler.loadDataByAppId(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnList1Change: function(appStateCallback, appDataCallback, list1Id) {
        DataHandler.setData("currentList1Id", list1Id);
        DataHandler.handleAppIdChange();
        this.OnReloadClick(appStateCallback, appDataCallback, list1Id);
    },
    PageComponentDidMount: function(appStateCallback, appDataCallback, list2Id) {
        var oldList2Id = DataHandler.getData("currentList2Id", "");
        DataHandler.setData("currentList2Id", list2Id);
        DataHandler.handlePageRouting(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
        if (oldList2Id !== list2Id) {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        }
    },
    OnDateSelectClick: function(appStateCallback, appDataCallback, value) {
        DataHandler.setData("date-select", value);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    SubmitFormClick: function(appStateCallback, appDataCallback) {
        DataHandlerTA.SubmitFormClick(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
    },
    SortClick: function(appStateCallback, appDataCallback, name, value) {
        var sortableValue = DataHandler.getData("sortableValue", "");
        if (sortableValue === "ascending") {
            sortableValue = "descending";
        } else if (sortableValue === "descending") {
            sortableValue = "";
            value = "";
        } else {
            sortableValue = "ascending";
        }
        DataHandler.setData("sortable", value);
        DataHandler.setData("sortableValue", sortableValue);
        return DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnFilterChange: function(appStateCallback, appDataCallback, name, value) {
        var filterValues = DataHandler.getData("filterValues", {});
        var filterOptions = DataHandler.getData("filterOptions", []);
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
        DataHandlerV2.callAddTextApi(name, value, function() {
            DataHandler.loadAttendanceData(function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        });
    },
    OnResetClick: function(appStateCallback, appDataCallback, name, value) {
        var filterOptions = DataHandler.getData("filterOptions", []);
        if ($S.isArray(filterOptions)) {
            for (var i = 0; i<filterOptions.length; i++) {
                filterOptions[i].selectedValue = "";
            }
        }
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler.setData("filterValues", {});
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnInputChange: function(appStateCallback, appDataCallback, name, value) {
        var fieldsData = this.getData("fieldsData", {});
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        if ($S.isString(value)) {
            value = value.trim();
        }
        fieldsData[name] = value;
        this.setData("fieldsData", fieldsData);
    }
});
DataHandler.extend({
    getRenderData: function() {
        var currentList2Id = this.getData("currentList2Id", "");
        if ([Config.dbview].indexOf(currentList2Id) >= 0) {
            return DataHandlerDBView.getRenderData();
        }
        var dateParameters = this.getData("dateParameters", {});
        var dateSelect = this.getData("date-select", "");
        var result = [];
        if (DataHandlerV2.isPageDisabled(currentList2Id)) {
            return result;
        }
        if ([Config.update].indexOf(currentList2Id) >= 0) {
            dateSelect = "monthly";
        }
        if ($S.isObject(dateParameters) && $S.isArray(dateParameters[dateSelect])) {
            result = dateParameters[dateSelect];
        }
        var userData = DataHandler.getData("userData", []);
        var metaData = DataHandler.getData("metaData", {});
        var filterOptions = DataHandler.getData("filterOptions", []);
        var filteredUserData = AppHandler.getFilteredData(metaData, userData, filterOptions);
        DataHandler.setData("filteredUserData", filteredUserData);
        if ([Config.ta].indexOf(currentList2Id) >= 0) {
            return filteredUserData;
        }
        return result;
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        var dataLoadStatus = this.isDataLoadComplete();
        var renderData = null;
        var footerData = null;
        var appHeading = null;
        var dateSelection = null;
        if (dataLoadStatus) {
            renderData = this.getRenderData();
            footerData = AppHandler.GetFooterData(this.getData("metaData", {}));
            appHeading = TemplateHandler.GetHeadingField(this.getHeadingText());
            dateSelection = Config.dateSelection;
        }
        var renderFieldRow = TemplateHandler.GetPageRenderField(dataLoadStatus, renderData, footerData);
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        var list2Data = [];
        var list1Data = [];
        var filterOptions = [];
        if (dataLoadStatus && currentList2Id !== Config.home) {
            list1Data = this.getData("appControlData", []);
            list2Data = DataHandlerV2.getList2Data();
            filterOptions = DataHandler.getData("filterOptions", []);
            filterOptions = AppHandler.getFilterData(filterOptions);
        }
        var dateSelectionRequired = Config.dateSelectionRequired;
        if (DataHandlerV2.isPageDisabled(currentList2Id)) {
            filterOptions = [];
            dateSelectionRequired = null;
        }
        appDataCallback("renderFieldRow", renderFieldRow);
        appDataCallback("appHeading", appHeading);
        appDataCallback("list1Data", list1Data);
        appDataCallback("currentList1Id", this.getData("currentList1Id", ""));
        appDataCallback("filterOptions", filterOptions);
        appDataCallback("disableFooter", this.getDisableFooterStatus());

        appDataCallback("list2Data", list2Data);
        appDataCallback("currentList2Id", DataHandler.getData("currentList2Id", ""));
        appDataCallback("dateSelectionRequiredPages", dateSelectionRequired);
        appDataCallback("dateSelection", dateSelection);
        appDataCallback("selectedDateType", DataHandler.getData("date-select", ""));

        appDataCallback("firstTimeDataLoadStatus", "completed");
        appStateCallback();
    }
});

})($S);

export default DataHandler;
