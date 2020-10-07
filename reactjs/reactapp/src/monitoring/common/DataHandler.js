import $S from "../../interface/stack.js";
import Config from "./Config";
import TemplateHandler from "./TemplateHandler";

import Api from "../../common/Api";

var DataHandler;

(function($S){
var DT = $S.getDT();

var appControlData = {};
var appControlDataLoaded = false;

var CurrentData = $S.getDataObj();
var keys = ["currentSectionId"];
keys.push("currentPageName");
keys.push("dropdownFields");

keys.push("appControlDataLoadStatus");
keys.push("csvDataLoadStatus");
keys.push("csvData");
keys.push("csvDataByDate");
keys.push("errorsData");


keys.push("renderData");
keys.push("renderFieldRowDataPageName");

keys.push("selectedDateType");
keys.push("selectedDateParameter");
keys.push("dateSelection");
keys.push("combinedDateSelectionParameter");



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
                for (var i = 0; i< sections.length; i++) {
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
    getDateSelection: function() {
        var dateSelection = [];
        if ($S.isArray(appControlData.dateSelection) && appControlData.dateSelection.length > 0) {
            dateSelection = appControlData.dateSelection;
        }
        return dateSelection;
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
    getAvailableSection: function() {
        var availableSection = [];
        if ($S.isArray(appControlData.sections) && appControlData.sections.length > 0) {
            availableSection = appControlData.sections;
        }
        return availableSection;
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
    _getDisplayName: function(key, id) {
        var displayName = id, temp;
        if ($S.isString(key) && $S.isArray(appControlData[key])) {
            for (var i = 0; i < appControlData[key].length; i++) {
                if (appControlData[key][i]["id"] === id) {
                    temp = appControlData[key][i]["name"];
                    if ($S.isString(temp) && temp.length) {
                        displayName = temp;
                    }
                    break;
                }
            }
        }
        return displayName;
    },
    getValidTypes: function() {
        return this._getValidationData("monitoring-types");
    },
    getValidStation: function() {
        return this._getValidationData("stations");
    },
    getValidDevice: function() {
        return this._getValidationData("devices");
    },
    getDisplayType: function(id) {
        return this._getDisplayName("monitoring-types", id);
    },
    getDisplayStation: function(id) {
        return this._getDisplayName("stations", id);
    },
    getDisplayDevice: function(id) {
        return this._getDisplayName("devices", id);
    }
});

DataHandler.extend({
    _generateDateSelectionParameter: function(allDateStr) {
        var dailyDateSelection = [];
        var monthlyDateSelection = [];
        var yearlyDateSelection = [];
        var allDateSelection = [];
        var allDate = [];
        if ($S.isArray(allDateStr)) {
            allDate = allDateStr;
        }
        var i, temp, heading, startDate, endDate;
        /*Daily Date Selection*/
        for (i=0; i<allDate.length; i++) {
            temp = allDate[i];
            dailyDateSelection.push({"dateRange": [temp+" 00:00", temp+" 23:59"], "dateHeading": temp});
        }
        /*Monthly Date Selection*/
        temp = [];
        var dObj;
        for (i=0; i<allDate.length; i++) {
            dObj = DT.getDateObj(allDate[i]);
            if (dObj !== null) {
                dObj.setDate(1);
                heading = DT.formateDateTime("MMM/ /YYYY", "/", dObj);
                startDate = DT.formateDateTime("YYYY/-/MM/-/DD/ 00:00", "/", dObj);
                dObj.setMonth(dObj.getMonth()+1);
                dObj.setDate(0);
                endDate = DT.formateDateTime("YYYY/-/MM/-/DD/ 23:59", "/", dObj);
            } else {
                continue;
            }
            if (temp.indexOf(heading) < 0) {
                monthlyDateSelection.push({"dateRange": [startDate, endDate], "dateHeading": heading});
                temp.push(heading);
            }
        }
        /*Yearly Date Selection*/
        temp = [];
        for (i=0; i<allDate.length; i++) {
            dObj = DT.getDateObj(allDate[i]);
            if (dObj !== null) {
                dObj.setDate(1);
                heading = DT.formateDateTime("YYYY", "/", dObj);
                startDate = heading +"-01-01 00:00";
                endDate = heading +"-12-31 23:59";
            } else {
                continue;
            }
            if (temp.indexOf(heading) < 0) {
                yearlyDateSelection.push({"dateRange": [startDate, endDate], "dateHeading": heading});
                temp.push(heading);
            }
        }
        /*All Date Selection*/
        if (allDate.length > 0) {
            allDateSelection.push({"dateRange": [allDate[0] + " 00:00", allDate[allDate.length-1] + " 23:59"], "dateHeading": "All"});
        }
        var combinedDateSelectionParameter = {};
        combinedDateSelectionParameter["daily"] = dailyDateSelection;
        combinedDateSelectionParameter["monthly"] = monthlyDateSelection;
        combinedDateSelectionParameter["yearly"] = yearlyDateSelection;
        combinedDateSelectionParameter["all"] = allDateSelection;

        return combinedDateSelectionParameter;
    },
    _setDateFilterParameters: function() {
        var csvDataByDate = DataHandler.getData("csvDataByDate", []);
        var allDate = [], temp;
        for(var i=0; i<csvDataByDate.length; i++) {
            temp = DT.getDateObj(csvDataByDate[i].date);
            if (temp !== null) {
                temp = DT.formateDateTime("YYYY/-/MM/-/DD", "/", temp);
                if (allDate.indexOf(temp) < 0) {
                    allDate.push(temp);
                }
            }
        }
        var combinedDateSelectionParameter = this._generateDateSelectionParameter(allDate);
        DataHandler.setData("combinedDateSelectionParameter", combinedDateSelectionParameter);
        var selectedDateType = DataHandler.getData("selectedDateType", "");
        if (combinedDateSelectionParameter[selectedDateType]) {
            var selectedDateParameter = combinedDateSelectionParameter[selectedDateType];
            DataHandler.setData("selectedDateParameter", selectedDateParameter);
        } else {
            DataHandler.setData("selectedDateParameter", []);
        }
        return null;
    },
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
            var selectedDateType = DataHandler.getDefaultDateSelectionType(currentSectionId);
            var dateSelection = DataHandler.getDateSelection();
            var dropdownFields = DataHandler.getDropdownFields();
            DataHandler.setData("currentSectionId", currentSectionId);
            DataHandler.setData("selectedDateType", selectedDateType);
            DataHandler.setData("dateSelection", dateSelection);
            DataHandler.setData("dropdownFields", dropdownFields);
            DataHandler.appControlDataLoadCallback(appStateCallback, appDataCallback);
        }, null, Api.getAjaxApiCallMethod());
    },
    PageComponentDidMount: function(appStateCallback, appDataCallback) {
        var csvDataApis = DataHandler.getCsvDataApis();
        var csvDataLoadStatus = DataHandler.getData("csvDataLoadStatus", "");
        if (csvDataApis.length && csvDataLoadStatus === "not-started") {
            DataHandler.setData("csvDataLoadStatus", "in-progress");
            appStateCallback();
            $S.loadJsonData(null, csvDataApis, function(response, apiName, ajax){
                var csvData = DataHandler.getData("csvData", []);
                csvData.push(response);
                DataHandler.setData("csvData", csvData);
            }, function() {
                var csvData = DataHandler.getData("csvData", []);
                csvData = DataHandler.generatePageData(csvData);
                var requiredData = DataHandler.generateValidData(csvData);
                DataHandler.setData("csvData", requiredData["finalData"]);
                DataHandler.setData("csvDataByDate", requiredData["dataByDate"]);
                DataHandler.setData("errorsData", requiredData["errorsData"]);
                DataHandler.setData("csvDataLoadStatus", "completed");

                DataHandler._setDateFilterParameters();
                DataHandler.setData("renderFieldRowDataPageName", "")
                DataHandler.setPageData(appStateCallback, appDataCallback);
                $S.log("csvData load complete");
            }, null, Api.getAjaxApiCallMethodV2());
        }
        if (csvDataLoadStatus === "completed") {
            DataHandler.setPageData(appStateCallback, appDataCallback);
        }
    },
    OnSectionChange: function(appStateCallback, appDataCallback, sectionId) {
        DataHandler.setData("currentSectionId", sectionId);
        appDataCallback("section", sectionId);
        appDataCallback("sectionName", DataHandler.getSectionName());
        DataHandler.setData("csvDataLoadStatus", "not-started");
        DataHandler.PageComponentDidMount(appStateCallback, appDataCallback);
    },
    OnDateSelection: function(appStateCallback, appDataCallback, selectedDateType) {
        DataHandler.setData("selectedDateType", selectedDateType);
        appDataCallback("selectedDateType", DataHandler.getData("selectedDateType", ""));
        var combinedDateSelectionParameter = DataHandler.getData("combinedDateSelectionParameter", {});
        if (combinedDateSelectionParameter[selectedDateType]) {
            var selectedDateParameter = combinedDateSelectionParameter[selectedDateType];
            DataHandler.setData("selectedDateParameter", selectedDateParameter);
        } else {
            DataHandler.setData("selectedDateParameter", null);
        }
        DataHandler.setData("renderFieldRowDataPageName", "")
        DataHandler.setPageData(appStateCallback, appDataCallback);
        appStateCallback();
    },
    GetTabDisplayText: function(pageName) {
        var tabDisplayText = pageName;
        var dropdownFields = DataHandler.getData("dropdownFields", []);
        if ($S.isArray(dropdownFields)) {
            for (var i = 0; i < dropdownFields.length; i++) {
                if (dropdownFields[i].name === pageName) {
                    tabDisplayText = dropdownFields[i].linkText;
                }
            }
        }
        return tabDisplayText;
    }
});

