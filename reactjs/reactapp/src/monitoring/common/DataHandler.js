import $S from "../../interface/stack.js";
import Config from "./Config";
import TemplateHandler from "./TemplateHandler";

import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";

var DataHandler;

(function($S){
var DT = $S.getDT();

var CurrentData = $S.getDataObj();
var keys = [];
keys.push("currentPageName");
keys.push("availableDataPageName");
keys.push("dropdownFields");

keys.push("appControlDataLoadStatus");
keys.push("metaDataLoadStatus");
keys.push("csvDataLoadStatus");
keys.push("firstTimeDataLoadStatus");

keys.push("csvData");
keys.push("csvDataByDate");
keys.push("errorsData");

keys.push("renderData");
keys.push("renderFieldRow");

keys.push("selectedDateType");
keys.push("selectedDateParameter");
keys.push("combinedDateSelectionParameter");


keys.push("appControlData");
keys.push("metaData");
keys.push("sectionsData");
keys.push("currentSectionId");
keys.push("sectionName");
keys.push("currentSectionData");
keys.push("errorsData");

keys.push("homeFields");
keys.push("dropdownFields");

keys.push("metaDataStatus");


CurrentData.setKeys(keys);
CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("metaDataLoadStatus", "not-started");
CurrentData.setData("csvDataLoadStatus", "not-started");

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
    getDataLoadStatus: function() {
        var dataLoadStatus = [];
        dataLoadStatus.push(DataHandler.getData("appControlDataLoadStatus", ""));
        dataLoadStatus.push(DataHandler.getData("metaDataLoadStatus", ""));
        dataLoadStatus.push(DataHandler.getData("csvDataLoadStatus", ""));
        for (var i = 0; i < dataLoadStatus.length; i++) {
            if (dataLoadStatus[i] !== "completed") {
                return "";
            }
        }
        DataHandler.setData("firstTimeDataLoadStatus", "completed");
        return "completed";
    }
});

DataHandler.extend({
    setData: function(key, value) {
        return CurrentData.setData(key, value);
    },
    getData: function(key, defaultValue) {
        return CurrentData.getData(key, defaultValue);
    },
    addDataInArray: function(key, value) {
        var arrayData = this.getData(key, []);
        if ($S.isArray(arrayData)) {
            arrayData.push(value);
            this.setData(key, arrayData);
        }
    },
    initData: function() {
        var defaultData, allData = CurrentData.getAllData();
        for (var i = 0; i < keys.length; i++) {
            if (["appControlData", "metaData", "sectionsData",
                "currentSectionId", "currentPageName", "selectedDateType",
                "appControlDataLoadStatus", "metaDataLoadStatus", "csvDataLoadStatus", "firstTimeDataLoadStatus",
                "homeFields", "dropdownFields", "metaDataStatus"].indexOf(keys[i]) >= 0) {
                continue;
            }
            defaultData = [];
            if ($S.isObject(allData[keys[i]])) {
                defaultData = {};
            }
            CurrentData.setData(keys[i], defaultData);
        }
    },
    getPageUrl: function(pageName) {
        return window.location.pathname;
    },
    send: function(trackingAction, eventCategory, eventLabel) {
        if (Config.gtag) {
            $S.pushGAEvent(Config.gtag, trackingAction, eventCategory, eventLabel);
        }
    },
    TrackPageView: function(pageName) {
        if (!$S.isString(pageName) || pageName.length < 1) {
            pageName = "empty-pageName";
        }
        DataHandler.send("pageView", pageName, DataHandler.getPageUrl());
    },
    TrackSectionView: function(trackingAction, sectionId) {
        if (!$S.isString(sectionId) || sectionId.length < 1) {
            sectionId = "empty-sectionId";
        }
        DataHandler.send("sectionView", sectionId+":"+trackingAction, DataHandler.getPageUrl());
    },
    TrackDateSelection: function(selectedDateType) {
        if (!$S.isString(selectedDateType) || selectedDateType.length < 1) {
            selectedDateType = "empty-selectedDateType";
        }
        var currentSectionId = DataHandler.getData("currentSectionId", "");
        if (!$S.isString(currentSectionId) || currentSectionId.length < 1) {
            currentSectionId = "empty-currentSectionId";
        }
        DataHandler.send("dateSelection", currentSectionId+":"+selectedDateType, DataHandler.getPageUrl());
    }
});

