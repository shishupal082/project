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
keys.push("list1Id");
keys.push("list2Id");

keys.push("renderData");
keys.push("renderFieldRow");


keys.push("filter1");
keys.push("filter2");

keys.push("appControlData");
keys.push("metaData");
keys.push("rawData");

keys.push("appControlDataLoadStatus");
keys.push("metaDataLoadStatus");
keys.push("rawDataLoadStatus");

keys.push("firstTimeDataLoadStatus");
keys.push("evaluating");
CurrentData.setKeys(keys);

CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("metaDataLoadStatus", "not-started");
CurrentData.setData("rawDataLoadStatus", "not-started");

CurrentData.setData("firstTimeDataLoadStatus", "not-started");
CurrentData.setData("evaluating", "not-started");

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
        dataLoadStatusKey.push("rawDataLoadStatus");
        if(DataHandler.getDataLoadStatusByKey(dataLoadStatusKey) !== "completed") {
            return false;
        }
        DataHandler.setData("firstTimeDataLoadStatus", "completed");
        return true;
    },
    getDataLoadStatus: function() {
        var isDataLoadComplete = this.isDataLoadComplete();
        var firstTimeDataLoadStatus = this.getData("firstTimeDataLoadStatus", "");
        if(firstTimeDataLoadStatus === "completed") {
            if (isDataLoadComplete) {
                return "completed";
            }
            return "in-progress";
        }
        return "not-started";
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
        DataHandler.setData("list1Id", currentAppId);
    },
    _getMetaDataCurrentValue: function(metaDataKey, fieldKey, currentValue) {
        if (!$S.isString(metaDataKey) || !$S.isString(fieldKey)) {
            return "";
        }
        var metaData = this.getData("metaData", {});
        var fieldItem = metaData[metaDataKey];
        var finalValue = "";
        if (metaDataKey === "filter1" && $S.isObject(metaData[metaDataKey])) {
            fieldItem = metaData[metaDataKey].text;
        }
        if (!$S.isArray(fieldItem)) {
            return "";
        }
        for (var i = 0; i < fieldItem.length; i++) {
            if (!$S.isObject(fieldItem[i])) {
                continue;
            }
            if (!$S.isString(fieldItem[i][fieldKey])) {
                continue;
            }
            if (finalValue.length === 0) {
                finalValue = fieldItem[i][fieldKey];
            }
            if (fieldItem[i][fieldKey] === currentValue) {
                finalValue = currentValue;
                break;
            }
        }
        return finalValue;
    },
    metaDataInit: function() {
        var list2CurrentId = this.getData("list2Id", "");
        var filter1CurrentId = this.getData("filter1", "");
        var list2Id = this._getMetaDataCurrentValue("list2Data", "name", list2CurrentId);
        var filter1 = this._getMetaDataCurrentValue("filter1", "value", filter1CurrentId);
        this.setData("list2Id", list2Id);
        this.setData("filter1", filter1);
    },
    getCurrentMetaData: function(name, key) {
        var metaData = this.getData("metaData", {});
        var currentValue = this.getData(name);
        var fieldItem = [];
        var result = {};
        if (!$S.isString(name) || !$S.isString(key)) {
            return result;
        }
        if (name === "filter1") {
            if ($S.isObject(metaData[name]) && $S.isArray(metaData[name].text)) {
                fieldItem = metaData[name].text;
            }
        }
        for (var i = 0; i < fieldItem.length; i++) {
            if ($S.isObject(fieldItem[i])) {
                if (fieldItem[i][key] === currentValue) {
                    result = fieldItem[i];
                    break;
                }
            }
        }
        return result;
    },
    getList2Data: function() {
        var metaData = this.getData("metaData", {});
        var result = [];
        if ($S.isObject(metaData) && $S.isArray(metaData.list2Data)) {
            result = metaData.list2Data;
        }
        return result;
    },
    getCurrentAppData: function() {
        var appControlData = this.getData("appControlData", []);
        var currentAppId = this.getData("list1Id", "");
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
    getBaseApi: function() {
        var currentAppData = this.getCurrentAppData();
        if ($S.isObject(currentAppData)) {
            if ($S.isString(currentAppData.baseapi) && currentAppData.baseapi.length > 0) {
                return currentAppData.baseapi;
            }
        }
        if ($S.isString(Config.baseapi) && Config.baseapi.length > 0) {
            return Config.baseapi;
        }
        return "";
    },
    getRawDataApi: function() {
        var baseapi = this.getBaseApi();
        var currentAppData = this.getCurrentAppData();
        var api = [];
        if ($S.isObject(currentAppData) && $S.isArray(currentAppData.rawDataApi)) {
            for (var i = 0; i < currentAppData.rawDataApi.length; i++) {
                if ($S.isString(currentAppData.rawDataApi[i]) && currentAppData.rawDataApi[i].length > 0) {
                    api.push(baseapi + currentAppData.rawDataApi[i]);
                }
            }
        }
        return api;
    },
    isFooterDisabled: function() {
        var currentAppData = this.getCurrentAppData();
        if ($S.isObject(currentAppData) && $S.isBooleanFalse(currentAppData.disableFooter)) {
            return false;
        }
        return true;
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
        var currentAppData = this.getCurrentAppData();
        var headingText = $S.isString(currentAppData.heading) ? currentAppData.heading.trim() : "";
        if (headingText.length === 0) {
            var name = $S.isString(currentAppData.name) ? currentAppData.name.trim() : "";
            if (name.length > 0) {
                headingText = name;
            }
        }
        if (this.getData("firstTimeDataLoadStatus") !== "completed") {
            headingText = "Loading...";
        } else if (headingText.length === 0) {
            headingText = "Current App Id not found";
        }
        return headingText;
    },
});
DataHandler.extend({
    loadRawData: function(callback) {
        var rawData = [];
        DataHandler.setData("rawDataLoadStatus", "in_progress");
        $S.loadJsonData(null, this.getRawDataApi(), function(response, apiName, ajax){
            if ($S.isString(response)) {
                rawData.push(response);
            }
        }, function() {
            DataHandler.setData("rawData", rawData);
            DataHandler.setData("rawDataLoadStatus", "completed");
            $S.log("rawData load complete");
            DataHandlerV2.HandleRawDataLoad(rawData, function() {
                DataHandlerV2.setRenderData(callback);
                $S.callMethod(callback);
            });
            $S.callMethod(callback);
        }, null, Api.getAjaxApiCallMethodV2());
    },
    loadDataByAppId: function(callback) {
        var appControlData = DataHandler.getCurrentAppData();//{}
        var baseapi = this.getBaseApi();
        var metaDataApi = [], i;
        if ($S.isArray(appControlData["metaDataApi"])) {
            for (i = 0; i < appControlData["metaDataApi"].length; i++) {
                metaDataApi.push(baseapi + appControlData["metaDataApi"][i]);
            }
        }
        var metaData = {};
        DataHandler.setData("metaDataLoadStatus", "in_progress");
        $S.loadJsonData(null, metaDataApi, function(response, apiName, ajax){
            if ($S.isObject(response)) {
                metaData = Object.assign(metaData, response);
            }
        }, function() {
            DataHandler.setData("metaData", metaData);
            DataHandler.setData("metaDataLoadStatus", "completed");
            DataHandler.metaDataInit();
            $S.log("metaData load complete");
            DataHandler.loadRawData(callback);
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
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    }
});
DataHandler.extend({
    OnReloadClick: function(appStateCallback, appDataCallback, currentList1Id) {
        DataHandler.setData("list1Id", currentList1Id);
        DataHandler.setData("rawData", []);
        DataHandlerV2.ClearRawDataLoad();
        DataHandler.loadDataByAppId(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
        this.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnAppChange: function(appStateCallback, appDataCallback, list1Id) {
        this.OnReloadClick(appStateCallback, appDataCallback, list1Id);
    },
    OnList2Change: function(appStateCallback, appDataCallback, list2Id) {
        DataHandler.setData("list2Id", list2Id);
        DataHandlerV2.setRenderData(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnFilterChange: function(appStateCallback, appDataCallback, name, value) {
        DataHandler.setData(name, value);
        DataHandlerV2.setRenderData(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnToggleDisplayClick: function(appStateCallback, appDataCallback) {
        var filter2 = this.getData("filter2", "");
        if (filter2 === "vertical") {
            filter2 = "horizontal";
        } else {
            filter2 = "vertical";
        }
        this.setData("filter2", filter2);
        DataHandlerV2.setRenderData(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    }
});
DataHandler.extend({
    getFilterOptions: function() {
        var filterOptions = [], i, j;
        var metaData = this.getData("metaData", {});
        var filter1Value = this.getData("filter1", "");
        var filter2Value = this.getData("filter2", "");
        var filterKeys = ["filter1", "filter2"];
        var filterValues = [filter1Value, filter2Value];
        var list2Id = this.getData("list2Id", "");
        var applicableList2Id = [];
        if ($S.isObject(metaData)) {
            for (j = 0; j < filterKeys.length; j++) {
                if ($S.isObject(metaData[filterKeys[j]])) {
                    if ($S.isArray(metaData[filterKeys[j]].text)) {
                        for (i = 0; i < metaData[filterKeys[j]].text.length; i++) {
                            if (metaData[filterKeys[j]].text[i].value === filterValues[j]) {
                                metaData[filterKeys[j]].text[i].selected = true;
                            }
                        }
                    }
                    if ($S.isArray(metaData[filterKeys[j]]["applicableList2Id"])) {
                        applicableList2Id = metaData[filterKeys[j]]["applicableList2Id"];
                        if (applicableList2Id.indexOf("all") >= 0 || applicableList2Id.indexOf(list2Id) >= 0) {
                            filterOptions.push(metaData[filterKeys[j]]);
                       }
                    }
                }
            }
        }
        return filterOptions;
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        var loadingStatus = this.getDataLoadStatus();
        var evaluatingStatus = this.getData("evaluating", "");
        var renderData = this.getData("renderData", []);
        var footerData = DataHandler.getFooterData();
        var renderFieldRow = TemplateHandler.GetPageRenderField(renderData, footerData, loadingStatus, evaluatingStatus);
        var appHeading = TemplateHandler.GetHeadingField(this.getHeadingText());
        var filterOptions = this.getFilterOptions();
        appDataCallback("renderFieldRow", renderFieldRow);
        appDataCallback("appHeading", appHeading);
        appDataCallback("currentList1Id", this.getData("list1Id", ""));
        appDataCallback("currentList2Id", this.getData("list2Id", ""));
        appDataCallback("disableFooter", this.isFooterDisabled());
        appDataCallback("list1Data", this.getData("appControlData", []));
        appDataCallback("list2Data", this.getList2Data());
        appDataCallback("filterOptions", filterOptions);
        appDataCallback("firstTimeDataLoadStatus", "completed");
        appStateCallback();
    }
});

})($S);

export default DataHandler;
