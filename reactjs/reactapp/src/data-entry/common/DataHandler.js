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
// keys.push("currentPageName");
// keys.push("currentFilterName");
// keys.push("currentPageName");
// keys.push("currentOptionName");
// keys.push("currentFieldsName");
// keys.push("availableDataPageName");
// keys.push("dropdownFields");

// keys.push("appControlDataLoadStatus");
// keys.push("metaDataLoadStatus");
// keys.push("csvDataLoadStatus");
// keys.push("firstTimeDataLoadStatus");

// keys.push("csvRawData");
// keys.push("csvData");
// keys.push("csvDataByDate");

keys.push("renderData");
keys.push("renderFieldRow");


keys.push("currentAppId");

keys.push("filter1");
keys.push("filter2");

// keys.push("selectedDateType");
// keys.push("selectedDateParameter");
// keys.push("combinedDateSelectionParameter");


keys.push("appControlData");
keys.push("metaData");
keys.push("userData");
keys.push("appControlDataLoadStatus");
keys.push("metaDataLoadStatus");
keys.push("userDataLoadStatus");

keys.push("firstTimeDataLoadStatus");


keys.push("fieldsData");
// keys.push("staticData");
// keys.push("taskData");
// keys.push("componentData");
// keys.push("appData");
// keys.push("staticDataLoadStatus");
// keys.push("taskDataLoadStatus");
// keys.push("componentDataLoadStatus");
// keys.push("appDataLoadStatus");
// keys.push("currentSectionId");
// keys.push("sectionName");
// keys.push("currentSectionData");
// keys.push("errorsData");

// keys.push("homeFields");
// keys.push("dropdownFields");


// keys.push("selectedStation");
// keys.push("selectedType");
// keys.push("selectedDevice");

// var bypassKeys = ["userTeam", "appControlData", "metaData", "sectionsData",
//         "currentSectionId", "currentPageName", "selectedDateType",
//         "appControlDataLoadStatus", "metaDataLoadStatus", "csvDataLoadStatus", "firstTimeDataLoadStatus",
//         "homeFields", "dropdownFields",
//         "selectedStation", "selectedType", "selectedDevice",
//         "loginUserDetailsLoadStatus", "usersFilesData"];

var bypassKeys = [];
// keys.push("addentry.subject");
// keys.push("addentry.heading");
// keys.push("addentry.textarea");
// keys.push("addentry.file");
// keys.push("addentry.fileUploadPercentage");
// keys.push("addentry.submitStatus"); //in_progress, completed

keys = keys.concat(bypassKeys);
CurrentData.setKeys(keys);

CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("metaDataLoadStatus", "not-started");
CurrentData.setData("userDataLoadStatus", "not-started");

// CurrentData.setData("staticDataLoadStatus", "not-started");
// CurrentData.setData("taskDataLoadStatus", "not-started");
// CurrentData.setData("componentDataLoadStatus", "not-started");
// CurrentData.setData("appDataLoadStatus", "not-started");
CurrentData.setData("firstTimeDataLoadStatus", "not-started");

