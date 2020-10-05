import $S from "../../interface/stack.js";
import Config from "./Config";
import TemplateHandler from "./TemplateHandler";

import Api from "../../common/Api";

var DataHandler;

(function($S){

var appControlData = {};
var appControlDataLoaded = false;

var CurrentData = $S.getDataObj();
var keys = ["currentSectionId"];
keys.push("currentPageName");
keys.push("currentPageHeading");
keys.push("currentDateSelectionType");
keys.push("homeFields");
keys.push("dropdownFields");

keys.push("appControlDataLoadStatus");
keys.push("csvDataLoadStatus");
keys.push("csvData");
keys.push("errorsData");

keys.push("renderFieldRowDataPageName");

CurrentData.setKeys(keys);
CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("csvDataLoadStatus", "not-started");

DataHandler = function(arg) {
    return new DataHandler.fn.init(arg);
};
DataHandler.fn = DataHandler.prototype = {
    constructor: DataHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    },
    update: function(name, data) {
        if (!$S.isObject(this.arg)) {
            return;
        }
        if (typeof this.arg[name] === typeof data) {
            if (typeof data === "object") {
                if ($S.isArray(data) === $S.isArray(this.arg[name])) {
                    this.arg[name] = data;
                } else if ($S.isObject(data) === $S.isObject(this.arg[name])) {
                    this.arg[name] = data;
                }
            } else {
                this.arg[name] = data;
            }
        }
    }
};

$S.extendObject(DataHandler);

DataHandler.extend({
    setData: function(key, value) {
        return CurrentData.setData(key, value);
    },
    getData: function(key, defaultValue) {
        return CurrentData.getData(key, defaultValue);
    }
});

DataHandler.extend({
    getDefaultSectionId: function() {
        var result = "";
        if ($S.isArray(appControlData.sections) && appControlData.sections.length > 0) {
            result = appControlData.sections[0]["id"];
        }
        return result;
    },
    getSectionData: function(sectionId) {
        var sectionData = {};
        if ($S.isString(sectionId) && sectionId.length > 0) {
            if ($S.isArray(appControlData.sections) && appControlData.sections.length > 0) {
                var sections = appControlData.sections;
                for (var i = 0; i< sections.length-1; i++) {
                    if (sectionId === sections[i].id) {
                        sectionData = sections[i];
                        break;
                    }
                }
            }
        }
        return sectionData;
    },
    getDefaultDateSelectionType: function(sectionId) {
        var result = "";
        var sectionData = this.getSectionData(sectionId);
        if ($S.isString(sectionData.defaultDateSelectionType)) {
            result = sectionData.defaultDateSelectionType;
        }
        return result;
    },
    getHomeFields: function() {
        var homeFields = [];
        var homeFieldsArr = appControlData.homeFields;
        var pages = Config.pages;
        if (!$S.isArray(homeFieldsArr)) {
            homeFieldsArr = [];
        }
        if (!$S.isObject(pages)) {
            pages = {};
        }
        homeFields = homeFieldsArr.map(function(el, i, arr) {
            el["s.no"] = i;
            el["url"] = pages[el.name];
            return el;
        });
        return homeFields;
    },
    getDropdownFields: function() {
        var dropdownFields = [];
        var dropdownFieldsArr = appControlData.dropdownFields;
        var pages = Config.pages;
        if (!$S.isArray(dropdownFieldsArr)) {
            dropdownFieldsArr = [];
        }
        if (!$S.isObject(pages)) {
            pages = {};
        }
        dropdownFields = dropdownFieldsArr.map(function(el, i, arr) {
            el["s.no"] = i;
            el["url"] = pages[el.name];
            return el;
        });
        return dropdownFields;
    },
    getSectionName: function() {
        var sectionId = DataHandler.getData("currentSectionId", "not-found");
        var section = DataHandler.getSectionData(sectionId);
        if ($S.isObject(section) && $S.isString(section.text)) {
            return section.text;
        }
        return "not-found";
    },
    getPageHeadingV2: function(pageName) {
        var pageHeading = "";
        if (appControlDataLoaded) {
            pageHeading = "Page Not Found";
        }
        if ($S.isObject(appControlData.pageHeading)) {
            if ($S.isString(appControlData.pageHeading[pageName])) {
                pageHeading = appControlData.pageHeading[pageName];
            }
        }
        return pageHeading;
    },
    getPageHeading: function() {
        var pageName = DataHandler.getData("currentPageName", "");
        return this.getPageHeadingV2(pageName);
    },
    getCsvDataApis: function() {
        var sectionId = DataHandler.getData("currentSectionId", "not-found");
        var section = DataHandler.getSectionData(sectionId);
        var csvDataApis = [];
        if (section && $S.isArray(section["dataApi"])) {
            csvDataApis = section["dataApi"].map(function(el, i, arr) {
                return Config.baseapi+el;
            });
        }
        return csvDataApis;
    },
    _getValidationData: function(key) {
        var validationData = [];
        if ($S.isString(key) && $S.isArray(appControlData[key])) {
            var tempValidationData = appControlData[key].map(function(el) {
                if (el && $S.isString(el.id)) {
                    return el.id;
                }
                return null;
            });
            for (var i = 0; i < tempValidationData.length; i++) {
                if ($S.isString(tempValidationData[i]) && tempValidationData[i].length > 0) {
                    validationData.push(tempValidationData[i]);
                }
            }
        }
        return validationData;
    },
    getValidTypes: function() {
        return this._getValidationData("monitoring-types");
    },
    getValidStation: function() {
        return this._getValidationData("stations");
    },
    getValidDevice: function() {
        return this._getValidationData("devices");
    }
});

DataHandler.extend({
    AppDidMount: function(appStateCallback, appDataCallback) {
        DataHandler.setData("appControlDataLoadStatus", "in-progress");
        $S.loadJsonData(null, Config.appControlApi, function(response, apiName, ajax){
            if ($S.isObject(response)) {
                appControlData = Object.assign(appControlData, response);
            }
        }, function() {
            DataHandler.setData("appControlDataLoadStatus", "completed");
            appControlDataLoaded = true;
            var currentSectionId = DataHandler.getDefaultSectionId();
            var currentDateSelectionType = DataHandler.getDefaultDateSelectionType(currentSectionId);
            var homeFields = DataHandler.getHomeFields();
            var dropdownFields = DataHandler.getDropdownFields();
            DataHandler.setData("currentSectionId", currentSectionId);
            DataHandler.setData("currentDateSelectionType", currentDateSelectionType);
            DataHandler.setData("homeFields", homeFields);
            DataHandler.setData("dropdownFields", dropdownFields);
            DataHandler.appControlDataLoadCallback(appStateCallback, appDataCallback);
        }, null, Api.getAjaxApiCallMethod());
    },
    PageComponentDidMount: function(appStateCallback, appDataCallback) {
        var csvDataApis = DataHandler.getCsvDataApis();
        var csvDataLoadStatus = DataHandler.getData("csvDataLoadStatus", "");
        if (csvDataApis.length && csvDataLoadStatus === "not-started") {
            DataHandler.setData("csvDataLoadStatus", "in-progress");
            appStateCallback({"isLoaded": false});
            $S.loadJsonData(null, csvDataApis, function(response, apiName, ajax){
                var csvData = DataHandler.getData("csvData", []);
                csvData.push(response);
                DataHandler.setData("csvData", csvData);
            }, function() {
                var csvData = DataHandler.getData("csvData", []);
                csvData = DataHandler.generatePageData(csvData);
                var requiredData = DataHandler.generateValidData(csvData);
                DataHandler.setData("csvData", requiredData["finalData"]);
                DataHandler.setData("errorsData", requiredData["errorsData"]);
                DataHandler.setData("csvDataLoadStatus", "completed");
                DataHandler.csvDataLoadCallback(appStateCallback, appDataCallback);
            }, null, Api.getAjaxApiCallMethodV2());
        }
        if (csvDataLoadStatus === "completed") {
            DataHandler.setPageData(appStateCallback, appDataCallback);
        }
    }
});

DataHandler.extend({
    appControlDataLoadCallback: function(appStateCallback, appDataCallback) {
        $S.log("appControlData load complete");
        appDataCallback("sectionName", DataHandler.getSectionName());
        appDataCallback("homeFields", DataHandler.getData("homeFields", []));
        appDataCallback("dropdownFields", DataHandler.getData("dropdownFields", []));
        appStateCallback({"isLoaded": true});
    },
    csvDataLoadCallback: function(appStateCallback, appDataCallback) {
        $S.log("csvData load complete");
        DataHandler.setData("renderFieldRowDataPageName", "")
        DataHandler.setPageData(appStateCallback, appDataCallback);
    }
});

DataHandler.extend({
    getPageRenderField: function(pageName) {
        var pageTemplate = TemplateHandler.getTemplate(pageName);
        var pageData = DataHandler.getData("csvData", []);
        var renderField = [];
        if (TemplateHandler[pageName]) {
            renderField = TemplateHandler[pageName](pageTemplate, pageData, pageName);
        } else {
            renderField = TemplateHandler.getTemplate("templateNotFound");
        }
        return renderField;
    },
    setPageData: function(appStateCallback, appDataCallback) {
        var currentPageName = DataHandler.getData("currentPageName", "");
        var renderFieldRowDataPageName = DataHandler.getData("renderFieldRowDataPageName", "");
        if (currentPageName !== renderFieldRowDataPageName) {
            renderFieldRowDataPageName = currentPageName;
            var renderFieldRow = DataHandler.getPageRenderField(currentPageName);
            DataHandler.setData("renderFieldRowDataPageName", currentPageName);
            appDataCallback("pageHeading", DataHandler.getPageHeadingV2(currentPageName));
            appDataCallback("renderFieldRow", renderFieldRow);
            appDataCallback("errorsData", DataHandler.getData("errorsData", []));
            appStateCallback({"isLoaded": true});
        }
    }
});

DataHandler.extend({
    _fileToJson: function(fileData) {
        var fileJsonData = [];
        if ($S.isString(fileData)) {
            fileData = fileData.split("\n");
            for(var i=0; i<fileData.length; i++) {
                fileJsonData.push(fileData[i].split(","));
            }
        }
        return fileJsonData;
    },
    _isInValidDate: function(dateStr) {
        return false;
    },
    generatePageData: function(csvData) {
        var jsonData = [];
        if ($S.isArray(csvData)) {
            for (var i = 0; i < csvData.length; i++) {
                jsonData.push(DataHandler._fileToJson(csvData[i]));
            }
        }
        return jsonData;
    },
    generateValidData: function(jsonData) {
        var errorsData = [];
        var finalData = [];
        var validTypes = DataHandler.getValidTypes();
        var validStation = DataHandler.getValidStation();
        var validDevice = DataHandler.getValidDevice();
        var isValidDate, isValidType, isValidStation, isValidDevice;
        if ($S.isArray(jsonData)) {
            for (var i = 0; i < jsonData.length; i++) {
                if ($S.isArray(jsonData[i])) {
                    for (var j = 0; j < jsonData[i].length; j++) {
                        if ($S.isArray(jsonData[i][j]) && jsonData[i][j].length > 1) {
                            isValidDate = true;
                            isValidType = true;
                            isValidStation = true;
                            isValidDevice = true;
                            if (jsonData[i][j].length >= 4) {
                                if (DataHandler._isInValidDate(jsonData[i][j][0])) {
                                    isValidType = false;
                                    errorsData.push({"reason": "Invalid date", "data": jsonData[i][j].join()});
                                }
                                if (validTypes.indexOf(jsonData[i][j][1]) < 0) {
                                    isValidType = false;
                                    errorsData.push({"reason": "Invalid type", "data": jsonData[i][j].join()});
                                }
                                if (validStation.indexOf(jsonData[i][j][2]) < 0) {
                                    isValidType = false;
                                    errorsData.push({"reason": "Invalid station", "data": jsonData[i][j].join()});
                                }
                                if (validDevice.indexOf(jsonData[i][j][3]) < 0) {
                                    isValidType = false;
                                    errorsData.push({"reason": "Invalid device", "data": jsonData[i][j].join()});
                                }
                                if (isValidDate && isValidType && isValidStation && isValidDevice) {
                                    var temp = {};
                                    temp["date"] = jsonData[i][j][0];
                                    temp["type"] = jsonData[i][j][1];
                                    temp["station"] = jsonData[i][j][2];
                                    temp["device"] = jsonData[i][j][3];
                                    if (jsonData[i][j].length >= 5) {
                                        temp["description"] = jsonData[i][j][4];
                                    }
                                    finalData.push(temp);
                                }
                            } else {
                                errorsData.push({"reason": "Invalid entry", "data": jsonData[i][j].join()});
                            }
                        }
                    }
                }
            }
        }
        return {errorsData: errorsData, finalData: finalData};
    }
});

})($S);

export default DataHandler;
