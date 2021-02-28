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
CurrentData.setKeys(keys);

CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("metaDataLoadStatus", "not-started");
CurrentData.setData("rawDataLoadStatus", "not-started");

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
        dataLoadStatusKey.push("rawDataLoadStatus");
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
        DataHandler.setData("list1Id", currentAppId);
    },
    _getMetaDataCurrentValue: function(metaDataKey, fieldKey) {
        if (!$S.isString(metaDataKey) || !$S.isString(fieldKey)) {
            return "";
        }
        var metaData = this.getData("metaData", {});
        var currentValue = this.getData(metaDataKey, "");
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
        var list2Id = this._getMetaDataCurrentValue("list2Data", "name");
        var filter1 = this._getMetaDataCurrentValue("filter1", "value");
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
        var baseapi = "";
        if ($S.isObject(currentAppData)) {
            if ($S.isString(currentAppData.baseapi)) {
                baseapi = currentAppData.baseapi;
            }
        }
        return baseapi;
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
        if ($S.isObject(currentAppData) && $S.isBooleanTrue(currentAppData.disableFooter)) {
            return true;
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
        return "Current App Id not found";
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
            DataHandlerV2.HandleRawDataLoad(rawData);
            $S.log("rawData load complete");
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
    }
});
DataHandler.extend({
    OnReloadClick: function(appStateCallback, appDataCallback, currentList1Id) {
        DataHandler.setData("list1Id", currentList1Id);
        DataHandler.loadDataByAppId(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
    },
    OnAppChange: function(appStateCallback, appDataCallback, list1Id) {
        DataHandler.setData("list1Id", list1Id);
        this.OnReloadClick(appStateCallback, appDataCallback, list1Id);
    },
    OnList2Change: function(appStateCallback, appDataCallback, list2Id) {
        DataHandler.setData("list2Id", list2Id);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnFilterChange: function(appStateCallback, appDataCallback, name, value) {
        DataHandler.setData(name, value);
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
                    filterOptions.push(metaData[filterKeys[j]]);
                }
            }
        }
        return filterOptions;
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        if (!this.isDataLoadComplete()) {
            return;
        }
        var renderData = DataHandlerV2.getRenderData(this.getData("list2Id", ""));
        var footerData = DataHandler.getFooterData();
        var renderFieldRow = TemplateHandler.GetPageRenderField(renderData, footerData);
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
        appDataCallback("firstTimeDataLoadStatus", this.getData("firstTimeDataLoadStatus", ""));
        appStateCallback();
    }
});

})($S);

export default DataHandler;
