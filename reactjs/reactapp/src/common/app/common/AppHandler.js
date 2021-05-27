import $S from '../../../interface/stack.js';
import Api from '../../Api.js';
import TemplateHelper from '../../TemplateHelper.js';


var AppHandler;

(function($S){
var DT = $S.getDT();
var requestId = $S.getRequestId();

AppHandler = function(arg) {
    return new AppHandler.fn.init(arg);
};

AppHandler.fn = AppHandler.prototype = {
    constructor: AppHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(AppHandler);
AppHandler.extend({
    getPageUrl: function(pageName) {
        return window.location.pathname;
    },
    LazyRedirect: function(url, delay) {
        // standard value of delay = 250 (i.e. 250ms)
        if ($S.isNumber(delay)) {
            window.setTimeout(function() {
                window.location.href = url;
            }, delay);
        } else {
            window.location.href = url;
        }
    },
    LazyReload: function(delay) {
        // standard value of delay = 250 (i.e. 250ms)
        if ($S.isNumber(delay)) {
            window.setTimeout(function() {
                window.location.reload();
            }, delay);
        } else {
            window.location.reload();
        }
    }
});
AppHandler.extend({
    getTagName: function(e) {
        return e.currentTarget.tagName.toLocaleLowerCase();
    },
    getFieldName: function(e) {
        var tagName = this.getTagName(e);
        if ($S.isString(tagName) && tagName === "span") {
            return e.currentTarget.getAttribute("name");
        }
        return e.currentTarget.name;
    },
    getFieldValue: function(e) {
        var tagName = this.getTagName(e);
        if ($S.isString(tagName) && tagName === "span") {
            return e.currentTarget.getAttribute("value");
        }
        return e.currentTarget.value;
    }
});
AppHandler.extend({
    isValidDateStr: function(dateStr) {
        var p1Formate = "YYYY/-/MM/-/DD";
        var p2Formate = "YYYY/-/MM/-/DD/ /hh/:/mm";
        var p3Formate = "YYYY/-/MM/-/DD/ /hh/:/mm/:/ss/./ms";
        //2020-05-31
        var p1 = /[1-9]{1}[0-9]{3}-[0-1][0-9]-[0-3][0-9]/i;
        //2020-05-31 00:00
        var p2 = /[1-9]{1}[0-9]{3}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]/i;
        //2021-05-26 00:00:09.987
        var p3 = /[1-9]{1}[0-9]{3}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9].[0-9]{3}/i;
        var dateObj;
        if ($S.isString(dateStr) && (dateStr.length === 16 || dateStr.length === 10 || dateStr.length === 23)) {
            dateObj = DT.getDateObj(dateStr);
            if (dateObj !== null) {
                if (dateStr.search(p3) >= 0 && dateStr === DT.formateDateTime(p3Formate, "/", dateObj)) {
                    return true;
                } else if (dateStr.search(p2) >= 0 && dateStr === DT.formateDateTime(p2Formate, "/", dateObj)) {
                    return true;
                } else if (dateStr.search(p1) >= 0 && dateStr === DT.formateDateTime(p1Formate, "/", dateObj)) {
                    return true;
                }
            }
        }
        return false;
    },
    isDateLiesInRange: function(startDate, endDate, fieldDate) {
        if ($S.isString(fieldDate) && fieldDate.length === 10) {
            fieldDate += " 00:00";
        }
        startDate = DT.getDateObj(startDate);
        endDate = DT.getDateObj(endDate);
        fieldDate = DT.getDateObj(fieldDate);
        if (startDate === null || endDate === null || fieldDate === null) {
            return false;
        }
        if (startDate.getTime() <= fieldDate.getTime() && endDate.getTime() >= fieldDate.getTime()) {
            return true;
        }
        return false;
    },
    generateDateSelectionParameter: function(allDateStr) {
        var dailyDateSelection = [];
        var monthlyDateSelection = [];
        var yearlyDateSelection = [];
        var allDateSelection = [];
        var allDate = [];
        if ($S.isArray(allDateStr)) {
            allDate = allDateStr;
        }
        var i, temp, heading, startDate, endDate;
        var isDateHeadingChanged;
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
                heading = DT.formateDateTime("MMM/ /YYYY", "/", dObj);
                endDate = DT.formateDateTime("YYYY/-/MM/-/DD/ 23:59", "/", dObj);
                if (temp.indexOf(heading) < 0) {
                    isDateHeadingChanged = true;
                } else {
                    isDateHeadingChanged = false;
                }
                if (isDateHeadingChanged) {
                    startDate = DT.formateDateTime("YYYY/-/MM/-/DD/ 00:00", "/", dObj);
                }
            } else {
                continue;
            }
            if (temp.indexOf(heading) < 0) {
                monthlyDateSelection.push({"dateRange": [startDate, endDate], "dateHeading": heading});
                temp.push(heading);
            } else {
                monthlyDateSelection[monthlyDateSelection.length-1]["dateRange"][1] = endDate;
            }
        }
        /*Yearly Date Selection*/
        temp = [];
        for (i=0; i<allDate.length; i++) {
            dObj = DT.getDateObj(allDate[i]);
            if (dObj !== null) {
                heading = DT.formateDateTime("YYYY", "/", dObj);
                endDate = DT.formateDateTime("YYYY/-/MM/-/DD/ 23:59", "/", dObj);
                if (temp.indexOf(heading) < 0) {
                    isDateHeadingChanged = true;
                } else {
                    isDateHeadingChanged = false;
                }
                if (isDateHeadingChanged) {
                    startDate = DT.formateDateTime("YYYY/-/MM/-/DD/ 00:00", "/", dObj);
                }
            } else {
                continue;
            }
            if (temp.indexOf(heading) < 0) {
                yearlyDateSelection.push({"dateRange": [startDate, endDate], "dateHeading": heading});
                temp.push(heading);
            } else {
                yearlyDateSelection[yearlyDateSelection.length-1]["dateRange"][1] = endDate;
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
    }
});
AppHandler.extend({
    HandleToggleClick: function(appStateCallback, appDataCallback, oldValue) {
        var newValue = true;
        if ($S.isBooleanTrue(oldValue)) {
            newValue = false;
        }
        appDataCallback("disableFooterV2", newValue);
        appStateCallback();
    }
});
AppHandler.extend({
    // single select filter data
    getFilterData: function(selectionOptions) {
        var filterData = [];
        var i, j;
        if ($S.isArray(selectionOptions)) {
            for (i = 0; i < selectionOptions.length; i++) {
                if ($S.isArray(selectionOptions[i].text)) {
                    if ($S.isString(selectionOptions[i].selectedValue)) {
                        for (j = 0; j < selectionOptions[i].text.length; j++) {
                            if ($S.isObject(selectionOptions[i].text[j])) {
                                if (selectionOptions[i].selectedValue === selectionOptions[i].text[j].value) {
                                    selectionOptions[i].text[j]["selected"] = true;
                                } else {
                                    selectionOptions[i].text[j]["selected"] = false;
                                }
                            }
                        }
                    }
                    filterData.push({"type": selectionOptions[i].type, "text": selectionOptions[i].text, "selectName": selectionOptions[i].selectName});
                } else if ($S.isArray(selectionOptions[i].buttons)) {
                    if ($S.isString(selectionOptions[i].selectedValue)) {
                        for (j = 0; j < selectionOptions[i].buttons.length; j++) {
                            if ($S.isObject(selectionOptions[i].buttons[j])) {
                                if (selectionOptions[i].selectedValue === selectionOptions[i].buttons[j].value) {
                                    selectionOptions[i].buttons[j]["selected"] = true;
                                } else {
                                    selectionOptions[i].buttons[j]["selected"] = false;
                                }
                            }
                        }
                    }
                    filterData.push({"type": selectionOptions[i].type, "buttons": selectionOptions[i].buttons});
                }
            }
        }
        return filterData;
    },
    ConvertRowToCol: function(data) {
        var rows = [];
        var maxRowLen = 0, i, j;
        if ($S.isArray(data)) {
            for (i = 0; i < data.length; i++) {
                if ($S.isArray(data[i])) {
                    if (data[i].length > maxRowLen) {
                        maxRowLen = data[i].length;
                    }
                }
            }
            for (i = 0; i < maxRowLen; i++) {
                rows.push([]);
            }
            for (i = 0; i < data.length; i++) {
                if ($S.isArray(data[i])) {
                    for(j=0; j<data[i].length; j++) {
                        rows[j].push(data[i][j]);
                    }
                }
            }
        }
        return rows;
    },
    ParseCSVData: function(dataStr) {
        return this.ParseTextData(dataStr, ",", false, true);
    },
    ParseTextData: function(dataStr, wordBreak, skipEmpty, trimEntry) {
        if (!$S.isString(wordBreak)) {
            wordBreak = ",";
        }
        if (!$S.isBooleanTrue(skipEmpty)) {
            skipEmpty = false;
        }
        if (!$S.isBooleanTrue(trimEntry)) {
            trimEntry = true;
        }
        var finalArr = [], temp, i, j;
        if (!$S.isString(dataStr)) {
            return finalArr;
        }
        var arr = dataStr.split("\n");
        for (i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split(wordBreak);
        }

        for (i = 0; i < arr.length; i++) {
            if (arr[i].length === 1 && arr[i][0].trim() === "") {
                continue;
            }
            if (trimEntry) {
                for (j = 0; j < arr[i].length; j++) {
                    arr[i][j] = arr[i][j].trim();
                }
            }
            temp = [];
            if (skipEmpty) {
                for (j = 0; j < arr[i].length; j++) {
                    if (arr[i][j] === "") {
                        continue;
                    }
                    temp.push(arr[i][j]);
                }
            } else {
                temp = arr[i];
            }
            if (temp.length > 0) {
                finalArr.push(temp);
            }
        }
        return finalArr;
    }
});
AppHandler.extend({
    _generateTableRow: function(rowData, rowIndex) {
        var result = {}, i, j, temp;
        if ($S.isArray(rowData) && $S.isArray(rowIndex)) {
            for (i = 0; i < rowData.length; i++) {
                if (i < rowIndex.length-1) {
                    result[rowIndex[i]] = rowData[i];
                } else {
                    temp = [];
                    for(j=i; j<rowData.length; j++) {
                        if ($S.isString(rowData[j]) && rowData[j].length > 0) {
                            temp.push(rowData[j]);
                        }
                    }
                    i = j;
                    result[rowIndex[rowIndex.length-1]] = temp.join(",");
                }
            }
        }
        return result;
    },
    ConvertJsonToTable: function(jsonData, dataIndex) {
        var maxLength = 0, i, j;
        if (!$S.isArray(jsonData)) {
            jsonData = [];
        }
        for(i=0; i<jsonData.length; i++) {
            if ($S.isArray(jsonData[i])) {
                if (maxLength < jsonData[i].length) {
                    maxLength = jsonData[i].length;
                }
            }
        }
        for(i=0; i<jsonData.length; i++) {
            if ($S.isArray(jsonData[i])) {
                for(j = jsonData[i].length; j<maxLength; j++) {
                    jsonData[i].push("");
                }
            }
        }
        if (!$S.isArray(dataIndex) || dataIndex.length === 0) {
            dataIndex = [];
            for (i=0; i<maxLength; i++) {
                dataIndex.push(i.toString());
            }
        }
        var result = [];
        for(i=0; i<jsonData.length; i++) {
            result.push(this._generateTableRow(jsonData[i], dataIndex));
        }
        return result;
    }
});
AppHandler.extend({
    GenerateDateBetween2Date: function(startDateStr, endDateStr, startLimit, endLimit) {
        if (!this.isValidDateStr(startDateStr) || !this.isValidDateStr(endDateStr)) {
            return [];
        }
        if (!this.isValidDateStr(startLimit)) {
            startLimit = startDateStr;
        }
        if (!this.isValidDateStr(endLimit)) {
            endLimit = endDateStr;
        }
        if ($S.isString(startLimit) && startLimit.length === 10) {
            startLimit += " 00:00";
        }
        if ($S.isString(endLimit) && endLimit.length === 10) {
            endLimit += " 23:59";
        }
        var dateArr = [];
        var startDateObj = DT.getDateObj(startDateStr);
        var endDateObj = DT.getDateObj(endDateStr);
        var startLimitDateObj = DT.getDateObj(startLimit);
        var endLimitDateObj = DT.getDateObj(endLimit);
        if (startDateObj > endDateObj) {
            startDateObj = endDateObj;
            endDateObj = DT.getDateObj(startDateStr);
        }
        do {
            if (startLimitDateObj <= startDateObj && startDateObj <= endLimitDateObj) {
                dateArr.push({"dateStr": DT.formateDateTime("YYYY/-/MM/-/DD", "/", startDateObj),
                    "date": DT.formateDateTime("DD", "/", startDateObj)*1, "day": DT.formateDateTime("DDD", "/", startDateObj)});
            }
            startDateObj = DT.addDate(startDateObj, 1);
        } while(startDateObj <= endDateObj);
        return dateArr;
    }
});

var userDetails = {"username": "", "displayName": "", "login": false, "roles": {}};

AppHandler.extend({
    GetUserDetails: function() {
        return userDetails;
    },
    GetUserData: function(key, defaultValue) {
        if ($S.isString(userDetails[key]) || key === "login") {
            return userDetails[key];
        }
        // valid roles key: isDevUser, isAdminUser, isLogin, isAddTextEnable, isUploadFileEnable
        if ($S.isBooleanTrue(userDetails["roles"][key])) {
            return userDetails["roles"][key];
        }
        return defaultValue;
    },
    LoadLoginUserDetails: function(url, callback) {
        if (!$S.isString(url)) {
            $S.callMethod(callback);
        }
        $S.loadJsonData(null, [url], function(response, apiName, ajax){
            if ($S.isObject(response) && response["status"] === "SUCCESS" && $S.isObject(response["data"])) {
                userDetails = response["data"];
            }
        }, function() {
            $S.log("Load loginUserDetails complete.");
            $S.callMethod(callback);
        }, null, Api.getAjaxApiCallMethod());
    }
});

var staticData = {"appVersion": "", "uploadFileApiVersion": "",
                "headingJson": "", "afterLoginLinkJson": "",
                "footerLinkJson": "", "footerLinkJsonAfterLogin": "",
                "jsonFileData": {}};

AppHandler.extend({
    GetAllStaticDetails: function() {
        return staticData;
    },
    GetStaticData: function(key, defaultValue) {
        if ($S.isString(staticData[key])) {
            return staticData[key];
        } else if ($S.isObject(staticData[key])) {
            return staticData[key];
        } else if ($S.isArray(staticData[key])) {
            return staticData[key];
        }
        return defaultValue;
    },
    LoadStaticData: function(url, callback) {
        if (!$S.isString(url)) {
            $S.callMethod(callback);
        }
        $S.loadJsonData(null, [url], function(response, apiName, ajax){
            if ($S.isObject(response) && response["status"] === "SUCCESS" && $S.isObject(response["data"])) {
                staticData = response["data"];
            }
        }, function() {
            $S.log("Load staticData complete.");
            $S.callMethod(callback);
        }, null, Api.getAjaxApiCallMethod());
    }
});

AppHandler.extend({
    LoadDataFromRequestApi: function(request, callback) {
        if (!$S.isArray(request) || request.length < 1) {
            return $S.callMethod(callback);
        }
        var temp;
        var tempRequestMapping = {};
        function isValidRequest(el) {
            if (!$S.isObject(el)) {
                return false;
            }
            if (!$S.isArray(el.url)) {
                return false;
            }
            if (!$S.isString(el.apiName)) {
                return false;
            }
            if (!$S.isFunction(el.requestMethod)) {
                return false;
            }
            for (var i=0; i<el.url.length; i++) {
                if (!$S.isString(el.url[i])) {
                    return false;
                }
            }
            return true;
        }
        function fireCallback() {
            temp = true;
            for (var k=0; k<request.length; k++) {
                if (!isValidRequest(request[k])) {
                    continue;
                }
                if ($S.isNumber(tempRequestMapping[request[k].apiName].requestCount)) {
                    if (tempRequestMapping[request[k].apiName].requestCount !== tempRequestMapping[request[k].apiName].responseCount) {
                        temp = false;
                        break;
                    }
                }
            }
            if (temp) {
                $S.callMethod(callback);
            }
        }
        for (var i=0; i<request.length; i++) {
            if (!isValidRequest(request[i])) {
                continue;
            }
            tempRequestMapping[request[i].apiName] = {};
            tempRequestMapping[request[i].apiName].requestCount = request[i].url.length;
            tempRequestMapping[request[i].apiName].responseCount = 0;
            if (request[i].url.length < 1) {
                continue;
            }
            $S.loadJsonData(request[i].JQ, request[i].url, function(response, apiName, ajax){
                for (var j=0; j<request.length; j++) {
                    if (!isValidRequest(request[j])) {
                        continue;
                    }
                    if ($S.isString(request[j].apiName) && request[j].apiName === apiName) {
                        if (!$S.isNumber(tempRequestMapping[apiName].responseCount)) {
                            tempRequestMapping[apiName].responseCount = 0;
                        }
                        tempRequestMapping[apiName].responseCount++;
                        if (!$S.isArray(request[j].response)) {
                            request[j].response = [];
                        }
                        request[j].response.push(response);
                    }
                }
                // fireCallback();
            }, function() {
                fireCallback();
            }, request[i].apiName, request[i].requestMethod);
        }
        fireCallback();
    }
});
AppHandler.extend({
    getHeadingText: function(currentAppData, defaultValue) {
        var headingText = defaultValue;
        if (!$S.isObject(currentAppData)) {
            return headingText;
        }
        var heading = currentAppData.heading;
        var name = currentAppData.name;
        if ($S.isString(heading) && heading.length > 0) {
            headingText = heading;
        } else if ($S.isString(name) && name.length > 0) {
            headingText = name;
        }
        return headingText;
    },
    loadAppControlData: function(appControlApi, baseApi, appControlDataPath, validAppControl, callback) {
        if ($S.isString(baseApi) && $S.isString(appControlDataPath) && $S.isArray(validAppControl)) {
            for(var i=0; i<validAppControl.length; i++) {
                if (this.GetUserData(validAppControl[i])) {
                    appControlApi = baseApi + appControlDataPath + validAppControl[i] + ".json?v=" + requestId;
                    break;
                }
            }
        }
        if (!$S.isString(appControlApi) || appControlApi.length < 1) {
            return callback();
        }
        var request = [];
        var appControlRequest = {
                            "url": [appControlApi],
                            "apiName": "appControlData",
                            "requestMethod": Api.getAjaxApiCallMethod()};
        request.push(appControlRequest);
        var appControlData = [];
        AppHandler.LoadDataFromRequestApi(request, function() {
            if ($S.isArray(request[0].response) && request[0].response.length > 0) {
                if ($S.isArray(request[0].response[0])) {
                    request[0].response[0].map(function(el, i, arr) {
                        if ($S.isObject(el)) {
                            el.id = "app-id-" + i;
                        }
                        return el;
                    });
                    appControlData = request[0].response[0];
                }
            }
            if ($S.isFunction(callback)) {
                callback(appControlData);
            }
        });
    }
});
AppHandler.extend({
    getSearchByPattern: function(filterOption, selectedValue, isRevert) {
        if (!$S.isString(selectedValue) || selectedValue.length === 0) {
            return false;
        }
        if ($S.isBooleanTrue(isRevert)) {
            isRevert = true;
        } else {
            isRevert = false;
        }
        if ($S.isArray(filterOption)) {
            for(var i=0; i<filterOption.length; i++) {
                if (!$S.isObject(filterOption[i])) {
                    continue;
                }
                if (isRevert) {
                    if (filterOption[i].value === "~" + selectedValue) {
                        return $S.isBooleanTrue(filterOption[i].searchByPattern);
                    }
                } else if (filterOption[i].value === selectedValue) {
                    return $S.isBooleanTrue(filterOption[i].searchByPattern);
                }
            }
        }
        return false;
    },
    generateFilterDataOld: function(metaData, csvData, filterSelectedValues) {
        if (!$S.isArray(csvData)) {
            return [];
        }
        if (!$S.isObject(filterSelectedValues)) {
            filterSelectedValues = {};
        }
        var filterKeys = [], i, j, temp;
        var preFilter = {};
        if ($S.isObject(metaData) && $S.isArray(metaData.filterKeys)) {
            for(i=0; i<metaData.filterKeys.length; i++) {
                if (!$S.isString(metaData.filterKeys[i])) {
                    continue;
                }
                filterKeys.push(metaData.filterKeys[i]);
            }
            if ($S.isObject(metaData.preFilter)) {
                preFilter = metaData.preFilter;
            }
        }
        var tempFilterOptions = {};
        for(i=0; i<filterKeys.length; i++) {
            tempFilterOptions[filterKeys[i]] = {
                "selectName": filterKeys[i]+"Selected",
                "dataKey": filterKeys[i],
                "dataDisplay": filterKeys[i]+"Display",
                "possibleIds": [],
                "filterOption": [],
                "preFilter": preFilter[filterKeys[i]]
            };
        }
        var resetButton = [{"name": "reset-filter", "value": "reset-filter", "display": "Reset"}];
        for(i=0; i<csvData.length; i++) {
            for(j=0; j<filterKeys.length; j++) {
                temp = csvData[i][tempFilterOptions[filterKeys[j]].dataKey];
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
            if ($S.isArray(tempFilterOptions[temp].preFilter)) {
                for (i=tempFilterOptions[temp].preFilter.length-1; i>=0; i--) {
                    if ($S.isObject(tempFilterOptions[temp].preFilter[i]) && $S.isString(tempFilterOptions[temp].preFilter[i].value)) {
                        if (tempFilterOptions[temp].possibleIds.indexOf(tempFilterOptions[temp].preFilter[i].value) < 0) {
                            tempFilterOptions[temp].possibleIds.push(tempFilterOptions[temp].preFilter[i].value);
                        }
                        $S.addElAt(tempFilterOptions[temp].filterOption, 0, tempFilterOptions[temp].preFilter[i]);
                    }
                }
            } else if (tempFilterOptions[temp].filterOption.length > 0) {
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
            selectedValue = filterSelectedValues[tempFilterOptions[filterKeys[i]].selectName];
            if (!$S.isString(selectedValue)) {
                selectedValue = "";
            }
            if (tempFilterOptions[filterKeys[i]].possibleIds.indexOf(selectedValue) < 0) {
                selectedValue = "";
            }
            if (tempFilterOptions[filterKeys[i]].filterOption.length > 0) {
                selectionOptions.push({"type": "dropdown",
                    "text": tempFilterOptions[filterKeys[i]].filterOption,
                    "selectName": tempFilterOptions[filterKeys[i]].selectName,
                    "dataKey": tempFilterOptions[filterKeys[i]].dataKey,
                    "possibleIds": tempFilterOptions[filterKeys[i]].possibleIds,
                    "selectedValue": selectedValue
                });
            }
        }
        return selectionOptions;
    },
    _getRequiredMetaData: function(currentAppData, metaData) {
        var preFilter = $S.findParam([currentAppData, metaData], "preFilter", {});
        var filterKeys = $S.findParam([currentAppData, metaData], "filterKeys", []);
        if (!$S.isObject(preFilter)) {
            preFilter = {};
        }
        if (!$S.isArray(filterKeys)) {
            filterKeys = [];
        }
        var finalKeys = [], finalPreFilter = {}, temp, temp2;
        for(var i=0; i<filterKeys.length; i++) {
            if (!$S.isString(filterKeys[i]) || filterKeys[i].length < 1) {
                continue;
            }
            temp = filterKeys[i];
            finalKeys.push(temp);
            temp2 = $S.findParam([currentAppData, metaData], temp + "Prefilter", []);
            if ($S.isArray(temp2) && temp2.length > 0) {
                finalPreFilter[temp] = temp2;
            }
        }
        return {"preFilter": finalPreFilter, "filterKeys": finalKeys};
    },
    generateFilterData: function(currentAppData, metaData, csvData, filterSelectedValues, searchParam) {
        if (!$S.isArray(csvData)) {
            return [];
        }
        if (!$S.isObject(filterSelectedValues)) {
            filterSelectedValues = {};
        }
        var metaDataTemp = this._getRequiredMetaData(currentAppData, metaData);
        var filterKeys = metaDataTemp["filterKeys"];
        var preFilter = metaDataTemp["preFilter"];
        var i, j, temp, temp2;

        var tempFilterOptions = {};
        for(i=0; i<filterKeys.length; i++) {
            tempFilterOptions[filterKeys[i]] = {
                "selectName": filterKeys[i]+"Selected",
                "dataKey": filterKeys[i],
                "dataDisplay": filterKeys[i]+"Display",
                "possibleIds": [],
                "filterOption": [],
                "preFilter": preFilter[filterKeys[i]]
            };
        }
        var resetButton = [{"name": "reset-filter", "value": "reset-filter", "display": "Reset"}];
        function getFilterText(data, key) {
            if ($S.isObject(data)) {
                return data[key];
            }
            if ($S.isArray(data)) {
                for(var i=0; i<data.length; i++) {
                    if ($S.isObject(data[i]) && $S.isString(data[i][searchParam])) {
                        if (key === data[i][searchParam]) {
                            return data[i].value;
                        }
                    }
                }
            }
            return null;
        }
        for(i=0; i<csvData.length; i++) {
            for(j=0; j<filterKeys.length; j++) {
                temp = getFilterText(csvData[i], tempFilterOptions[filterKeys[j]].dataKey);//csvData[i][tempFilterOptions[filterKeys[j]].dataKey];
                if (!$S.isString(temp) || temp.trim().length < 1) {
                    continue;
                }
                temp = temp.trim();
                temp2 = getFilterText(csvData[i], tempFilterOptions[filterKeys[j]].dataDisplay);
                if (!$S.isString(temp2)) {
                    temp2 = $S.capitalize(temp);
                }
                if (tempFilterOptions[filterKeys[j]].possibleIds.indexOf(temp) < 0) {
                    tempFilterOptions[filterKeys[j]].possibleIds.push(temp);
                    tempFilterOptions[filterKeys[j]].filterOption.push({"value": temp, "option": temp2});//csvData[i][tempFilterOptions[filterKeys[j]].dataDisplay]});
                }
            }
        }
        for(temp in tempFilterOptions) {
            tempFilterOptions[temp].filterOption.sort(function(a, b) {
                return a.option > b.option ? 1 : -1;
            });
            if ($S.isArray(tempFilterOptions[temp].preFilter)) {
                for (i=tempFilterOptions[temp].preFilter.length-1; i>=0; i--) {
                    if ($S.isObject(tempFilterOptions[temp].preFilter[i]) && $S.isString(tempFilterOptions[temp].preFilter[i].value)) {
                        if (tempFilterOptions[temp].possibleIds.indexOf(tempFilterOptions[temp].preFilter[i].value) < 0) {
                            tempFilterOptions[temp].possibleIds.push(tempFilterOptions[temp].preFilter[i].value);
                        }
                        $S.addElAt(tempFilterOptions[temp].filterOption, 0, tempFilterOptions[temp].preFilter[i]);
                    }
                }
            } else if (tempFilterOptions[temp].filterOption.length > 0) {
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
            selectedValue = filterSelectedValues[tempFilterOptions[filterKeys[i]].selectName];
            if (!$S.isString(selectedValue)) {
                selectedValue = "";
            }
            if (tempFilterOptions[filterKeys[i]].possibleIds.indexOf(selectedValue) < 0) {
                selectedValue = "";
            }
            if (tempFilterOptions[filterKeys[i]].filterOption.length > 0) {
                selectionOptions.push({"type": "dropdown",
                    "text": tempFilterOptions[filterKeys[i]].filterOption,
                    "selectName": tempFilterOptions[filterKeys[i]].selectName,
                    "dataKey": tempFilterOptions[filterKeys[i]].dataKey,
                    "possibleIds": tempFilterOptions[filterKeys[i]].possibleIds,
                    "selectedValue": selectedValue
                });
            }
        }
        return selectionOptions;
    },
    getFilteredData: function(currentAppData, metaData, csvData, filterOptions, searchParam) {
        var reportData = csvData;
        var metaDataTemp = this._getRequiredMetaData(currentAppData, metaData);
        var preFilter = metaDataTemp["preFilter"];
        var temp, temp2, temp3, i, j, k, l, filterIndex, filterValue, searchByPattern;
        var isRevert;
        function _isResultRevert(filterIndex, filterValue) {
            if ($S.isUndefined(filterIndex) || !$S.isString(filterValue)) {
                return false;
            }
            if ($S.isObject(preFilter) && $S.isArray(preFilter[filterIndex])) {
                for (l=0; l<preFilter[filterIndex].length; l++) {
                    if ($S.isObject(preFilter[filterIndex][l]) && preFilter[filterIndex][l].value === filterValue) {
                        if ($S.isBooleanTrue(preFilter[filterIndex][l].exceptValue)) {
                            return true;
                        }
                        break;
                    }
                }
            }
            return false;
        }
        if (!$S.isArray(reportData)) {
            reportData = [];
        }
        for(k=0; k<filterOptions.length; k++) {
            filterIndex = filterOptions[k].dataKey;
            filterValue = filterOptions[k].selectedValue;
            isRevert = _isResultRevert(filterIndex, filterValue);
            if (isRevert && $S.isString(filterValue)) {
                temp = filterValue.split("~");
                if (temp.length > 1) {
                    if (temp[0] === "") {
                        filterValue = temp.splice(1).join("~");
                   }
                }
            }
            if (!$S.isString(filterIndex) || filterIndex === "") {
                continue;
            }
            if (!$S.isString(filterValue) || filterValue === "") {
                continue;
            }
            temp3 = [];
            for (i = 0; i < reportData.length; i++) {
                temp = reportData[i];
                if ($S.isObject(temp) && $S.isString(temp[filterIndex])) {
                    searchByPattern = this.getSearchByPattern(filterOptions[k].text, filterValue, isRevert);
                    temp2 = $S.searchItems([filterValue], [temp[filterIndex]], searchByPattern, isRevert);
                    if (temp2.length > 0) {
                        temp3.push(temp);
                    }
                } else if ($S.isArray(temp)) {
                    for (j=0; j<temp.length; j++) {
                        if (!$S.isObject(temp[j])) {
                            continue;
                        }
                        if (temp[j][searchParam] === filterIndex) {
                            searchByPattern = this.getSearchByPattern(filterOptions[k].text, filterValue, isRevert);
                            temp2 = $S.searchItems([filterValue], [temp[j]["value"]], searchByPattern, isRevert);
                            if (temp2.length > 0) {
                                temp3.push(temp);
                                break;
                            }
                        }
                    }
                }
            }
            reportData = temp3;
        }
        return reportData;
    }
});
AppHandler.extend({
    GetFooterData: function(metaData) {
        if (!$S.isObject(metaData)) {
            metaData = {};
        }
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
                    footerData.push({"type": "table", "entry": this.ConvertRowToCol(staticFooterData[i].entry)});
                } else {
                    footerData.push({"type": "div", "entry": staticFooterData[i].entry});
                }
            }
        }
        return footerData;
    },
    _generateLink: function(metaData, linkType, name) {
        var text = name;
        var href = "";
        if ($S.isObject(metaData) && $S.isArray(metaData.footerLink)) {
            for (var i = 0; i < metaData.footerLink.length; i++) {
                if (metaData.footerLink[i].name === name) {
                    href = metaData.footerLink[i].link;
                    if ($S.isString(metaData.footerLink[i].footerLinkText)) {
                        text = metaData.footerLink[i].footerLinkText;
                    }
                    break;
                }
            }
        }
        return {"tag": "a", "href": href, "text": text};
    },
    GenerateFooterHtml: function(metaData, footerData) {
        var htmlFields = [], i, j, k;
        var divField = [{"tag": "div", "name": "tempDiv", "text": []}];
        var divField2 = [{"tag": "div", "name": "tempDiv2", "text": []}];
        var tableField = [{"tag": "table.tbody", "className": "", "name": "tempTable", "text": []}];
        var trField = [{"tag": "tr", "name": "tempTr", "text": []}];
        var tempDivField, tempDivField2, tempTableField, tempTrField;
        if ($S.isArray(footerData)) {
            for(i=0; i<footerData.length; i++) {
                if (!$S.isArray(footerData[i].entry)) {
                    continue;
                }
                if (footerData[i].type === "div") {
                    tempDivField = $S.clone(divField);
                    for (j=0; j<footerData[i].entry.length; j++) {
                        if ($S.isArray(footerData[i].entry[j])) {
                            tempDivField2 = $S.clone(divField2);
                            for (k = 0; k < footerData[i].entry[j].length-1; k++) {
                                TemplateHelper.addItemInTextArray(tempDivField2, "tempDiv2", this._generateLink(metaData, footerData[i].linkType, footerData[i].entry[j][k]));
                                TemplateHelper.addItemInTextArray(tempDivField2, "tempDiv2", {"tag": "a", "text": {"tag": "span", "text": "|"}});
                            }
                            TemplateHelper.addItemInTextArray(tempDivField2, "tempDiv2", this._generateLink(metaData, footerData[i].linkType, footerData[i].entry[j][k]));
                            TemplateHelper.addItemInTextArray(tempDivField, "tempDiv", tempDivField2);
                        }
                    }
                    htmlFields.push(tempDivField);
                } else if (footerData[i].type === "table") {
                    tempTableField = $S.clone(tableField);
                    for (j=0; j<footerData[i].entry.length; j++) {
                        if ($S.isArray(footerData[i].entry[j])) {
                            tempTrField = $S.clone(trField);
                            for (k = 0; k < footerData[i].entry[j].length-1; k++) {
                                TemplateHelper.addItemInTextArray(tempTrField, "tempTr", {"tag": "td", "text": this._generateLink(metaData, footerData[i].linkType, footerData[i].entry[j][k])});
                                TemplateHelper.addItemInTextArray(tempTrField, "tempTr", {"tag": "td", "text": {"tag": "span", "text": "|"}});
                            }
                            TemplateHelper.addItemInTextArray(tempTrField, "tempTr", {"tag": "td", "text": this._generateLink(metaData, footerData[i].linkType, footerData[i].entry[j][k])});
                            TemplateHelper.addItemInTextArray(tempTableField, "tempTable", tempTrField);
                        }
                    }
                    htmlFields.push(tempTableField);
                }
            }
        }
        return htmlFields;
    }
});
AppHandler.extend({
    getTemplate: function(allTemplate, pageName, defaultTemplate) {
        if ($S.isObject(allTemplate) && allTemplate[pageName]) {
            return $S.clone(allTemplate[pageName]);
        }
        return defaultTemplate;
    },
});
})($S);

export default AppHandler;
