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


keys.push("currentAppId");

keys.push("filterOptions");


keys.push("appControlData");
keys.push("metaData");
keys.push("reportData");
keys.push("appControlDataLoadStatus");
keys.push("metaDataLoadStatus");
keys.push("reportDataLoadStatus");

keys.push("firstTimeDataLoadStatus");


keys.push("fieldsData");
var bypassKeys = [];

keys = keys.concat(bypassKeys);
CurrentData.setKeys(keys);

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
    setCurrentAppId: function() {
        var appControlData = this.getData("appControlData", []);
        var currentAppId = "";
        if ($S.isArray(appControlData) && appControlData.length > 0) {
            if ($S.isString(appControlData[0]["id"])) {
                currentAppId = appControlData[0]["id"];
            }
        }
        DataHandler.setData("currentAppId", currentAppId);
    },
    metaDataInit: function() {
    },
    getCurrentAppData: function() {
        var appControlData = this.getData("appControlData", []);
        var currentAppId = this.getData("currentAppId", "");
        var currentAppData = {};
        if ($S.isArray(appControlData)) {
            for (var i = 0; i < appControlData.length; i++) {
                if (appControlData[i]["id"] === currentAppId) {
                    currentAppData = appControlData[i];
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
        var headingText = currentStaticData.heading;
        if ($S.isString(headingText) && headingText.length) {
            return headingText;
        }
        return "Query parameter not found";
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
    },/*
    getPageName: function() {
        return DataHandler.getData("currentPageName", "");
    },
    getOptionName: function() {
        return DataHandler.getData("currentOptionName", "");
    },
    getFieldNames: function() {
        var fieldsName = DataHandler.getData("currentFieldsName", []);
        if ($S.isArray(fieldsName) && fieldsName.length === 1 && fieldsName[0] === "all") {
            fieldsName = this._getAllFieldsName();
        }
        return fieldsName;
    }*/
});
DataHandler.extend({
    getReportDataApi: function() {
        var currentAppData = this.getCurrentAppData();
        var api = [];
        if ($S.isObject(currentAppData) && $S.isArray(currentAppData.dataPathApi)) {
            for (var i = 0; i < currentAppData.dataPathApi.length; i++) {
                if ($S.isString(currentAppData.dataPathApi[i]) && currentAppData.dataPathApi[i].length > 0) {
                    api.push(Config.dataLoadBaseapi + currentAppData.dataPathApi[i]);
                }
            }
        }
        return api;
    },
    loadReport: function(callback) {
        DataHandler.setData("reportDataLoadStatus", "in_progress");
        $S.loadJsonData(null, this.getReportDataApi(), function(response, apiName, ajax){
            DataHandler.setData("reportDataLoadStatus", "completed");
            DataHandlerV2.HandleReportTextLoad(response);
        }, function() {
            $S.log("reportData load complete");
            DataHandler.generateFilterOption();
            $S.callMethod(callback);
        }, null, Api.getAjaxApiCallMethodV2());
    },
    loadDataByAppId: function(callback) {
        var appControlData = DataHandler.getCurrentAppData();//{}
        var metaDataApi = [];
        if ($S.isArray(appControlData["metaDataApi"])) {
            metaDataApi = Config.dataLoadBaseapi + appControlData["metaDataApi"];
        }
        DataHandler.setData("metaDataLoadStatus", "in_progress");
        $S.loadJsonData(null, [metaDataApi], function(response, apiName, ajax){
            if ($S.isObject(response)) {
                DataHandler.setData("metaData", response);
            }
            DataHandler.setData("metaDataLoadStatus", "completed");
            DataHandler.metaDataInit();
        }, function() {
            $S.log("metaData load complete");
            DataHandler.loadReport(callback);
        }, null, Api.getAjaxApiCallMethod());
    },
    AppDidMount: function(appStateCallback, appDataCallback) {
        $S.loadJsonData(null, [Config.getApiUrl("app-control-data", null, true)], function(response, apiName, ajax){
            if ($S.isArray(response)) {
                DataHandler.setData("appControlData", response);
            } else {
                DataHandler.setData("appControlData", []);
            }
            DataHandler.setData("appControlDataLoadStatus", "completed");
            DataHandler.setCurrentAppId();
        }, function() {
            $S.log("appControlData load complete");
            DataHandler.loadDataByAppId(function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        }, null, Api.getAjaxApiCallMethod());
    }
});
DataHandler.extend({
    OnReloadClick: function(appStateCallback, appDataCallback, currentList1Id) {
        DataHandler.loadDataByAppId(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
    },
    OnAppChange: function(appStateCallback, appDataCallback, list1Id) {
        DataHandler.setData("currentAppId", list1Id);
        this.OnReloadClick(appStateCallback, appDataCallback, list1Id);
    },
    OnFilterChange: function(appStateCallback, appDataCallback, name, value) {
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
            }
        }
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    }
});
DataHandler.extend({
    getRenderData: function(pageName, optionName, fieldName) {
        var reportData = this.getData("reportData", {});
        var filterOptions = DataHandler.getData("filterOptions", []);
        var temp, temp2, i, j, k, filterIndex, filterValue;
        if (!$S.isArray(reportData)) {
            reportData = [];
        }
        for(k=0; k<filterOptions.length; k++) {
            filterIndex = filterOptions[k].dataKey;
            filterValue = filterOptions[k].selectedValue;
            if (!$S.isNumber(filterIndex) || filterIndex < 0) {
                continue;
            }
            if (!$S.isString(filterValue) || filterValue === "") {
                continue;
            }
            temp = [];
            for (i = 0; i < reportData.length; i++) {
                if (!$S.isArray(reportData[i])) {
                    continue;
                }
                temp2 = [];
                for (j = 0; j < reportData[i].length; j++) {
                    if (j === filterIndex && reportData[i][j] !== filterValue) {
                        temp2 = [];
                        break;
                    }
                    temp2.push(reportData[i][j]);
                }
                if (temp2.length >= 1) {
                    temp.push(temp2);
                }
            }
            reportData = temp;
        }
        return reportData;
    },
    generateFilterOption: function() {
        var reportData = this.getData("reportData", []);
        var metaData = this.getData("metaData", {});
        var filterIndex = [];
        var minDataLength = metaData.minDataLength;
        if (!$S.isNumber(minDataLength)) {
            minDataLength = 2;
        }
        if ($S.isArray(metaData.filterIndex)) {
            filterIndex = metaData.filterIndex.filter(function(el, i, arr) {
                return $S.isNumber(el);
            });
        }
        var tempFilterOptions = {};
        var i, j, temp;
        for(i=0; i<filterIndex.length; i++) {
            tempFilterOptions[filterIndex[i]] = {
                "dataKey": filterIndex[i],
                "selectName": filterIndex[i]+"Selected",
                "possibleIds": [],
                "filterOption": []
            };
        }
        for(i=0; i<reportData.length; i++) {
            for(j=0; j<filterIndex.length; j++) {
                if (filterIndex[i] === -1) {
                    continue;
                }
                temp = reportData[i][tempFilterOptions[filterIndex[j]].dataKey];
                if (!$S.isString(temp) || temp.trim().length < 1) {
                    continue;
                }
                temp = temp.trim();
                if (tempFilterOptions[filterIndex[j]].possibleIds.indexOf(temp) < 0) {
                    tempFilterOptions[filterIndex[j]].possibleIds.push(temp);
                    tempFilterOptions[filterIndex[j]].filterOption.push({"value": temp, "option": temp});
                }
            }
        }
        for(temp in tempFilterOptions) {
            tempFilterOptions[temp].filterOption.sort(function(a, b) {
                return a.option > b.option ? 1 : -1;
            });
            if (tempFilterOptions[temp].filterOption.length > 0) {
                $S.addElAt(tempFilterOptions[temp].filterOption, 0, {"value": "", "option": "All"});
            }
        }
        var resetButton = [{"name": "reset-filter", "value": "reset-filter", "display": "Reset"}];
        var filterOptions = [];
        for(i=0; i<filterIndex.length; i++) {
            if (filterIndex[i] === -1) {
                filterOptions.push({"type": "buttons", "buttons": resetButton, "selectedValue": ""});
                continue;
            }
            if (tempFilterOptions[filterIndex[i]].filterOption.length > 0) {
                filterOptions.push({"type": "dropdown",
                    "dataKey": tempFilterOptions[filterIndex[i]].dataKey,
                    "selectName": tempFilterOptions[filterIndex[i]].selectName,
                    "text": tempFilterOptions[filterIndex[i]].filterOption,
                    "selectedValue": ""
                });
            }
        }
        this.setData("filterOptions", filterOptions);
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        if (!this.isDataLoadComplete()) {
            return;
        }
        var renderData = this.getRenderData();
        var footerData = DataHandler.getFooterData();
        var renderFieldRow = TemplateHandler.GetPageRenderField(renderData, footerData);
        var appHeading = TemplateHandler.GetHeadingField(this.getHeadingText());
        var filterOptions = DataHandler.getData("filterOptions", []);

        appDataCallback("renderFieldRow", renderFieldRow);
        appDataCallback("appHeading", appHeading);
        appDataCallback("currentList1Id", this.getData("currentAppId", ""));
        appDataCallback("list1Data", this.getData("appControlData", []));
        appDataCallback("filterOptions", AppHandler.getFilterData(filterOptions));
        appDataCallback("disableFooter", this.getDisableFooterStatus());
        appDataCallback("firstTimeDataLoadStatus", "completed");
        appStateCallback();
    }
});

})($S);

export default DataHandler;
