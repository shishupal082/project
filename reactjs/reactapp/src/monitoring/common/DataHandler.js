import $S from "../../interface/stack.js";
import $$$ from '../../interface/global';
import Config from "./Config";
import TemplateHandler from "./TemplateHandler";

import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";

var DataHandler;

(function($S){
var DT = $S.getDT();

var CurrentData = $S.getDataObj();
var keys = [];
// keys.push("currentPageName");
keys.push("availableDataPageName");
// keys.push("dropdownFields");

// keys.push("appControlDataLoadStatus");
// keys.push("metaDataLoadStatus");
// keys.push("csvDataLoadStatus");
// keys.push("firstTimeDataLoadStatus");

keys.push("csvRawData");
keys.push("csvData");
keys.push("csvDataByDate");
keys.push("filterOptions");

keys.push("renderData");
keys.push("renderFieldRow");


keys.push("relatedUsersData");
keys.push("relatedUsersDataLoadStatus");

// keys.push("selectedDateType");
keys.push("selectedDateParameter");
keys.push("combinedDateSelectionParameter");


// keys.push("appControlData");
// keys.push("metaData");
// keys.push("sectionsData");
// keys.push("currentSectionId");
keys.push("sectionName");
keys.push("currentSectionData");
keys.push("errorsData");

// keys.push("homeFields");
// keys.push("dropdownFields");


// keys.push("selectedStation");
// keys.push("selectedType");
// keys.push("selectedDevice");

var bypassKeys = ["userTeam", "appControlData", "metaData", "sectionsData",
        "currentSectionId", "currentPageName", "selectedDateType",
        "appControlDataLoadStatus", "metaDataLoadStatus", "csvDataLoadStatus", "firstTimeDataLoadStatus",
        "homeFields", "dropdownFields",
        "stationSelected", "typeSelected", "deviceSelected", "usernameSelected",
        "relatedUsersData", "relatedUsersDataLoadStatus", "loginUserDetailsLoadStatus", "usersFilesData"];

keys.push("addentry.subject");
keys.push("addentry.heading");
keys.push("addentry.textarea");
keys.push("addentry.file");
keys.push("addentry.fileUploadPercentage");
keys.push("addentry.submitStatus"); //in_progress, completed

keys = keys.concat(bypassKeys);
CurrentData.setKeys(keys);
CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("metaDataLoadStatus", "not-started");
CurrentData.setData("csvDataLoadStatus", "not-started");
CurrentData.setData("relatedUsersDataLoadStatus", "not-started");
CurrentData.setData("loginUserDetailsLoadStatus", "not-started");
CurrentData.setData("usersFilesData", []);

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
        var dataLoadStatusKey = [];
        dataLoadStatusKey.push("appControlDataLoadStatus");
        dataLoadStatusKey.push("metaDataLoadStatus");
        dataLoadStatusKey.push("csvDataLoadStatus");
        dataLoadStatusKey.push("loginUserDetailsLoadStatus");
        dataLoadStatusKey.push("relatedUsersDataLoadStatus");
        if(DataHandler.getDataLoadStatusByKey(dataLoadStatusKey) !== "completed") {
            return "";
        }
        var firstTimeDataLoadStatus = DataHandler.getData("firstTimeDataLoadStatus", "");
        if (firstTimeDataLoadStatus !== "completed") {
            setTimeout(function(){
                DataHandler.setUserTeam();
            }, 1);
        }
        DataHandler.setData("firstTimeDataLoadStatus", "completed");
        return "completed";
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
    }
});

