import $S from "../../interface/stack.js";
// import $$$ from '../../interface/global';
import Config from "./Config";
import TemplateHandler from "./TemplateHandler";

import Api from "../../common/Api";
// import AppHandler from "../../common/app/common/AppHandler";

var DataHandler;

(function($S){
// var DT = $S.getDT();

var CurrentData = $S.getDataObj();
var keys = [];
// keys.push("currentPageName");
keys.push("availableDataPageName");
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

// keys.push("selectedDateType");
// keys.push("selectedDateParameter");
// keys.push("combinedDateSelectionParameter");


keys.push("staticData");
keys.push("taskData");
keys.push("componentData");
keys.push("appData");
keys.push("staticDataLoadStatus");
keys.push("taskDataLoadStatus");
keys.push("componentDataLoadStatus");
keys.push("appDataLoadStatus");
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
CurrentData.setData("staticDataLoadStatus", "not-started");
CurrentData.setData("taskDataLoadStatus", "not-started");
CurrentData.setData("componentDataLoadStatus", "not-started");
CurrentData.setData("appDataLoadStatus", "not-started");

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
        dataLoadStatusKey.push("staticDataLoadStatus");
        dataLoadStatusKey.push("taskDataLoadStatus");
        dataLoadStatusKey.push("appDataLoadStatus");
        dataLoadStatusKey.push("componentDataLoadStatus");
        if(DataHandler.getDataLoadStatusByKey(dataLoadStatusKey) !== "completed") {
            return false;
        }
        DataHandler.setData("firstTimeDataLoadStatus", "completed");
        return true;
    }
});

DataHandler.extend({
    getCurrentStaticData: function() {
        var currentFiltername = $S.getUrlAttribute(window.location.href, "name", "");
        var staticData = DataHandler.getData("staticData", {});
        var currentStaticData= {};
        if ($S.isArray(staticData.data)) {
            for (var i = 0; i < staticData.data.length; i++) {
                if (staticData.data[i].name === currentFiltername) {
                    currentStaticData = staticData.data[i];
                    break;
                }
            }
        }
        return currentStaticData;
    },
    getFooterFields: function() {
        var staticData = DataHandler.getData("staticData", {});
        var footerData = $S.clone(staticData.footerData);
        if ($S.isArray(footerData) && footerData.length > 0 && $S.isArray(footerData[0].text)) {
            for (var i = 0; i < footerData[0].text.length; i++) {
                if (footerData[0].text[i].tag === "a") {
                    footerData[0].text[i].href = Config.basepathname + footerData[0].text[i].href;
                }
            }
        }
        return footerData;
    },
    getHeadingText: function() {
        var currentStaticData = this.getCurrentStaticData();
        var headingText = currentStaticData.heading;
        return headingText;
    },
    getPageName: function() {
        var currentStaticData = this.getCurrentStaticData();
        var pageName = currentStaticData.pageName;
        return pageName;
    },
    getOptionName: function() {
        var currentStaticData = this.getCurrentStaticData();
        var optionName = currentStaticData.optionName;
        return optionName;
    },
    getFieldNames: function() {
        var currentStaticData = this.getCurrentStaticData();
        var fieldsName = currentStaticData.fieldsName;
        return fieldsName;
    }
});
DataHandler.extend({
    loadData: function(callback) {
        $S.loadJsonData(null, [Config.getApiUrl("static-data", null, true)], function(response, apiName, ajax){
            DataHandler.setData("staticDataLoadStatus", "completed");
            DataHandler.setData("staticData", response);
        }, function() {
            $S.log("taskData load complete");
            $S.callMethod(callback);
        }, null, Api.getAjaxApiCallMethod());

        $S.loadJsonData(null, [Config.getApiUrl("task-data", null, true)], function(response, apiName, ajax){
            DataHandler.setData("taskDataLoadStatus", "completed");
            DataHandler.setData("taskData", response);
        }, function() {
            $S.log("taskData load complete");
            $S.callMethod(callback);
        }, null, Api.getAjaxApiCallMethod());

        $S.loadJsonData(null, [Config.getApiUrl("component-data", null, true)], function(response, apiName, ajax){
            DataHandler.setData("componentDataLoadStatus", "completed");
            DataHandler.setData("componentData", response);
        }, function() {
            $S.log("componentData load complete");
            $S.callMethod(callback);

        }, null, Api.getAjaxApiCallMethod());
        $S.loadJsonData(null, [Config.getApiUrl("app-data", null, true)], function(response, apiName, ajax){
            DataHandler.setData("appDataLoadStatus", "completed");
            DataHandler.setData("appData", response);
        }, function() {
            $S.log("appData load complete");
            $S.callMethod(callback);
        }, null, Api.getAjaxApiCallMethod());
    },
    AppDidMount: function(appStateCallback, appDataCallback) {
        var dataLoadStatus = false;
        this.loadData(function() {
            dataLoadStatus = DataHandler.isDataLoadComplete();
            if (dataLoadStatus) {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            }
        });
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
    getRenderData: function(pageName, optionName, fieldName) {
        var i, j;
        var apiData = [];
        var temp, key;
        fieldName = $S.isArray(fieldName) ? fieldName : [];
        if (pageName === "app") {
            apiData = DataHandler.getData("appData",[]);
        } else if (pageName === "task") {
            apiData = DataHandler.getData("taskData", []);
        }
        var filteredData = [];
        for(j=0; j<fieldName.length; j++) {
            temp = "not-found";
            for (i = 0; i < apiData.length; i++) {
                if ($S.isObject(apiData[i].options)) {
                    if (fieldName[j] === apiData[i].options.name) {
                        filteredData.push(apiData[i].options);
                        temp = "found";
                    }
                }
            }
            if (temp === "not-found") {
                filteredData.push({"name": fieldName[j]});
            }
        }
        var optionsData = [];
        var rowKeys = [];
        for(i=0; i<filteredData.length; i++) {
            temp = {};
            if ($S.isString(filteredData[i][optionName])) {
                temp["name"] = filteredData[i].name;
                temp[optionName] = filteredData[i][optionName];
                temp["fieldData"] = this._generateFieldData(filteredData[i][optionName]);
                for(key in temp["fieldData"]) {
                    if (rowKeys.indexOf(key) < 0) {
                        rowKeys.push(key);
                    }
                }
                optionsData.push(temp);
            } else {
                optionsData.push(filteredData[i]);
            }
        }
        var finalOptionsData = [];
        temp = ["Parameters"];
        for (j = 0; j < optionsData.length; j++) {
            temp.push(optionsData[j].name)
        }
        finalOptionsData.push(temp);
        for (i = 0; i < rowKeys.length; i++) {
            key = rowKeys[i];
            temp = [];
            temp.push(key);
            for (j = 0; j < optionsData.length; j++) {
                if ($S.isObject(optionsData[j].fieldData)) {
                    if ($S.isString(optionsData[j].fieldData[key])) {
                        temp.push(optionsData[j].fieldData[key]);
                    } else {
                        temp.push("--");
                    }
                } else {
                    temp.push("--");
                }
            }
            finalOptionsData.push(temp);
        }
        return finalOptionsData;
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        var page = this.getPageName();
        var optionName = this.getOptionName();
        var fieldNames = this.getFieldNames();
        var renderData = this.getRenderData(page, optionName, fieldNames);
        var renderFieldRow = TemplateHandler.GetPageRenderField(renderData);
        var headingField = TemplateHandler.GetHeadingField(renderData);
        appDataCallback("appHeading", headingField);
        appDataCallback("renderFieldRow", renderFieldRow);
        appStateCallback();
    }
});

})($S);

export default DataHandler;
