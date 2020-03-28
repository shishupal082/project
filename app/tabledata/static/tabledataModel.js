(function($S) {

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
var apiResponse = [];
var apiNames = ["03-27", "03-28", "03-29"];
var apiLoadStatus = {};

function loadJsonData(callBack) {
    var urls = [];
    for (var i = 0; i < apiNames.length; i++) {
        urls.push({api: "/app/tabledata/data/"+apiNames[i]+".json?"+requestId, name: apiNames[i]});
    }
    for (var i = 0; i < urls.length; i++) {
        apiLoadStatus[urls[i].name] = false;
        $S.loadJsonData($, [urls[i].api], function(response, apiName) {
            apiResponse.push({apiName: apiName, response: response});
            apiLoadStatus[apiName] = true;
        }, function() {
            for (var i = 0; i < apiNames.length; i++) {
                if (apiLoadStatus[apiNames[i]]) {
                    continue;
                }
                return 0;
            }
            $S.callMethod(callBack);
            return 1;
        }, urls[i].name);
    }
    return 1;
}


TableDataModel.extend({
    documentLoaded: function(callBack) {
        $S.loadJsonData($, ["/app/tabledata/data/indexing.json?"+requestId], function(response) {
            indexingData = response;
            return loadJsonData(callBack);
        });
        return 1;
    }
});

TableDataModel.extend({
    getApiResponseData: function() {
        return $S.clone(apiResponse);
    },
    getTableIndexData: function() {
        return $S.clone(indexingData);
    },
    getTableIndex: function(name) {
        return indexingData.indexOf(name);
    },
    getDataByIndex: function(index) {
        var response = {};
        if (index < 0 || index >= indexingData.length) {
            return response;
        }
        var name = indexingData[index];
        response["label"] = name;
        response["labels"] = [];
        response["data"] = [];
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
        var firstRow = ["<b>S.No.</b>","<b>State/UT</b>"];
        var lastRow = ["", "<b>Total:</b>"];
        data.push(firstRow);
        for (var i = 0; i < indexingData.length; i++) {
            data.push([i+1, indexingData[i]]);
        }
        var totalCount = 0;
        for (var i=0; i<response.length; i++) {
            totalCount=0;
            firstRow.push(response[i].apiName);
            var individualResponse = response[i].response;
            if ($S.isObject(individualResponse)) {
                for (var key in individualResponse) {
                    var index = indexingData.indexOf(key);
                    if (index < 0) {
                        $S.log("Invalid index for: "+key);
                    } else {
                        data[index+1].push(individualResponse[key]);
                        totalCount += individualResponse[key];
                    }
                }
            } else {
                $S.log("Invalid individualResponse for: "+response[i].apiName);
            }
            lastRow.push(totalCount);
        }
        data.push(lastRow);
        return data;
    }
});

window.TableDataModel = window.$TDM = TableDataModel;
})($S);