DataHandler.extend({
    setData: function(key, value, isDirect) {
        return CurrentData.setData(key, value, isDirect);
    },
    getData: function(key, defaultValue, isDirect) {
        return CurrentData.getData(key, defaultValue, isDirect);
    },
    handleInputChange: function(e) {
        var currentTarget = e.currentTarget;
        var fieldName = currentTarget.name;
        if (fieldName === "addentry.file") {
            var file = currentTarget.files[0];
            this.setData(fieldName, file, true);
        } else {
            this.setData(fieldName, currentTarget.value.trim());
        }
    },
    addDataInArray: function(key, value) {
        var arrayData = this.getData(key, []);
        if ($S.isArray(arrayData)) {
            arrayData.push(value);
            this.setData(key, arrayData);
        }
    },
    initData: function() {
        CurrentData.initData(bypassKeys);
    },
    getPageUrl: function(pageName) {
        return window.location.pathname;
    },
    send: function(trackingAction, eventCategory, eventLabel) {
        if (Config.gtag) {
            $S.pushGAEvent(Config.gtag, eventCategory, trackingAction, eventLabel);
        }
    },
    _getTrackUsername: function() {
        var username = AppHandler.GetUserData("username", "");
        if (!$S.isString(username) || username.length < 1) {
            username = "empty-username";
        }
        return username;
    },
    getNavigatorData: function(key) {
        var result = key;
        try {
            var uiNavigator = $$$.navigator;
            if ($S.isString(uiNavigator[key])) {
                result = uiNavigator[key];
            }
        } catch(err) {
            result = "error in " + key;
        }
        return result;
    },
    getUserAgentTrackingData: function() {
        var trackingData = [];
        var trackingKey = ["platform","appVersion","appCodeName","appName"];
        for(var i=0; i<trackingKey.length; i++) {
            trackingData.push(this.getNavigatorData(trackingKey[i]));
        }
        return trackingData.join(",");
    },
    TrackApiRequest: function(requestName, requestStatus) {
        var username = this._getTrackUsername();
        DataHandler.send(username, requestName+":"+requestStatus, DataHandler.getPageUrl());
    },
    TrackFilterOperation: function(eventName, value, name) {
        if (!$S.isString(eventName) || eventName.length < 1) {
            eventName = "empty-eventName";
        }
        var filterData = ":";
        var firstValue = DataHandler.getData("stationSelected", "");
        var secondValue = DataHandler.getData("typeSelected", "");
        var thirdValue = DataHandler.getData("deviceSelected", "");
        var fouthValue = DataHandler.getData("usernameSelected", "");
        if (eventName === "select") {
            switch(name) {
                case "stationSelected":
                    firstValue = value;
                break;
                case "typeSelected":
                    secondValue = value;
                break;
                case "deviceSelected":
                    thirdValue = value;
                break;
                case "usernameSelected":
                    thirdValue = value;
                break;
                default:
                break;
            }
            filterData += "1-"+firstValue;
            filterData += "-2-"+secondValue;
            filterData += "-3-"+thirdValue;
            filterData += "-4-"+fouthValue;
        } else {
            filterData += "reset";
        }
        var username = this._getTrackUsername();
        DataHandler.send(username, "filter:"+eventName+filterData, DataHandler.getPageUrl());
    },
    TrackPageView: function(pageName) {
        if (!$S.isString(pageName) || pageName.length < 1) {
            pageName = "empty-pageName";
        }
        var username = this._getTrackUsername();
        DataHandler.send(username, "pageView:"+pageName, DataHandler.getPageUrl());
    },
    TrackDebug: function(content) {
        if (!$S.isString(content) || content.length < 1) {
            content = "empty-content";
        }
        var username = this._getTrackUsername();
        DataHandler.send(username, "Debug:"+content, DataHandler.getUserAgentTrackingData());
    },
    TrackSectionView: function(trackingAction, sectionId) {
        if (!$S.isString(sectionId) || sectionId.length < 1) {
            sectionId = "empty-sectionId";
        }
        var username = this._getTrackUsername();
        DataHandler.send(username, "sectionView:"+sectionId+":"+trackingAction, DataHandler.getPageUrl());
    },
    TrackDateSelection: function(selectedDateType) {
        if (!$S.isString(selectedDateType) || selectedDateType.length < 1) {
            selectedDateType = "empty-selectedDateType";
        }
        var currentSectionId = DataHandler.getData("currentSectionId", "");
        if (!$S.isString(currentSectionId) || currentSectionId.length < 1) {
            currentSectionId = "empty-currentSectionId";
        }
        var pageName = DataHandler.getData("currentPageName", "");
        if (!$S.isString(pageName) || pageName.length < 1) {
            pageName = "empty-pageName";
        }
        var username = this._getTrackUsername();
        DataHandler.send(username, "dateSelection:"+currentSectionId+":"+pageName+":"+selectedDateType, DataHandler.getPageUrl());
    }
});

