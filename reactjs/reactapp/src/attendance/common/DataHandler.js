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

//TA page
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
                    Config.summary, Config.ta, Config.dbview];
        if (pageRequiredDataLoadStatus.indexOf(currentList2Id) >= 0) {
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
    getBooleanParam: function(name, defaultValue) {
        var currentAppData = this.getCurrentAppData();
        var metaData = this.getData("metaData", {});
        var booleanVal = $S.findParam([currentAppData, metaData], name);
        if ($S.isBoolean(booleanVal)) {
            return booleanVal;
        }
        return defaultValue;
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
            DataHandler.handlePageRouting(null, callback);
        });
    },
    loadAttendanceData: function(attendanceDataApis, callback) {
        DataHandlerDBView.loadAttendanceData(attendanceDataApis, function(attendanceDbTable) {
            DataHandlerV2.handleAttendanceDataLoad(attendanceDbTable);
            $S.callMethod(callback);
        });
    },
    handlePageRouting: function(reason, callback) {
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        var metaData = DataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        var dbDataApis = $S.findParam([currentAppData, metaData], "dbDataApis", []);
        var attendanceDataApis = $S.findParam([currentAppData, metaData], "attendanceDataApis", []);
        if ([Config.dbview, Config.ta].indexOf(currentList2Id) >= 0) {
            DataHandlerDBView.handlePageLoad(dbDataApis, function() {
                DataHandlerDBView.generateFinalTable();
                DataHandlerDBView.generateFilterOptions();
                $S.callMethod(callback);
            });
        } else if ([Config.summary, Config.entry, Config.update].indexOf(currentList2Id) >= 0) {
            DataHandlerDBView.handlePageLoad(dbDataApis, function() {
                DataHandlerDBView.generateFinalTable();
                DataHandlerDBView.generateFilterOptions();
                DataHandler.loadAttendanceData(attendanceDataApis, callback);
            });
        } else if (reason !== "pageComponentDidMount" || [Config.home].indexOf(currentList2Id) >= 0) {
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
    OnList2Change: function(appStateCallback, appDataCallback, list2Id) {
        DataHandler.setData("currentList2Id", list2Id);
        DataHandlerDBView.generateFinalTable();
        DataHandlerDBView.generateFilterOptions();
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    PageComponentDidMount: function(appStateCallback, appDataCallback, list2Id) {
        var oldList2Id = DataHandler.getData("currentList2Id", "");
        if (oldList2Id !== list2Id) {
            DataHandler.setData("currentList2Id", list2Id);
            this.handlePageRouting("pageComponentDidMount", function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
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
        var metaData = DataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        var attendanceDataApis = $S.findParam([currentAppData, metaData], "attendanceDataApis", []);
        DataHandlerV2.callAddTextApi(name, value, function() {
            DataHandler.loadAttendanceData(attendanceDataApis, function() {
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
        if (DataHandlerV2.isPageDisabled(currentList2Id) || [Config.home].indexOf(currentList2Id) >= 0) {
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
        var renderData = [], i;
        var userData = DataHandler.getData("dbViewDataTable", []);
        var metaData = DataHandler.getData("metaData", {});
        var filterOptions = DataHandler.getData("filterOptions", []);
        var filteredUserData = AppHandler.getFilteredData(metaData, userData, filterOptions, "name");
        DataHandler.setData("filteredUserData", filteredUserData);
        var sortableValue = DataHandler.getData("sortableValue", "");
        var sortableName = DataHandler.getData("sortable", "");
        var displayDateSummary = DataHandler.getBooleanParam("displayDateSummary", false);
        if ([Config.summary].indexOf(currentList2Id) >= 0) {
            filteredUserData = this._generateSummaryUserData(filteredUserData);
        } else {
            filteredUserData = $S.sortResult(filteredUserData, sortableValue, sortableName, "name");
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
                        renderData[i].tableData = $S.sortResult(renderData[i].tableData, sortableValue, sortableName, "name");
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
                renderData = [{"tableData": filteredUserData}];
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
            footerData = AppHandler.GetFooterData(this.getData("metaData", {}));
            appHeading = TemplateHandler.GetHeadingField(this.getHeadingText());
            dateSelection = Config.dateSelection;
        }
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        var renderFieldRow = TemplateHandler.GetPageRenderField(dataLoadStatus, renderData, footerData, currentList2Id);
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
        appDataCallback("disableFooter", this.getBooleanParam("disableFooter", false));
        appDataCallback("enableToggleButton", this.getBooleanParam("enableToggleButton", true));

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