// CurrentData.setData("loginUserDetailsLoadStatus", "not-started");
// CurrentData.setData("usersFilesData", []);

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
        dataLoadStatusKey.push("userDataLoadStatus");
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
        var metaData = this.getData("metaData", {});
        var currentFilter1 = this.getData("filter1", "");
        var currentFilter2 = this.getData("filter2", "");
        var filter1Data = metaData.filter1;
        var filter2Data = metaData.filter2;
        var i, filter1IsNotFound = true, filter2IsNotFound = true;
        var finalFilter1 = "", finalFilter2 = "";
        if ($S.isObject(filter1Data) && $S.isArray(filter1Data.text)) {
            for (i = 0; i < filter1Data.text.length; i++) {
                if (finalFilter1.length === 0 && $S.isString(filter1Data.text[i].value)) {
                    finalFilter1 = filter1Data.text[i].value;
                }
                if (filter1Data.text[i].value === currentFilter1) {
                    filter1IsNotFound = false;
                    break;
                }
            }
        }
        if ($S.isObject(filter2Data) && $S.isArray(filter2Data.text)) {
            for (i = 0; i < filter2Data.text.length; i++) {
                if (finalFilter2.length === 0 && $S.isString(filter2Data.text[i].value)) {
                    finalFilter2 = filter2Data.text[i].value;
                }
                if (filter2Data.text[i].value === currentFilter2) {
                    filter2IsNotFound = false;
                    break;
                }
            }
        }
        if (filter1IsNotFound) {
            currentFilter1 = finalFilter1;
        }
        if (filter2IsNotFound) {
            currentFilter2 = finalFilter2;
        }
        this.setData("filter1", currentFilter1);
        this.setData("filter2", currentFilter2);
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
    getCurrentFilter1Data: function() {
        var filter1 = this.getData("filter1", "");
        var filter1Data = {};
        var metaData = this.getData("metaData", {});
        if ($S.isObject(metaData["filter1"]) && $S.isArray(metaData["filter1"].text)) {
            for (var i = 0; i < metaData["filter1"].text.length; i++) {
                if (metaData["filter1"].text[i].value === filter1) {
                    filter1Data = metaData["filter1"].text[i];
                    break;
                }
            }
        }
        return filter1Data;
    },
    getCurrentFilter2Data: function() {
        var filter2 = this.getData("filter2", "");
        var filter2Data = {};
        var metaData = this.getData("metaData", {});
        if ($S.isObject(metaData["filter2"]) && $S.isArray(metaData["filter2"].text)) {
            for (var i = 0; i < metaData["filter2"].text.length; i++) {
                if (metaData["filter2"].text[i].value === filter2) {
                    filter2Data = metaData["filter2"].text[i];
                    break;
                }
            }
        }
        return filter2Data;
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
    loadUserData: function(callback) {
        DataHandler.setData("userDataLoadStatus", "in_progress");
        $S.loadJsonData(null, [Config.getApiUrl("user-data-csv", null, true)], function(response, apiName, ajax){
            DataHandler.setData("userDataLoadStatus", "completed");
            DataHandlerV2.HandleUserDataCsvLoad(response);
        }, function() {
            $S.log("userData load complete");
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
            DataHandler.loadUserData(callback);
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
        DataHandler.setData(name, value);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnInputChange: function(appStateCallback, appDataCallback, name, value) {
        var fieldsData = this.getData("fieldsData", {});
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        fieldsData[name] = value;
        this.setData("fieldsData", fieldsData);
    }
});
DataHandler.extend({
    _generateFieldData: function(dataStr) {
        var result = {};
        var temp, temp2, temp3;
        var i;
        if ($S.isString(dataStr)) {
            temp = dataStr.split("|");
            for(i=0; i<temp.length; i++) {
                temp2 = temp[i].split("=");
                if (temp2.length === 2) {
                    temp3 = temp2[0].split(":");
                    if (temp3.length === 2) {
                        if (temp3[1] === "string") {
                            result[temp3[0]] = temp2[1];
                        } else if (temp3[1] === "string[]") {
                            result[temp3[0]] = temp2[1].split(",");
                        }
                    }
                }
            }
        }
        return result;
    },
    _getApiData: function() {
        var currentPageName = DataHandler.getData("currentPageName", "");
        var apiData = {};
        if (currentPageName === "app") {
            apiData = DataHandler.getData("appData",[]);
        } else if (currentPageName === "task") {
            apiData = DataHandler.getData("taskData", []);
        }
        return apiData;
    },
    _getAllFieldsName: function() {
        var apiData = this._getApiData();
        var i;
        var result = [];
        for (i = 0; i < apiData.length; i++) {
            if ($S.isObject(apiData[i].options)) {
                if ($S.isString(apiData[i].options.name)) {
                    result.push(apiData[i].options.name);
                } else {
                    result.push("Invalid options.name");
                }
            }
        }
        return result;
    },
    getRenderData: function(pageName, optionName, fieldName) {
        var renderData = [];
        var metaData = this.getData("metaData", {});
        var temp, temp2, temp3, i;
        var unit = this.getUnit();
        var filter1Data = DataHandler.getCurrentFilter1Data();
        var filterTeam = [];
        if ($S.isArray(filter1Data.team)) {
            filterTeam = filter1Data.team;
        }
        var count = 1;
        if ($S.isObject(metaData) && $S.isArray(metaData.accounts)) {
            temp3 = ["S.No.", "Name", "ID", "Unit", "Entry"];
            renderData.push(temp3);
            for (i = 0; i < metaData.accounts.length; i++) {
                temp2 = [];
                temp = {"s.no": count, "name": "", "designation": "", "unit": "", "input": {}};
                temp["name"] = metaData.accounts[i].name;
                temp["designation"] = metaData.accounts[i].id;
                temp["unit"] = unit;
                temp["input"] = {"name": metaData.accounts[i].id, "defaultValue": "", "tag": "input"};
                temp2.push(temp["s.no"]);
                temp2.push(temp["name"]);
                temp2.push(temp["designation"]);
                temp2.push(temp["unit"]);
                temp2.push(temp["input"]);
                if ($S.isString(metaData.accounts[i].team) && filterTeam.indexOf(metaData.accounts[i].team) >= 0) {
                    count++;
                    renderData.push(temp2);
                }
            }
            renderData.push(temp3);
        }
        return renderData;
    },
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
        var renderData = this.getRenderData();
        var footerData = DataHandler.getFooterData();
        var renderFieldRow = TemplateHandler.GetPageRenderField(renderData, footerData);
        var appHeading = TemplateHandler.GetHeadingField(this.getHeadingText());
        var filterOptions = this.getFilterOptions();

        appDataCallback("renderFieldRow", renderFieldRow);
        appDataCallback("appHeading", appHeading);
        appDataCallback("currentList1Id", this.getData("currentAppId", ""));
        appDataCallback("list1Data", this.getData("appControlData", []));
        appDataCallback("filterOptions", filterOptions);
        appDataCallback("firstTimeDataLoadStatus", "completed");
        appStateCallback();
    }
});

})($S);

export default DataHandler;