DataHandler.extend({
    setUserTeam: function() {
        var metaData = DataHandler.getData("metaData", {});
        var team = "info", isValidTeam;
        var userTeamMapping;
        if ($S.isObject(metaData) && $S.isArray(metaData["monitoring-types"])) {
            userTeamMapping = metaData["monitoring-types"];
            for (var i = 0; i<userTeamMapping.length; i++) {
                if ($S.isString(userTeamMapping[i].key)) {
                    isValidTeam = AppHandler.GetUserData(userTeamMapping[i].key, false);
                    if (isValidTeam && $S.isString(userTeamMapping[i].id)) {
                        team = userTeamMapping[i].id;
                    }
                }
            }
        }
        this.setData("userTeam", team);
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
        var currentPageName = DataHandler.getData("currentPageName", "");
        var sectionId = DataHandler.getData("currentSectionId", "");
        var section = DataHandler.getSectionData(sectionId);
        if (["addentry", "uploadfile"].indexOf(currentPageName) >= 0) {
            return true;
        }
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
        // var pageHeading = DataHandler.getMetaDataPageHeading(DataHandler.getData("currentPageName", ""));
        return "";
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
    _getName: function(item) {
        if ($S.isObject(item)) {
            if ($S.isString(item.name) && item.name.length > 0) {
                return item.name;
            }
            if ($S.isString(item.id) && item.id.length > 0) {
                return item.id;
            }
        }
        return null;
    },
    _getAvailableData: function(key) {
        var metaData = DataHandler.getData("metaData", {});
        var availableData = [], tempAvailableData;
        if ($S.isString(key) && $S.isArray(metaData[key])) {
            tempAvailableData = metaData[key].map(function(el) {
                var id = el ? el.id : null;
                var name = DataHandler._getName(el);
                return {"id": id, "name": name};
            });
            availableData = tempAvailableData.filter(function(el, i, arr) {
                if ($S.isObject(el) && $S.isString(el.id) && el.id.length > 0) {
                    return true;
                }
                return false;
            });
        }
        return availableData;
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
        var displayName = id;
        if ($S.isString(key) && $S.isArray(metaData[key])) {
            for (var i = 0; i < metaData[key].length; i++) {
                if (metaData[key][i]["id"] === id) {
                    displayName = DataHandler._getName(metaData[key][i]);
                    break;
                }
            }
        }
        return displayName;
    },
    getValidUsers: function() {
        var csvData = DataHandler.getData("csvData", []);
        var users = [];
        if ($S.isArray(csvData)) {
            for (var i = 0; i < csvData.length; i++) {
                if ($S.isString(csvData[i].username) && users.indexOf(csvData[i].username) < 0) {
                    users.push(csvData[i].username);
                }
            }
        }
        return users.sort();
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
    getValidMetaData: function(name) {
        var data = [];
        switch(name) {
            case "station":
                data = this._getAvailableData("stations");
            break;
            case "device":
                data = this._getAvailableData("devices");
            break;
            case "type":
                data = this._getAvailableData("monitoring-types");
            break;
            default:
            break;
        }
        return data;
    },
    getAvailableTypes: function() {
        return this._getAvailableData("monitoring-types");
    },
    getAvailableStation: function() {
        return this._getAvailableData("stations");
    },
    getAvailableDevice: function() {
        return this._getAvailableData("devices");
    },
    getAvailableUsers: function() {
        return this.getValidUsers().map(function(el, i, arr) {
            return {"id": el, "name": el};
        });
    },
    getDisplayUsername: function(username) {
        return username;
    },
    getDisplayType: function(id) {
        return DataHandler._getDisplayName("monitoring-types", id);
    },
    getDisplayStation: function(id) {
        return DataHandler._getDisplayName("stations", id);
    },
    getDisplayDevice: function(id) {
        return DataHandler._getDisplayName("devices", id);
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
    loadUserRelatedData: function(callback) {
        function fireCallback() {
            var loadStatus = ["loginUserDetailsLoadStatus", "relatedUsersDataLoadStatus"];
            if(DataHandler.getDataLoadStatusByKey(loadStatus) !== "completed") {
                return false;
            }
            $S.callMethod(callback);
        }
        AppHandler.LoadLoginUserDetails(Config.getApiUrl("getLoginUserDetails", null, true), function() {
            var isLogin = AppHandler.GetUserData("login", false);
            if ($S.isBooleanTrue(Config.forceLogin) && isLogin === false) {
                AppHandler.LazyRedirect(Config.getApiUrl("loginRedirectUrl", "", true), 250);
                return;
            }
            DataHandler.setData("loginUserDetailsLoadStatus", "completed");
            fireCallback();
        });
        DataHandler.setData("relatedUsersDataLoadStatus", "in-progress");
        $S.loadJsonData(null, [Config.getApiUrl("getRelatedUserDetails", null, true)], function(response, apiName, ajax){
                var data = [];
                if ($S.isObject(response) && $S.isArray(response.data)) {
                    data = response.data;
                }
                DataHandler.setData("relatedUsersData", data);
                console.log(response);
            }, function() {
                $S.log("relatedUsersData load complete");
                DataHandler.setData("relatedUsersDataLoadStatus", "completed");
                fireCallback();
            }, null, Api.getAjaxApiCallMethod());
    },
    AppDidMount: function(appStateCallback, appDataCallback) {
        DataHandler.loadUserRelatedData(function() {
            var team, temDepenedentAppControlExist;
            var validTeamAppControl = Config.validTeamAppControl;
            if ($S.isArray(validTeamAppControl)) {
                for (var i = 0; i < validTeamAppControl.length; i++) {
                    team = validTeamAppControl[i];
                    if (!$S.isString(team)) {
                        continue;
                    }
                    temDepenedentAppControlExist = AppHandler.GetUserData(team, false);
                    if (temDepenedentAppControlExist) {
                        Config.updateAppControlApi(team);
                        break;
                    }
                }
            }
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
        })
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
    OnReloadClick: function(appStateCallback, appDataCallback, currentSectionId) {
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
    // used while uploading file or add entry
    ForceReload: function(appStateCallback, appDataCallback) {
        DataHandler.setData("availableDataPageName", "");
        DataHandler.setPageData(appStateCallback, appDataCallback, "ForceReload");
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
        this.OnDropdownChange(appStateCallback, appDataCallback, name, value);
    },
    OnDropdownChange: function(appStateCallback, appDataCallback, name, value) {
        DataHandler.setData(name, value);
        DataHandler.setData("availableDataPageName", "");
        DataHandler.setPageData(appStateCallback, appDataCallback, "OnDropdownChange");
    },
    OnResetFilter: function(appStateCallback, appDataCallback) {
        var filterOptions = DataHandler.getData("filterOptions", []);
        if ($S.isArray(filterOptions)) {
            for (var i = 0; i<filterOptions.length; i++) {
                filterOptions[i].selectedValue = "";
            }
        }
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler.setData("availableDataPageName", "");
        DataHandler.setPageData(appStateCallback, appDataCallback, "OnResetFilter");
    },
    GetTabDisplayText: function(pageName) {
        return DataHandler.getMetaDataPageHeading(pageName);
    }
});

DataHandler.extend({
    _handleDataLoad: function(appStateCallback, appDataCallback) {
        var loadStatus = DataHandler.getDataLoadStatusByKey(["metaDataLoadStatus", "csvDataLoadStatus"]);
        if (loadStatus !== "completed") {
            return;
        }
        var csvRawData = DataHandler.getData("csvRawData", []);
        var csvData = DataHandler.generatePageData(csvRawData);
        var requiredData = DataHandler.generateValidData(csvData);
        var filterOptions = DataHandler.generateFilterData(requiredData["finalData"]);
        DataHandler.setData("csvData", requiredData["finalData"]);
        DataHandler.setData("csvDataByDate", requiredData["dataByDate"]);
        DataHandler.setData("errorsData", requiredData["errorsData"]);
        DataHandler.setData("renderFieldRow", []);
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler._setDateFilterParameters();
        DataHandler.setPageData(appStateCallback, appDataCallback, "_handleDataLoad");
    },
    loadMetaData: function(appStateCallback, appDataCallback) {
        var metaDataApis = DataHandler.getmetaDataApis();
        var metaDataLoadStatus = DataHandler.getData("metaDataLoadStatus", "");
        var loadStatus = DataHandler.getDataLoadStatusByKey(["appControlDataLoadStatus"]);
        if (metaDataApis.length) {
            if (metaDataLoadStatus === "not-started") {
                DataHandler.setData("metaDataLoadStatus", "in-progress");
                var finalMetaData = {};
                $S.loadJsonData(null, metaDataApis, function(response, apiName, ajax){
                    if ($S.isObject(response)) {
                        finalMetaData = Object.assign({}, finalMetaData, response);
                    } else {
                        DataHandler.addDataInArray("errorsData", {"text": ajax.url, "href": ajax.url});
                    }
                }, function() {
                    $S.log("metaData load complete");
                    DataHandler.setData("metaDataLoadStatus", "completed");
                    DataHandler.setData("metaData", finalMetaData);
                    DataHandler.setData("homeFields", DataHandler.getMetaDataHomeFields());
                    DataHandler.setData("dropdownFields", DataHandler.getMetaDataDropdownFields());
                    TemplateHandler.setEntryTableHeadingJson();
                    DataHandler._handleDataLoad(appStateCallback, appDataCallback);
                }, null, Api.getAjaxApiCallMethod());
            }
        } else if(metaDataLoadStatus === "not-started" && loadStatus === "completed") {
            DataHandler.setData("metaDataLoadStatus", "completed");
            DataHandler.setPageData(appStateCallback, appDataCallback, "loadMetaData2");
        }
    },
    loadCsvData: function(appStateCallback, appDataCallback) {
        var csvDataApis = DataHandler.getCsvDataApis();
        var csvDataLoadStatus = DataHandler.getData("csvDataLoadStatus", "");
        var loadStatus = DataHandler.getDataLoadStatusByKey(["appControlDataLoadStatus"]);
        if (csvDataApis.length) {
            if (csvDataLoadStatus === "not-started") {
                DataHandler.setData("csvDataLoadStatus", "in-progress");
                var csvData = [];
                $S.loadJsonData(null, csvDataApis, function(response, apiName, ajax){
                    if ($S.isString(response)) {
                        csvData.push(response);
                    } else {
                        DataHandler.addDataInArray("errorsData", {"text": ajax.url, "href": ajax.url});
                    }
                }, function() {
                    $S.log("csvData load complete");
                    DataHandler.setData("csvDataLoadStatus", "completed");
                    DataHandler.setData("csvRawData", csvData);
                    DataHandler._handleDataLoad(appStateCallback, appDataCallback);
                }, null, Api.getAjaxApiCallMethodV2());
            }
        } else if(csvDataLoadStatus === "not-started" && loadStatus === "completed") {
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
        var temp, i, j, k, m, dateRange;
        var availableDataByType = DataHandler.getValidMetaData(attr);
        if (!$S.isString(attr) || attr.length < 1) {
            return entryByTypeData;
        }
        if ($S.isArray(availableDataByType) && availableDataByType.length < 1) {
            return entryByTypeData;
        }
        for (m = 0; m < availableDataByType.length; m++) {
            entryByTypeData.push({"fieldName": availableDataByType[m]["id"], "fieldNameDisplay": availableDataByType[m]["name"], "data": []});
            for(k=0; k<selectedDateParameter.length; k++) {
                dateRange = selectedDateParameter[k].dateRange;
                temp = {"dateHeading": selectedDateParameter[k].dateHeading, "items": []};
                for (i = 0; i < csvDataByDate.length; i++) {
                    if (csvDataByDate[i] && $S.isArray(csvDataByDate[i].items)) {
                        for (j = 0; j < csvDataByDate[i].items.length; j++) {
                            if (availableDataByType[m]["id"] === csvDataByDate[i].items[j][attr]) {
                                if (AppHandler.isDateLiesInRange(dateRange[0], dateRange[1], csvDataByDate[i].items[j].date)) {
                                    temp.items.push(csvDataByDate[i].items[j]);
                                }
                            }
                        }
                    }
                }
                if (temp.items.length > 0) {
                    entryByTypeData[m].data.push(temp);
                }
            }
        }
        entryByTypeData = entryByTypeData.filter(function(el, i, arr) {
            if (el.data.length > 0) {
                return true;
            }
            return false;
        });
        return entryByTypeData;
    },
    generateEntryByDateData: function(csvDataByDate) {
        if (!$S.isArray(csvDataByDate) || csvDataByDate.length < 1) {
            return [];
        }
        var selectedDateParameter = DataHandler.getData("selectedDateParameter", []);
        var i, j, dateRange, fieldDate;
        for (i = 0; i < selectedDateParameter.length; i++) {
            if (!$S.isArray(selectedDateParameter[i].items)) {
                selectedDateParameter[i].items = [];
            }
            dateRange = selectedDateParameter[i].dateRange;
            for (j = 0; j < csvDataByDate.length; j++) {
                fieldDate = csvDataByDate[j].date;
                if (AppHandler.isDateLiesInRange(dateRange[0], dateRange[1], fieldDate)) {
                    selectedDateParameter[i].items = selectedDateParameter[i].items.concat(csvDataByDate[j].items);
                }
            }
        }
        var finalData = [];
        for (i = 0; i < selectedDateParameter.length; i++) {
            if ($S.isArray(selectedDateParameter[i].items) && selectedDateParameter[i].items.length > 0) {
                finalData.push(selectedDateParameter[i]);
            }
        }
        return finalData;
    },
    _filterCsvData: function(csvDataByDate) {
        if (!$S.isArray(csvDataByDate)) {
            return [];
        }
        var filterOptions = DataHandler.getData("filterOptions", []);
        var i, j, k;
        var value, dataName;
        var temp, temp2;
        for(k=0; k<filterOptions.length; k++) {
            temp2 = [];
            if (filterOptions[k].type !== "dropdown") {
                continue;
            }
            value = filterOptions[k].selectedValue;
            dataName = filterOptions[k].dataName;
            if (value === "") {
                continue;
            } else {
                value = [value];
            }
            for (i = 0; i < csvDataByDate.length; i++) {
                temp = {"date": csvDataByDate[i].date, "items": []};
                for (j = 0; j < csvDataByDate[i].items.length; j++) {
                    if (value.indexOf(csvDataByDate[i].items[j][dataName]) >= 0) {
                        temp["items"].push(csvDataByDate[i].items[j]);
                    }
                }
                if (temp.items.length > 0) {
                    temp2.push(temp);
                }
            }
            csvDataByDate = temp2;
        }
        return csvDataByDate;
    },
    getPageRenderData: function(pageName) {
        var csvDataByDate;
        if (["entry"].indexOf(pageName) >= 0) {
            return DataHandler.getData("csvData", []);
        }
        if (["entrybydate"].indexOf(pageName) >= 0) {
            csvDataByDate = DataHandler.getData("csvDataByDate", []);
            return DataHandler.generateEntryByDateData(csvDataByDate);
        }
        if (["entrybydatefilter", "summary"].indexOf(pageName) >= 0) {
            csvDataByDate = DataHandler.getData("csvDataByDate", []);
            var filteredData = this._filterCsvData(csvDataByDate);
            return DataHandler.generateEntryByDateData(filteredData);
        }
        if (["entrybytype", "entrybystation", "entrybydevice"].indexOf(pageName) >= 0) {
            var mapping = {"entrybytype": "type", "entrybystation": "station", "entrybydevice": "device"};
            return DataHandler.generateDataBySelection(mapping[pageName]);
        }
        return [];
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
            var pageDropdown = DataHandler.getData("dropdownFields", []);
            var filterOptions = [];
            var hidePageTab = false;
            if (["home","addentry","uploadfile"].indexOf(currentPageName) >= 0) {
                goBackLinkData = [];
                sectionsData = [];
                hidePageTab = true;
            } else if (["entrybydatefilter", "summary"].indexOf(currentPageName) >= 0) {
                filterOptions = DataHandler.getData("filterOptions", []);
            }
            if (["home"].indexOf(currentPageName) >= 0) {
                pageDropdown = [];
            }
            var renderData = DataHandler.getPageRenderData(currentPageName);
            DataHandler.setData("renderData", renderData);
            var renderFieldRow = DataHandler.getPageRenderField(currentPageName);
            DataHandler.setData("availableDataPageName", currentPageName);

            appDataCallback("hidePageTab", hidePageTab);
            appDataCallback("selectFilterComponentClass", currentPageName);
            appDataCallback("list1Data", sectionsData);
            appDataCallback("list2Data", pageDropdown);
            appDataCallback("currentList1Id", DataHandler.getData("currentSectionId", ""));
            appDataCallback("currentList2Id", currentPageName);
            appDataCallback("appHeading", TemplateHandler.getAppHedingTemplate(currentPageName));
            appDataCallback("pageHeading", DataHandler.getMetaDataPageHeadingV2());

            appDataCallback("renderFieldRow", renderFieldRow);
            appDataCallback("selectedDateType", DataHandler.getData("selectedDateType", ""));
            appDataCallback("errorsData", DataHandler.getData("errorsData", []));
            appDataCallback("firstTimeDataLoadStatus", DataHandler.getData("firstTimeDataLoadStatus", ""));

            appDataCallback("goBackLinkData", goBackLinkData);
            appDataCallback("dateSelection", Config.dateSelection);
            appDataCallback("dateSelectionRequiredPages", Config.dateSelectionRequired);
            appDataCallback("disableFooter", DataHandler.getDisableFooterStatus());

            appDataCallback("filterOptions", AppHandler.getFilterData(filterOptions));
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
    generatePageData: function(csvData) {
        var jsonData = [];
        if ($S.isArray(csvData)) {
            for (var i = 0; i < csvData.length; i++) {
                jsonData.push(DataHandler._fileToJson(csvData[i]));
            }
        }
        return jsonData;
    },
    _getUsername: function(username) {
        var validUsername = "info";
        var relatedUserData = DataHandler.getData("relatedUsersData", []);
        if ($S.isArray(relatedUserData)) {
            for (var i = 0; i < relatedUserData.length; i++) {
                if (relatedUserData[i].username === username) {
                    validUsername = username;
                }
            }
        }
        return validUsername;
    },
    generateFilterData: function(csvData) {
        if (!$S.isArray(csvData)) {
            return [];
        }
        var metaData = this.getData("metaData", {});
        var filterKeys = [], i, j, temp;
        if ($S.isObject(metaData) && $S.isArray(metaData.filterKeys)) {
            for(i=0; i<metaData.filterKeys.length; i++) {
                if (!$S.isString(metaData.filterKeys[i])) {
                    continue;
                }
                filterKeys.push(metaData.filterKeys[i]);
            }
        }
        var tempFilterOptions = {};
        for(i=0; i<filterKeys.length; i++) {
            tempFilterOptions[filterKeys[i]] = {
                "selectName": filterKeys[i]+"Selected",
                "dataName": filterKeys[i],
                "dataDisplay": filterKeys[i]+"Display",
                "possibleIds": [],
                "filterOption": []
            };
        }
        var resetButton = [{"name": "reset-filter", "value": "reset-filter", "display": "Reset"}];
        for(i=0; i<csvData.length; i++) {
            for(j=0; j<filterKeys.length; j++) {
                temp = csvData[i][tempFilterOptions[filterKeys[j]].dataName];
                if (!$S.isString(temp) || temp.trim().length < 1) {
                    continue;
                }
                temp = temp.trim();
                if (tempFilterOptions[filterKeys[j]].possibleIds.indexOf(temp) < 0) {
                    tempFilterOptions[filterKeys[j]].possibleIds.push(temp);
                    tempFilterOptions[filterKeys[j]].filterOption.push({"value": temp, "option": csvData[i][tempFilterOptions[filterKeys[j]].dataDisplay]});
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
        var selectionOptions = [];
        var selectedValue;
        for(i=0; i<filterKeys.length; i++) {
            if (filterKeys[i] === "reset") {
                selectionOptions.push({"type": "buttons", "buttons": resetButton, "selectedValue": ""});
                continue;
            }
            selectedValue = DataHandler.getData(tempFilterOptions[filterKeys[i]].selectName, "");
            if (tempFilterOptions[filterKeys[i]].possibleIds.indexOf(selectedValue) < 0) {
                selectedValue = "";
            }
            if (tempFilterOptions[filterKeys[i]].filterOption.length > 0) {
                selectionOptions.push({"type": "dropdown",
                    "text": tempFilterOptions[filterKeys[i]].filterOption,
                    "selectName": tempFilterOptions[filterKeys[i]].selectName,
                    "dataName": tempFilterOptions[filterKeys[i]].dataName,
                    "possibleIds": tempFilterOptions[filterKeys[i]].possibleIds,
                    "selectedValue": selectedValue
                });
            }
        }
        return selectionOptions;
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
                                if (!AppHandler.isValidDateStr(jsonData[i][j][0])) {
                                    isValidType = false;
                                    errorsData.push({"reason": "Invalid date", "data": jsonData[i][j].join()});
                                }
                                if (isValidType && validTypes.indexOf(jsonData[i][j][1]) < 0) {
                                    // isValidType = false;
                                    if (jsonData[i][j].length >= 5) {
                                        jsonData[i][j][4] = jsonData[i][j].slice(1).join() + ",Invalid type";
                                    }
                                    jsonData[i][j][1] = "info";
                                    // errorsData.push({"reason": "Invalid type", "data": jsonData[i][j].join()});
                                }
                                if (isValidType && validStation.indexOf(jsonData[i][j][2]) < 0) {
                                    // isValidType = false;
                                    // errorsData.push({"reason": "Invalid station", "data": jsonData[i][j].join()});
                                    if (jsonData[i][j].length >= 5) {
                                        jsonData[i][j][4] = jsonData[i][j].slice(1).join() + ",Invalid station";
                                    }
                                    jsonData[i][j][2] = "info";
                                }
                                if (isValidType && validDevice.indexOf(jsonData[i][j][3]) < 0) {
                                    // isValidType = false;
                                    // errorsData.push({"reason": "Invalid device", "data": jsonData[i][j].join()});
                                    if (jsonData[i][j].length >= 5) {
                                        jsonData[i][j][4] = jsonData[i][j].slice(1).join() + ",Invalid device";
                                    }
                                    jsonData[i][j][3] = "info";
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
                                    temp["username"] =this._getUsername(jsonData[i][j][4]);
                                    temp["usernameDisplay"] = this.getDisplayUsername(temp["username"]);
                                    if (jsonData[i][j].length >= 5) {
                                        temp["description"] = jsonData[i][j].slice(4).join();
                                        var textV2 = temp["description"].split(";").map(function(el, i, arr) {
                                            return {"tag": "li", "text": el};
                                        });
                                        temp["descriptionV2"] = {"tag": "ul", "className": "description-ul", "text": textV2}
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
            if ($S.isString(temp[i].date) && $S.isArray(temp[i].item)) {
                dataByDateSorted.push({date: temp[i].date, items:temp[i].item});
            }
        }
        return {errorsData: errorsData, finalData: finalData, dataByDate: dataByDateSorted};
    }
});

})($S);

export default DataHandler;