DataHandler.extend({
    getAvailableSection: function() {
        var appControlData = DataHandler.getData("appControlData", {});
        var availableSection = [];
        if ($S.isArray(appControlData.sections) && appControlData.sections.length > 0) {
            availableSection = appControlData.sections;
        }
        return availableSection;
    },
    getDefaultSectionId: function() {
        var appControlData = DataHandler.getData("appControlData", {});
        var sectionId = "";
        if ($S.isObject(appControlData) && $S.isArray(appControlData.sections) && appControlData.sections.length > 0) {
            if ($S.isString(appControlData.sections[0].id) && appControlData.sections[0].id.length > 0) {
                sectionId = appControlData.sections[0].id;
            }
        }
        return sectionId;
    },
    isDisabledPage: function(pageName) {
        var currentSectionData = DataHandler.getSectionData(DataHandler.getData("currentSectionId", ""), {});
        var disabledPages = currentSectionData.disabledPages;
        if ($S.isArray(disabledPages) && $S.isString(pageName)) {
            return disabledPages.indexOf(pageName) >= 0;
        }
        return false;
    },
    getSectionData: function(sectionId) {
        var sectionsData = DataHandler.getData("sectionsData", []);
        var sectionData = {};
        if ($S.isString(sectionId) && sectionId.length > 0) {
            if ($S.isArray(sectionsData)) {
                for (var i = 0; i< sectionsData.length; i++) {
                    if (sectionId === sectionsData[i].id) {
                        sectionData = sectionsData[i];
                        break;
                    }
                }
            }
        }
        return sectionData;
    },
    getSectionName: function() {
        var sectionId = DataHandler.getData("currentSectionId", "");
        var section = DataHandler.getSectionData(sectionId);
        if ($S.isObject(section) && $S.isString(section.name)) {
            return section.name;
        }
        return sectionId;
    },
    getDisableFooterStatus: function() {
        var sectionId = DataHandler.getData("currentSectionId", "");
        var section = DataHandler.getSectionData(sectionId);
        if ($S.isObject(section) && $S.isBoolean(section.disableFooter)) {
            return section.disableFooter;
        }
        return true;
    },
    getDefaultDateSelectionType: function() {
        var appControlData = DataHandler.getData("appControlData", {});
        var defaultDateSelectionType = "";
        if ($S.isObject(appControlData) && $S.isArray(appControlData.sections) && appControlData.sections.length > 0) {
            if ($S.isString(appControlData.sections[0].defaultDateSelectionType) && appControlData.sections[0].defaultDateSelectionType.length > 0) {
                defaultDateSelectionType = appControlData.sections[0].defaultDateSelectionType;
            }
        }
        return defaultDateSelectionType;
    },
    getMetaDataDropdownFields: function() {
        var metaData = DataHandler.getData("metaData", {});
        var dropdownFields = [];
        if ($S.isObject(metaData) && $S.isArray(metaData.dropdownFields)) {
            for (var i = 0; i < metaData.dropdownFields.length; i++) {
                metaData.dropdownFields[i].toUrl = Config.pages[metaData.dropdownFields[i].name];
                if (!this.isDisabledPage(metaData.dropdownFields[i].name)) {
                    dropdownFields.push(metaData.dropdownFields[i]);
                }
            }
        }
        if (dropdownFields.length < 1) {
            dropdownFields = $S.isArray(Config.defaultPageFields) ? Config.defaultPageFields : [];
        }
        return dropdownFields;
    },
    getMetaDataHomeFields: function() {
        var metaData = DataHandler.getData("metaData", {});
        var homeFields = [];
        if ($S.isObject(metaData) && $S.isArray(metaData.homeFields)) {
            for (var i = 0; i < metaData.homeFields.length; i++) {
                metaData.homeFields[i].toUrl = Config.pages[metaData.homeFields[i].name];
                if (!this.isDisabledPage(metaData.homeFields[i].name)) {
                    homeFields.push(metaData.homeFields[i]);
                }
            }
        }
        if (homeFields.length < 1) {
            homeFields = $S.isArray(Config.defaultPageFields) ? Config.defaultPageFields : [];
        }
        return homeFields;
    },
    getMetaDataPageHeading: function(pageName) {
        var pageHeading = "Page Not Found";
        if (this.isDisabledPage(pageName)) {
            return pageHeading;
        }
        if ($S.isString(Config.pages[pageName]) && Config.pages[pageName].length > 0) {
            pageHeading = $S.capitalize(pageName.trim());
        }
        var dropdownFields = DataHandler.getData("dropdownFields", []);
        for (var i = 0; i < dropdownFields.length; i++) {
            if (dropdownFields[i].name === pageName) {
                pageHeading = dropdownFields[i].toText;
                break;
            }
        }
        return pageHeading;
    },
    getMetaDataPageHeadingV2: function() {
        return DataHandler.getMetaDataPageHeading(DataHandler.getData("currentPageName", ""));
    },
    getmetaDataApis: function() {
        var requestId = $S.getUniqueNumber();
        var sectionData = DataHandler.getData("currentSectionData", "");
        var metaDataApis = [];
        if (sectionData && $S.isArray(sectionData["metaDataApis"])) {
            metaDataApis = sectionData["metaDataApis"].map(function(el, i, arr) {
                return Config.baseapi + el + "?v=" + requestId;
            });
        }
        return metaDataApis;
    },
    getCsvDataApis: function() {
        var requestId = $S.getUniqueNumber();
        var sectionData = DataHandler.getData("currentSectionData", "");
        var csvDataApis = [];
        if (sectionData && $S.isArray(sectionData["csvDataApis"])) {
            csvDataApis = sectionData["csvDataApis"].map(function(el, i, arr) {
                return Config.baseapi + el + "?v=" + requestId;
            });
        }
        return csvDataApis;
    },
    _getValidationData: function(key) {
        var metaData = DataHandler.getData("metaData", {});
        var validationData = [];
        if ($S.isString(key) && $S.isArray(metaData[key])) {
            var tempValidationData = metaData[key].map(function(el) {
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
        var metaData = DataHandler.getData("metaData", {});
        var displayName = id, temp;
        if ($S.isString(key) && $S.isArray(metaData[key])) {
            for (var i = 0; i < metaData[key].length; i++) {
                if (metaData[key][i]["id"] === id) {
                    temp = metaData[key][i]["name"];
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
        var combinedDateSelectionParameter = AppHandler.generateDateSelectionParameter(allDate);
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
    _fireSectionChange: function(appStateCallback, appDataCallback) {
        var currentSectionData = DataHandler.getSectionData(DataHandler.getData("currentSectionId", ""));
        DataHandler.setData("currentSectionData", currentSectionData);
        DataHandler.setData("sectionName", DataHandler.getSectionName());
        DataHandler.loadMetaData(appStateCallback, appDataCallback);
        DataHandler.loadCsvData(appStateCallback, appDataCallback);
        DataHandler.setPageData(appStateCallback, appDataCallback, "_fireSectionChange");
    },
    AppDidMount: function(appStateCallback, appDataCallback) {
        DataHandler.setData("appControlDataLoadStatus", "in-progress");
        $S.loadJsonData(null, Config.appControlApi, function(response, apiName, ajax){
            if ($S.isObject(response)) {
                DataHandler.setData("appControlData", response);
            } else {
                DataHandler.addDataInArray("errorsData", {"text": ajax.url, "href": ajax.url});
            }
        }, function() {
            $S.log("appControlData load complete");
            DataHandler.setData("appControlDataLoadStatus", "completed");
            DataHandler.setData("sectionsData", DataHandler.getAvailableSection());
            DataHandler.setData("selectedDateType", DataHandler.getDefaultDateSelectionType());
            DataHandler.setData("currentSectionId", DataHandler.getDefaultSectionId());
            DataHandler.TrackSectionView("loadingPage", DataHandler.getData("currentSectionId", ""));
            DataHandler.TrackPageView(DataHandler.getData("currentPageName", ""));
            DataHandler._fireSectionChange(appStateCallback, appDataCallback);
        }, null, Api.getAjaxApiCallMethod());
    },
    PageComponentDidMount: function(appStateCallback, appDataCallback, currentPageName) {
        DataHandler.setData("currentPageName", currentPageName);
        DataHandler.loadMetaData(appStateCallback, appDataCallback);
        DataHandler.loadCsvData(appStateCallback, appDataCallback);
        DataHandler.setPageData(appStateCallback, appDataCallback, "PageComponentDidMount");
    },
    OnSectionChange: function(appStateCallback, appDataCallback, currentSectionId) {
        DataHandler.initData();
        DataHandler.setData("currentSectionId", currentSectionId);
        DataHandler.setData("metaDataLoadStatus", "not-started");
        DataHandler.setData("csvDataLoadStatus", "not-started");
        DataHandler.setData("availableDataPageName", "");
        DataHandler._fireSectionChange(appStateCallback, appDataCallback);
    },
    OnDateSelection: function(appStateCallback, appDataCallback, selectedDateType) {
        DataHandler.setData("selectedDateType", selectedDateType);
        var combinedDateSelectionParameter = DataHandler.getData("combinedDateSelectionParameter", {});
        if (combinedDateSelectionParameter[selectedDateType]) {
            var selectedDateParameter = combinedDateSelectionParameter[selectedDateType];
            DataHandler.setData("selectedDateParameter", selectedDateParameter);
        } else {
            DataHandler.setData("selectedDateParameter", null);
        }
        DataHandler.setData("availableDataPageName", "");
        DataHandler.setPageData(appStateCallback, appDataCallback, "OnDateSelection");
    },
    GetTabDisplayText: function(pageName) {
        return DataHandler.getMetaDataPageHeading(pageName);
    }
});

DataHandler.extend({
    loadMetaData: function(appStateCallback, appDataCallback) {
        var metaDataApis = DataHandler.getmetaDataApis();
        var metaDataLoadStatus = DataHandler.getData("metaDataLoadStatus", "");
        var appControlDataLoadStatus = DataHandler.getData("appControlDataLoadStatus", "");
        if (metaDataApis.length) {
            if (metaDataLoadStatus === "not-started") {
                DataHandler.setData("metaDataLoadStatus", "in-progress");
                $S.loadJsonData(null, metaDataApis, function(response, apiName, ajax){
                    if ($S.isObject(response)) {
                        DataHandler.setData("metaData", response);
                    } else {
                        DataHandler.setData("metaDataStatus", "invalid");
                        DataHandler.setData("metaData", {});
                        DataHandler.addDataInArray("errorsData", {"text": ajax.url, "href": ajax.url});
                    }
                }, function() {
                    $S.log("metaData load complete");
                    DataHandler.setData("metaDataLoadStatus", "completed");
                    DataHandler.setData("homeFields", DataHandler.getMetaDataHomeFields());
                    DataHandler.setData("dropdownFields", DataHandler.getMetaDataDropdownFields());
                    DataHandler.setPageData(appStateCallback, appDataCallback, "loadMetaData1");
                }, null, Api.getAjaxApiCallMethod());
            }
        } else if(metaDataLoadStatus === "not-started" && appControlDataLoadStatus === "completed") {
            DataHandler.setData("metaDataLoadStatus", "completed");
            DataHandler.setPageData(appStateCallback, appDataCallback, "loadMetaData2");
        }
    },
    loadCsvData: function(appStateCallback, appDataCallback) {
        var csvDataApis = DataHandler.getCsvDataApis();
        var csvDataLoadStatus = DataHandler.getData("csvDataLoadStatus", "");
        var appControlDataLoadStatus = DataHandler.getData("appControlDataLoadStatus", "");
        if (csvDataApis.length) {
            if (csvDataLoadStatus === "not-started") {
                DataHandler.setData("csvDataLoadStatus", "in-progress");
                var csvData = [];
                $S.loadJsonData(null, csvDataApis, function(response, apiName, ajax){
                    if (response) {
                        csvData.push(response);
                    } else {
                        DataHandler.addDataInArray("errorsData", {"text": ajax.url, "href": ajax.url});
                    }
                }, function() {
                    $S.log("csvData load complete");
                    DataHandler.setData("csvDataLoadStatus", "completed");
                    csvData = DataHandler.generatePageData(csvData);
                    var requiredData = DataHandler.generateValidData(csvData);
                    DataHandler.setData("csvData", requiredData["finalData"]);
                    DataHandler.setData("csvDataByDate", requiredData["dataByDate"]);
                    DataHandler.setData("errorsData", requiredData["errorsData"]);
                    DataHandler.setData("renderFieldRow", []);
                    DataHandler._setDateFilterParameters();
                    DataHandler.setPageData(appStateCallback, appDataCallback, "loadCsvData1");
                }, null, Api.getAjaxApiCallMethodV2());
            }
        } else if(csvDataLoadStatus === "not-started" && appControlDataLoadStatus === "completed") {
            DataHandler.setData("csvDataLoadStatus", "completed");
            DataHandler.setPageData(appStateCallback, appDataCallback, "loadCsvData2");
        }
    }
});

DataHandler.extend({
    generateDataBySelection: function(attr) {
        var entryByTypeData = [];
        var csvDataByDate = DataHandler.getData("csvDataByDate", []);
        var selectedDateParameter = DataHandler.getData("selectedDateParameter", []);
        var availableDataByType = [], temp, isFound, i, j, k, l, dateRange;
        var selectionType;
        if (!$S.isString(attr) || attr.length < 1) {
            return entryByTypeData;
        }
        for (i = 0; i < csvDataByDate.length; i++) {
            if (csvDataByDate[i] && $S.isArray(csvDataByDate[i].items)) {
                for (j = 0; j < csvDataByDate[i].items.length; j++) {
                    selectionType = csvDataByDate[i].items[j][attr];
                    if ($S.isString(selectionType) && availableDataByType.indexOf(selectionType) < 0) {
                        availableDataByType.push(selectionType);
                        temp = {"fieldName": selectionType, "fieldNameDisplay": csvDataByDate[i].items[j][attr+"Display"], "data": []};
                        entryByTypeData.push(temp);
                    } else {
                        for(k=0; k<entryByTypeData.length; k++) {
                            if (entryByTypeData[k].fieldName === selectionType) {
                                temp = entryByTypeData[k];
                                break;
                            }
                        }
                    }
                    for(k=0; k<selectedDateParameter.length; k++) {
                        dateRange = selectedDateParameter[k].dateRange;
                        if (AppHandler.isDateLiesInRange(dateRange[0], dateRange[1], csvDataByDate[i].items[j].date)) {
                            isFound = false;
                            for(l=0; l<temp.data.length; l++) {
                                if (temp.data[l].dateHeading === selectedDateParameter[k].dateHeading) {
                                    isFound = true;
                                    break;
                                }
                            }
                            if (isFound) {
                                temp.data[l]["items"].push(csvDataByDate[i].items[j]);
                            } else {
                                temp.data.push({"dateHeading": selectedDateParameter[k].dateHeading, "items": [csvDataByDate[i].items[j]]});
                            }
                        }
                    }
                }
            }
        }
        return entryByTypeData;
    },
    getPageRenderData: function(pageName) {
        var csvDataByDate, dateRange;
        var fieldDate, i, j;
        var selectedDateParameter = DataHandler.getData("selectedDateParameter", []);
        if (["entrybydate"].indexOf(pageName) >= 0) {
            csvDataByDate = DataHandler.getData("csvDataByDate", []);
            for (i = 0; i < csvDataByDate.length; i++) {
                fieldDate = csvDataByDate[i].date;
                for (j = 0; j < selectedDateParameter.length; j++) {
                    dateRange = selectedDateParameter[j].dateRange;
                    if (AppHandler.isDateLiesInRange(dateRange[0], dateRange[1], fieldDate)) {
                        if (!$S.isArray(selectedDateParameter[j].items)) {
                            selectedDateParameter[j].items = [];
                        }
                        selectedDateParameter[j].items = selectedDateParameter[j].items.concat(csvDataByDate[i].items);
                    }
                }
            }
        }
        if (["entrybytype", "entrybystation", "entrybydevice"].indexOf(pageName) >= 0) {
            var mapping = {"entrybytype": "type", "entrybystation": "station", "entrybydevice": "device"};
            return DataHandler.generateDataBySelection(mapping[pageName]);
        }
        return selectedDateParameter;
    },
    getPageRenderField: function(pageName) {
        var renderField = [];
        if (DataHandler.isDisabledPage(pageName)) {
            return TemplateHandler.getPageRenderField("noDataFound");
        }
        if (TemplateHandler[pageName]) {
            renderField = TemplateHandler[pageName](pageName);
        } else {
            renderField = TemplateHandler.getPageRenderField(pageName);
        }
        return renderField;
    },
    setPageData: function(appStateCallback, appDataCallback, name) {
        $S.log("setPageData:"+name);
        var currentPageName = DataHandler.getData("currentPageName", "");
        var availableDataPageName = DataHandler.getData("availableDataPageName", "");
        var dataLoadStatus = DataHandler.getDataLoadStatus();
        if (dataLoadStatus === "completed" && currentPageName !== availableDataPageName) {
            var goBackLinkData = Config.goBackLinkData;
            var sectionsData = DataHandler.getData("sectionsData", []);
            if (currentPageName === "home") {
                goBackLinkData = [];
                sectionsData = [];
            }
            var renderData = DataHandler.getPageRenderData(currentPageName);
            DataHandler.setData("renderData", renderData);
            var renderFieldRow = DataHandler.getPageRenderField(currentPageName);
            DataHandler.setData("availableDataPageName", currentPageName);

            appDataCallback("list1Data", sectionsData);
            appDataCallback("list2Data", DataHandler.getData("dropdownFields", []));
            appDataCallback("currentList1Id", DataHandler.getData("currentSectionId", ""));
            appDataCallback("currentList2Id", currentPageName);
            appDataCallback("appHeading", DataHandler.getData("sectionName", ""));
            appDataCallback("pageHeading", DataHandler.getMetaDataPageHeadingV2());

            appDataCallback("renderFieldRow", renderFieldRow);
            appDataCallback("selectedDateType", DataHandler.getData("selectedDateType", ""));
            appDataCallback("errorsData", DataHandler.getData("errorsData", []));
            appDataCallback("firstTimeDataLoadStatus", DataHandler.getData("firstTimeDataLoadStatus", ""));

            appDataCallback("goBackLinkData", goBackLinkData);
            appDataCallback("dateSelection", Config.dateSelection);
            appDataCallback("dateSelectionRequiredPages", Config.dateSelectionRequired);
            appDataCallback("disableFooter", DataHandler.getDisableFooterStatus());

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
        var errorsData = DataHandler.getData("errorsData", []);
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
                                    temp["typeDisplay"] = DataHandler.getDisplayType(jsonData[i][j][1]);
                                    temp["station"] = jsonData[i][j][2];
                                    temp["stationDisplay"] = DataHandler.getDisplayStation(jsonData[i][j][2]);
                                    temp["device"] = jsonData[i][j][3];
                                    temp["deviceDisplay"] = DataHandler.getDisplayDevice(jsonData[i][j][3]);
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
