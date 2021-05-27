import $S from "../../interface/stack.js";
// import $$$ from '../../interface/global';
import Config from "./Config";
import DataHandlerV2 from "./DataHandlerV2";
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
keys.push("apiDataPathResponse");

keys.push("filterOptions");


keys.push("appControlData");
keys.push("metaData");
keys.push("reportData");

keys.push("loginUserDetailsLoadStatus");
keys.push("appControlDataLoadStatus");
keys.push("metaDataLoadStatus");
keys.push("reportDataLoadStatus");

keys.push("firstTimeDataLoadStatus");


keys.push("fieldsData");
var bypassKeys = ["0Selected","1Selected","2Selected","3Selected","4Selected","5Selected","6Selected","7Selected","8Selected","9Selected"];

keys = keys.concat(bypassKeys);
CurrentData.setKeys(keys);


CurrentData.setData("loginUserDetailsLoadStatus", "not-started");
CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("metaDataLoadStatus", "not-started");
CurrentData.setData("reportDataLoadStatus", "not-started");

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
    getFilterDataValues: function() {
        var result = {};
        for (var i=0; i<bypassKeys.length; i++) {
            result[bypassKeys[i]] = this.getData(bypassKeys[i]);
        }
        return result;
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
        dataLoadStatusKey.push("metaDataLoadStatus");
        dataLoadStatusKey.push("reportDataLoadStatus");
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
        DataHandler.handleAppIdChange();
    },
    handleAppIdChange: function() {
        var appControlData = this.getCurrentAppData();
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        var currentFileLoadType = DataHandler.getData("date-select", "single-file");
        if ($S.isObject(appControlData)) {
            if ($S.isString(appControlData["currentFileLoadType"])) {
                currentFileLoadType = appControlData["currentFileLoadType"];
            }
            if ($S.isArray(appControlData["dataPathApi"]) && appControlData["dataPathApi"].length > 0) {
                if (appControlData["dataPathApi"].indexOf(currentList2Id) < 0) {
                    currentList2Id = appControlData["dataPathApi"][0];
                }
            }
        }
        DataHandler.setData("date-select", currentFileLoadType);
        DataHandler.setData("currentList2Id", currentList2Id);
        DataHandler.setData("apiDataPathResponse", []);
    },
    metaDataInit: function() {
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
    updateDataPathApi: function(api) {
        var appControlData = this.getData("appControlData", []);
        var currentAppId = this.getData("currentList1Id", "");
        var currentAppData = {};
        if ($S.isArray(appControlData)) {
            for (var i = 0; i < appControlData.length; i++) {
                if (appControlData[i]["id"] === currentAppId) {
                    currentAppData = appControlData[i];
                    currentAppData.dataPathApi = api;
                    break;
                }
            }
        }
        this.setData("appControlData", appControlData);
    },
    getDisableFooterStatus: function() {
        var currentAppData = this.getCurrentAppData();
        var disableFooter = true;
        if ($S.isBooleanFalse(currentAppData.disableFooter)) {
            disableFooter = false;
        }
        return disableFooter;
    },
    getWordBreak: function() {
        var currentAppData = this.getCurrentAppData();
        if ($S.isString(currentAppData.wordBreak)) {
            return currentAppData.wordBreak;
        }
        return ",";
    },
    isSkipEmpty: function() {
        var currentAppData = this.getCurrentAppData();
        if ($S.isBooleanTrue(currentAppData.skipEmpty)) {
            return currentAppData.skipEmpty;
        }
        return false;
    },
    getFooterData: function() {
        var metaData = DataHandler.getData("metaData", {});
        var staticFooterData = metaData.footerData;
        var footerData = [];
        if ($S.isArray(staticFooterData)) {
            for (var i = 0; i < staticFooterData.length; i++) {
                if (!$S.isArray(staticFooterData[i].entry)) {
                    $S.log("Invalid footer entry: " + staticFooterData[i]);
                    continue;
                }
                if (staticFooterData[i].type === "table-rows") {
                    footerData.push({"type": "table", "entry": staticFooterData[i].entry});
                } else if (staticFooterData[i].type === "table-cols") {
                    footerData.push({"type": "table", "entry": AppHandler.ConvertRowToCol(staticFooterData[i].entry)});
                } else {
                    footerData.push({"type": "div", "entry": staticFooterData[i].entry});
                }
            }
        }

        return footerData;
    },
    getHeadingText: function() {
        var currentStaticData = this.getCurrentAppData();
        return AppHandler.getHeadingText(currentStaticData, "App Heading");
    },
    getUserInfoById: function(id) {
        var metaData = this.getData("metaData", {});
        var userData = {};
        if ($S.isArray(metaData.accounts)) {
            for (var i = 0; i < metaData.accounts.length; i++) {
                if (metaData.accounts[i].id === id) {
                    userData = metaData.accounts[i];
                    break;
                }
            }
        }
        return userData;
    },
    getUnit: function() {
        var currentStaticData = this.getCurrentAppData();
        var unit = currentStaticData.unit;
        if ($S.isString(unit) && unit.length) {
            return unit;
        }
        return "";
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
                TemplateHandler.setHeadingUsername(AppHandler.GetUserData("username", ""));
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
    loadReportDataApi: function(callback) {
        var currentAppData = this.getCurrentAppData();
        var apiDataPathResponse = [];
        var api = [];
        var dataPathLength = 0;
        var temp;
        if ($S.isObject(currentAppData) && $S.isBooleanTrue(currentAppData.loadReportDataFromApi)) {
            DataHandlerV2.loadDataPath(function(response) {
                var currentList2Id = DataHandler.getData("currentList2Id", "");
                var firstCurrentList2Id = "";
                if ($S.isObject(response) && response.status === "SUCCESS" && $S.isArray(response.data)) {
                    temp = response.data.sort();
                    for(var i=temp.length-1; i>=0; i--) {
                        api.push(temp[i]);
                        apiDataPathResponse.push(temp[i]);
                        if (firstCurrentList2Id.length < 1) {
                            firstCurrentList2Id = temp[i];
                        }
                    }
                    if (apiDataPathResponse.indexOf(currentList2Id) < 0) {
                        DataHandler.setData("currentList2Id", firstCurrentList2Id);
                    }
                }
                dataPathLength = api.length;
                if (dataPathLength > 0) {
                    Config.dateSelection[1]["name"] = "All file (" + dataPathLength + ")";
                } else {
                    Config.dateSelection[1]["name"] = "All file (0)";
                }
                DataHandler.setData("apiDataPathResponse", apiDataPathResponse);
                DataHandler.updateDataPathApi(api);
                callback();
            });
        } else {
            if ($S.isObject(currentAppData) && $S.isArray(currentAppData.dataPathApi)) {
                dataPathLength = currentAppData.dataPathApi.length;
            }
            if (dataPathLength > 0) {
                Config.dateSelection[1]["name"] = "All file (" + dataPathLength + ")";
            } else {
                Config.dateSelection[1]["name"] = "All file (0)";
            }
            callback();
        }
    },
    loadReportByApiPath: function(apiPath, callback) {
        var finalResponse = [];
        DataHandler.setData("reportDataLoadStatus", "in_progress");
        $S.loadJsonData(null, apiPath, function(response, apiName, ajax){
            finalResponse.push(response);
        }, function() {
            DataHandler.setData("reportDataLoadStatus", "completed");
            $S.log("reportData load complete");
            DataHandlerV2.HandleReportTextLoad(finalResponse);
            DataHandler.generateFilterOption();
            $S.callMethod(callback);
        }, null, Api.getAjaxApiCallMethodV2());
    },
    getCurrentReportData: function() {
        var apiPath = DataHandler.getReportDataApi();
        var dateSelect = DataHandler.getData("date-select");
        var currentAppData = this.getCurrentAppData();
        if (dateSelect === "all-file") {
            if ($S.isBooleanTrue(currentAppData.enableLoadAllFile) || !$S.isBooleanTrue(currentAppData.loadReportDataFromApi)) {
                apiPath = DataHandler.getAllReportDataApi();
            }
        }
        return apiPath;
    },
    loadReport: function(callback) {
        DataHandler.setData("reportDataLoadStatus", "in_progress");
        this.loadReportDataApi(function() {
            var apiPath = DataHandler.getCurrentReportData();
            DataHandler.loadReportByApiPath(apiPath, callback);
        });
    },
    loadDataByAppId: function(callback) {
        var appControlData = DataHandler.getCurrentAppData();//{}
        var metaDataApi = [];
        if ($S.isArray(appControlData["metaDataApi"])) {
            metaDataApi = Config.baseApi + appControlData["metaDataApi"];
        }
        DataHandler.setData("metaDataLoadStatus", "in_progress");
        $S.loadJsonData(null, [metaDataApi], function(response, apiName, ajax){
            if ($S.isObject(response)) {
                DataHandler.setData("metaData", response);
            }
            DataHandler.metaDataInit();
        }, function() {
            DataHandler.setData("metaDataLoadStatus", "completed");
            $S.log("metaData load complete");
            DataHandler.loadReport(callback);
        }, null, Api.getAjaxApiCallMethod());
    },
    loadAppControlData: function(callback) {
        DataHandler.setData("appControlDataLoadStatus", "in_progress");
        AppHandler.loadAppControlData(Config.getApiUrl("appControlData", null, true), Config.baseApi, Config.appControlDataPath, Config.validAppControl, function(response) {
            DataHandler.setData("appControlData", response);
            $S.log("appControlData load complete");
            DataHandler.setData("appControlDataLoadStatus", "completed");
            DataHandler.setCurrentAppId();
            DataHandler.loadDataByAppId(callback);
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
        var apiPath = Config.baseApi + DataHandler.generateApi(list2Id);
        DataHandler.loadReportByApiPath([apiPath], function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnFilterChange: function(appStateCallback, appDataCallback, name, value) {
        DataHandler.setData(name, value);
        var filterOptions = DataHandler.getData("filterOptions", []);
        if ($S.isArray(filterOptions)) {
            for (var i = 0; i<filterOptions.length; i++) {
                if (filterOptions[i].selectName === name) {
                    filterOptions[i].selectedValue = value;
                }
            }
        }
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnResetClick: function(appStateCallback, appDataCallback, name, value) {
        var filterOptions = DataHandler.getData("filterOptions", []);
        if ($S.isArray(filterOptions)) {
            for (var i = 0; i<filterOptions.length; i++) {
                filterOptions[i].selectedValue = "";
                DataHandler.setData(filterOptions[i].selectName, "");
            }
        }
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnDateSelectClick: function(appStateCallback, appDataCallback, value) {
        DataHandler.setData("date-select", value);
        DataHandler.loadReportByApiPath(DataHandler.getCurrentReportData(), function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    }
});
DataHandler.extend({
    getRenderData: function(pageName, optionName, fieldName) {
        var currentAppData = this.getCurrentAppData();
        var metaData = this.getData("metaData", {});
        var reportData = this.getData("reportData", {});
        var filterOptions = this.getData("filterOptions", []);
        var filteredData = AppHandler.getFilteredData(currentAppData, metaData, reportData, filterOptions);
        return filteredData;
    },
    generateFilterOption: function() {
        var currentAppData = this.getCurrentAppData();
        var reportData = this.getData("reportData", []);
        var metaData = this.getData("metaData", {});
        var filterValues = DataHandler.getFilterDataValues();
        var filterOptions = AppHandler.generateFilterData(currentAppData, metaData, reportData, filterValues);
        this.setData("filterOptions", filterOptions);
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        var dataLoadStatus = this.isDataLoadComplete();
        var renderData = null;
        var footerData = null;
        if (dataLoadStatus) {
            renderData = this.getRenderData();
            footerData = DataHandler.getFooterData();
        }
        var appHeading = TemplateHandler.GetHeadingField(this.getHeadingText());
        var renderFieldRow = TemplateHandler.GetPageRenderField(dataLoadStatus, renderData, footerData);
        var filterOptions = DataHandler.getData("filterOptions", []);

        appDataCallback("renderFieldRow", renderFieldRow);
        appDataCallback("appHeading", appHeading);
        appDataCallback("currentList1Id", this.getData("currentList1Id", ""));
        appDataCallback("list1Data", this.getData("appControlData", []));
        appDataCallback("filterOptions", AppHandler.getFilterData(filterOptions));
        appDataCallback("disableFooter", this.getDisableFooterStatus());

        var currentList2Id = DataHandler.getData("currentList2Id", "");
        var dateSelect = DataHandler.getData("date-select");
        var apiPath = [];
        var list2Data = [];
        if (dateSelect === "single-file") {
            apiPath = DataHandler.getAllReportDataApiV2();
            list2Data = apiPath.map(function(el, i, arr) {
                return {"name": el, "toText": el};
            });
        }
        appDataCallback("list2Data", list2Data);
        appDataCallback("currentList2Id", currentList2Id);
        appDataCallback("dateSelectionRequiredPages", [currentList2Id]);
        appDataCallback("dateSelection", Config.dateSelection);
        appDataCallback("selectedDateType", dateSelect);

        appDataCallback("firstTimeDataLoadStatus", "completed");
        appStateCallback();
    }
});

})($S);

export default DataHandler;
