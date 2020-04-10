(function($S) {

var LoggerInfo = $S.getScriptFileNameRef();

var TableDataModel = function(selector, context) {
    return new TableDataModel.fn.init(selector, context);
};
TableDataModel.fn = TableDataModel.prototype = {
    constructor: TableDataModel,
    init: function(items) {
        this.items = items;
        return this;
    }
};

ExtendObject(TableDataModel);

var requestId = $S.getRequestId();
var indexingData = [];
var apiNames = [];
var savingDataApi = [];
var latestApi = false;
var apiResponse = {};
var apiLoadStatus = {};
var savingData = {};

function loadJsonData(callBack) {
    var urls = [];
    for (var i = 0; i < apiNames.length; i++) {
        urls.push({api: "/pvt/app-data/tabledata/"+apiNames[i]+".json?"+requestId, name: apiNames[i]});
    }
    if (latestApi) {
        var latestApiName = "latest";
        if (apiNames.indexOf(latestApiName) >= 0) {
            latestApiName += "-"+$S.getUniqueNumber();
        }
        apiNames.push(latestApiName);
        urls.push({api: latestApi+"?"+requestId, name: latestApiName});
    }
    for (var i = 0; i < urls.length; i++) {
        apiLoadStatus[urls[i].name] = false;
        $S.loadJsonData($, [urls[i].api], function(response, apiName) {
            apiLoadStatus[apiName] = true;
            apiResponse[apiName] = response;
            if (apiName == "latest") {
                savingData = $S.isObject(response) ? $S.clone(response) : null;
            }
        }, function() {
            for (var i = 0; i < apiNames.length; i++) {
                if (apiLoadStatus[apiNames[i]]) {
                    continue;
                }
                return 0;
            }
            for (var name in apiResponse) {
                var response = apiResponse[name];
                if ($S.isObject(response)) {
                    for (var key in response) {
                        var count = 0;
                        if ($S.isObject(response[key])) {
                            for (var item in response[key]) {
                                if ($S.isObject(response[key][item])) {
                                    for (var values in response[key][item]) {
                                        if (response[key][item][values]) {
                                            if ($S.isNumber(response[key][item][values].confirmed)) {
                                                count += response[key][item][values].confirmed;
                                            }
                                        }
                                    }
                                }
                            }
                        } else if ($S.isNumber(response[key])) {
                            count = response[key];
                        }
                        response[key] = count;
                    }
                }
            }
            $S.callMethod(callBack);
            return 1;
        }, urls[i].name);
    }
    return 1;
}
function hasDuplicateInArray(items) {
    if (!$S.isArray(items)) {
        return false;
    }
    var obj = {};
    for (var i = 0; i < items.length; i++) {
        if ($S.isString(items[i])) {
            if (obj[items[i]]) {
                return true;
            }
            obj[items[i]] = 1;
        }
    }
    return false;
}
function saveData(response) {
    $.ajax({url: "/upload/save_data",
        data: {data: JSON.stringify(response)},
        type: "POST",
        success: function(response, textStatus) {
            // console.log(response);
        },
        error: function(xhr, textStatus, errorThrown) {
            $S.logV2(LoggerInfo, "Error in savingData.");
        }
    });
}
TableDataModel.extend({
    documentLoaded: function(callBack) {
        $S.loadJsonData($, ["/pvt/app-data/tabledata/indexing.json?"+requestId], function(response) {
            if ($S.isObject(response)) {
                indexingData =  $S.isArray(response["names"]) ? response["names"] : [];
                apiNames = $S.isArray(response["apiNames"]) ? response["apiNames"] : [];
                latestApi = $S.isString(response["latestApi"]) ? response["latestApi"] : false;
                savingDataApi = $S.isArray(response["savingDataApi"]) ? response["savingDataApi"] : [];
                if (hasDuplicateInArray(apiNames)) {
                    throw "'Duplicate entry in apiNames.'";
                }
                if (hasDuplicateInArray(indexingData)) {
                    throw "'Duplicate entry in indexingData.'";
                }
            }
            return loadJsonData(callBack);
        });
        return 1;
    },
    saveLatestData: function() {
        var urls = [];
        var requestId2 = $S.getUniqueNumber();
        for (var i = 0; i < savingDataApi.length; i++) {
            if (apiNames.indexOf(savingDataApi[i]) >= 0) {
                saveData(savingData);
                continue;
            }
            urls.push(savingDataApi[i] + "?" + requestId2);
        }
        $S.loadJsonData($, urls, function(response) {
            saveData(response);
        });
        return 1;
    }
});

function getAllData(index, apiName) {
    var response = {};
    response["label"] = index;
    response["labels"] = [];
    response["data"] = [];
    var total = 0;
    var requiredApiResponse = TableDataModel.getApiResponseByName(apiName);
    for (var i = 0; i < indexingData.length; i++) {
        var name = indexingData[i];
        response["labels"].push(name);
        total = requiredApiResponse[name] ? requiredApiResponse[name] : 0;
        response.data.push(total);
    }
    return response;
}

var apiResponseData = [];
TableDataModel.extend({
    getApiResponseData: function() {
        if (apiResponseData.length) {
            return $S.clone(apiResponseData);
        }
        for (var i=0; i<apiNames.length; i++) {
            apiResponseData.push({apiName: apiNames[i], response: apiResponse[apiNames[i]]});
        }
        return $S.clone(apiResponseData);
    },
    getApiResponseByName: function(name) {
        if (apiResponse[name]) {
            return $S.clone(apiResponse[name]);
        }
        return {};
    },
    getTableIndexData: function() {
        return $S.clone(indexingData);
    },
    getTableIndex: function(name) {
        return indexingData.indexOf(name);
    },
    getApiNames: function() {
        return $S.clone(apiNames);
    },
    getDataByIndex: function(index, apiName) {
        if (index == "all") {
            return getAllData(index, apiName);
        }
        var response = {};
        if (index < 0 || index >= indexingData.length) {
            return response;
        }
        var name = indexingData[index];
        response["label"] = name;
        response["labels"] = [];
        response["data"] = [];
        var apiResponse = TableDataModel.getApiResponseData();
        for (var i = 0; i < apiResponse.length; i++) {
            response["labels"].push(apiResponse[i].apiName);
            // response["labels"].push(apiResponse[i].apiName);
            // response["labels"].push(apiResponse[i].apiName);
            // response["labels"].push(apiResponse[i].apiName);
            if (apiResponse[i].response) {
                if ($S.isNumber(apiResponse[i].response[name])) {
                    response.data.push(apiResponse[i].response[name]);
                    // response.data.push(apiResponse[i].response[name]);
                    // response.data.push(apiResponse[i].response[name]);
                    // response.data.push(apiResponse[i].response[name]);
                } else {
                    response.data.push(0);
                    // response.data.push(0);
                    // response.data.push(0);
                    // response.data.push(0);
                }
            }
        }
        return response;
    },
    getRenderTableData: function() {
        var response = TableDataModel.getApiResponseData();
        var data = [];
        var firstRow = ["<b>State/UT</b>"];
        var lastRow = ["<b>Total:</b>"];
        data.push(firstRow);
        for (var i = 0; i < indexingData.length; i++) {
            data.push([indexingData[i]]);
        }
        var totalCount = 0;
        for (var i=0; i<response.length; i++) {
            totalCount=0;
            firstRow.push(response[i].apiName);
            var individualResponse = response[i].response;
            if (!$S.isObject(individualResponse)) {
                individualResponse = {};
                $S.logV2(LoggerInfo, "Invalid individualResponse for: "+response[i].apiName);
            }
            var maxLength = 0;
            for (var key in individualResponse) {
                var index = indexingData.indexOf(key);
                if (index < 0) {
                    $S.logV2(LoggerInfo, "Invalid index for: "+key + ", in api: " + response[i].apiName);
                } else {
                    data[index+1].push(individualResponse[key]);
                    totalCount += individualResponse[key];
                }
            }
            for (var j = 0; j < data.length; j++) {
                if (maxLength < data[j].length) {
                    maxLength = data[j].length;
                }
            }
            for (var j = 0; j < data.length; j++) {
                for (var k = data[j].length; k < maxLength; k++) {
                    data[j].push(0);
                }
            }
            lastRow.push(totalCount);
        }
        data.push(lastRow);
        var finalResponse = $S.clone(data);
        for (var i = 1; i < data.length; i++) {
            for (var j = 2; j < data[i].length; j++) {
                var diff = data[i][j] - data[i][j-1];
                var dispText = data[i][j];
                if (diff > 0) {
                    diff = " (+" + diff + ")";
                    dispText = '<span class="alert-danger">' + dispText + diff + '</span>';
                } else if (diff < 0) {
                    diff = " (" + diff + ")";
                    dispText = '<span class="alert-success">' + dispText + diff + '</span>';
                }
                finalResponse[i][j] = dispText;
            }
        }
        return finalResponse;
    }
});

window.TableDataModel = window.$TDM = TableDataModel;
})($S);