DataHandler.extend({
    appControlDataLoadCallback: function(appStateCallback, appDataCallback) {
        $S.log("appControlData load complete");
        appDataCallback("section", DataHandler.getData("currentSectionId", ""));
        appDataCallback("sectionName", DataHandler.getSectionName());
        appDataCallback("availableSection", DataHandler.getAvailableSection());
        appDataCallback("homeFields", DataHandler.getHomeFields());
        appDataCallback("dropdownFields", DataHandler.getData("dropdownFields", []));
        appDataCallback("selectedDateType", DataHandler.getData("selectedDateType", ""));
        appDataCallback("dateSelection", DataHandler.getData("dateSelection", []));
        appStateCallback();
    }
});

DataHandler.extend({
    getPageRenderData: function(pageName) {
        var csvDataByDate, selectedDateParameter;
        var startDate, endDate, fieldDate;
        if (["entrybydate"].indexOf(pageName) >= 0) {
            csvDataByDate = DataHandler.getData("csvDataByDate", []);
            selectedDateParameter = DataHandler.getData("selectedDateParameter", []);
            for (var i = 0; i < csvDataByDate.length; i++) {
                fieldDate = DT.getDateObj(csvDataByDate[i].date);
                for (var j = 0; j < selectedDateParameter.length; j++) {
                    startDate = DT.getDateObj(selectedDateParameter[j].dateRange[0]);
                    endDate = DT.getDateObj(selectedDateParameter[j].dateRange[1]);
                    if (startDate === null || endDate === null || fieldDate === null) {
                        continue;
                    }
                    if (startDate.getTime() <= fieldDate.getTime() && endDate.getTime() >= fieldDate.getTime()) {
                        if (!$S.isArray(selectedDateParameter[j].items)) {
                            selectedDateParameter[j].items = [];
                        }
                        selectedDateParameter[j].items = selectedDateParameter[j].items.concat(csvDataByDate[i].items);
                    }
                }
            }
        }
        return selectedDateParameter;
    },
    getPageRenderField: function(pageName) {
        var renderField = [];
        if (TemplateHandler[pageName]) {
            renderField = TemplateHandler[pageName](pageName);
        } else {
            renderField = TemplateHandler.getPageRenderField(pageName);
        }
        return renderField;
    },
    setPageData: function(appStateCallback, appDataCallback) {
        var currentPageName = DataHandler.getData("currentPageName", "");
        var renderFieldRowDataPageName = DataHandler.getData("renderFieldRowDataPageName", "");
        if (currentPageName !== renderFieldRowDataPageName) {
            renderFieldRowDataPageName = currentPageName;
            var renderData = DataHandler.getPageRenderData(currentPageName);
            DataHandler.setData("renderData", renderData);
            var renderFieldRow = DataHandler.getPageRenderField(currentPageName);
            DataHandler.setData("renderFieldRowDataPageName", currentPageName);
            appDataCallback("pageName", currentPageName);
            appDataCallback("pageHeading", DataHandler.getPageHeadingV2(currentPageName));
            appDataCallback("renderFieldRow", renderFieldRow);
            appDataCallback("errorsData", DataHandler.getData("errorsData", []));
            appStateCallback();
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
    _isValidDateStr: function(dateStr) {
        var p1Formate = "YYYY/-/MM/-/DD";
        var p2Formate = "YYYY/-/MM/-/DD/ /hh/:/mm";
        //2020-05-31
        var p1 = /[1-9]{1}[0-9]{3}-[0-1][0-9]-[0-3][0-9]/i;
        //2020-05-31 00:00
        var p2 = /[1-9]{1}[0-9]{3}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]/i;
        var dateObj;
        if ($S.isString(dateStr) && (dateStr.length === 16 || dateStr.length === 10)) {
            dateObj = DT.getDateObj(dateStr);
            if (dateObj !== null) {
                if (dateStr.search(p2) >= 0 && dateStr === DT.formateDateTime(p2Formate, "/", dateObj)) {
                    return true;
                } else if (dateStr.search(p1) >= 0 && dateStr === DT.formateDateTime(p1Formate, "/", dateObj)) {
                    return true;
                }
            }
        }
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
        var dataByDate = {};
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
                                if (!DataHandler._isValidDateStr(jsonData[i][j][0])) {
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
                                    temp["displayType"] = DataHandler.getDisplayType(jsonData[i][j][1]);
                                    temp["station"] = jsonData[i][j][2];
                                    temp["displayStation"] = DataHandler.getDisplayStation(jsonData[i][j][2]);
                                    temp["device"] = jsonData[i][j][3];
                                    temp["displayDevice"] = DataHandler.getDisplayDevice(jsonData[i][j][3]);
                                    if (jsonData[i][j].length >= 5) {
                                        temp["description"] = jsonData[i][j][4];
                                    }
                                    if (!$S.isArray(dataByDate[temp["date"]])) {
                                        dataByDate[temp["date"]] = [];
                                    }
                                    finalData.push(temp);
                                    dataByDate[temp["date"]].push(temp);
                                }
                            } else {
                                errorsData.push({"reason": "Invalid entry", "data": jsonData[i][j].join()});
                            }
                        }
                    }
                }
            }
        }
        var dataByDateSorted = [];
        var BST = $S.getBST();
        var dateObj, node;
        for (var date in dataByDate) {
            dateObj = DT.getDateObj(date);
            if (dateObj) {
                node = BST.insertData(BST, dateObj.getTime());
                node.date = date;
                node.item = dataByDate[date];
            }
        }
        temp = BST.getInOrder(BST);
        for (i=0; i<temp.length; i++) {
            dataByDateSorted.push({date: temp[i].date, items:temp[i].item});
        }
        return {errorsData: errorsData, finalData: finalData, dataByDate: dataByDateSorted};
    }
});

})($S);

export default DataHandler;
