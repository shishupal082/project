/*
    - store displayYardDominoBoundary in localStorage
    - Verify each domino data if configured
    - loadJsonData for given api url
*/
(function($S) {
var ValidateDomino = false
var Domino = (function() {
    var maxRow = 3, maxCol = 5;
    function isValidIndex(r, c) {
        if (typeof r == "number" && !isNaN(r)) {
            if (typeof c == "number" && !isNaN(c)) {
                if (r >=0 && r<maxRow && c>=0 && c<maxCol) {
                    return true;
                }
            }
        }
        return false;
    }
    function isValidDominoData(d) {
        if (ValidateDomino == false) {
            return true;
        }
        var validRowCount = 0;
        var validColCount = 0, validColCountStatus = false;
        var isRowIncremented = false;
        for (var i = 0; i < d.data.length; i++) {
            validColCount = 0;
            isRowIncremented = false;
            for (var j = 0; j < d.data[i].length; j++) {
                if (d.data[i][j] !== null) {
                    validColCount++;
                    if (isRowIncremented == false) {
                        validRowCount++;
                        isRowIncremented = true;
                    }
                }
                if (validColCount == 5) {
                    validColCountStatus = true;
                }
            }
        }
        if (validRowCount == maxRow && validColCountStatus) {
            return true;
        }
        return false;
    };
    function Domino(name) {
        var data = [];
        for (var i = 0; i < maxRow; i++) {
            data.push([]);
            for (var j = 0; j < maxCol; j++) {
                data[i].push(null);
            }
        }
        this.name = name;
        this.data = data;
        this.isValidData = isValidDominoData(this);
        return this;
    }
    Domino.prototype.setData = function(r, c, data) {
        if (isValidIndex(r,c)) {
            if (this.data[r][c] !== null) {
                var logText = "Data already present.";
                throw logText;
            }
            this.data[r][c] = data;
        } else {
            var logText = "Invalid index: r=" + r+", c="+c;
            console.log("Domino name: " + this.name);
            throw logText;
        }
        this.isValidData = isValidDominoData(this);
        return true;
    };
    Domino.prototype.setRowData = function(r, data) {
        if (typeof data == "object" && !isNaN(data.length)) {
            for (var i = 0; i < data.length; i++) {
                this.setData(r, i, data[i]);
            }
        }
        return true;
    };
    Domino.prototype.getData = function() {
        var response = [];
        for (var i = 0; i < this.data.length; i++) {
            response.push([]);
            for (var j = 0; j < this.data[i].length; j++) {
                if (this.data[i][j] !== null) {
                    response[i].push(this.data[i][j]);
                }
            }
        }
        if (this.isValidData) {
            return response;
        }
        console.log("Domino name: " + this.name);
        console.log(this.data);
        var logText = "Invalid Domino Data.";
        throw logText;
    };
    Domino.prototype.isValidDomino = function() {
        return this.isValidData;
    };
    Domino.prototype.enableValidate = function() {
        ValidateDomino = true;
        return ValidateDomino;
    };
    Domino.prototype.disableValidate = function() {
        ValidateDomino = false;
        return ValidateDomino;
    };
    Domino.prototype.getValidateStatus = function() {
        return ValidateDomino;
    };
    return Domino;
})();
var YardModel = function(selector, context) {
    return new YardModel.fn.init(selector, context);
};
YardModel.fn = YardModel.prototype = {
    constructor: YardModel,
    init: function(selector, context) {
        this.selector = selector;
        this.context = context;
        return this;
    }
};
ExtendObject(YardModel);

var lsKey = "displayYardDominoBoundary";
var keyMapping = {
    "displayYardDominoBoundary": "item1"
};
lsKey = keyMapping[lsKey];

var LS = $S.getLocalStorage();

YardModel.extend({
    getTableHtml: function(yardData, name) {
        var tableData = [];
        if (yardData && yardData[name]) {
            tableData = yardData[name];
        }
        if (ValidateDomino) {
            /* Checking data intigrity.*/
            var d = new Domino(name);
            for (var i = 0; i < tableData.length; i++) {
                d.setRowData(i, tableData[i]);
            }
            tableData = d.getData();
            /* Checking data intigrity End.*/
        }
        var table = $S.getTable(tableData, name);
        return table.getHtml();
    },
    getYardTableContent: function(yardComponent, requiredContent) {
        var tableContent = [];
        for (var i = 0; i < requiredContent.length; i++) {
            var curData = [];
            for (var j = 0; j < requiredContent[i].length; j++) {
                if (requiredContent[i][j] == "") {
                    curData.push("");
                } else {
                    curData.push(YardModel.getTableHtml(yardComponent, requiredContent[i][j]));
                }
            }
            tableContent.push(curData);
        }
        return tableContent;
    },
    enableDomino: function () {
        var domino = new Domino();
        domino.enableValidate();
        return true;
    },
    disableDomino: function () {
        var domino = new Domino();
        domino.disableValidate();
        return false;
    },
    getDisplayYardDominoBoundary: function() {
        var lsValue = LS.get(lsKey);
        var response = false;
        if (lsValue.status && lsValue.value == "true") {
            response = true;
        }
        return response;
    },
    toggleDisplayYardDominoBoundary: function() {
        if (this.getDisplayYardDominoBoundary()) {
            LS.set(lsKey, false);
        } else {
            LS.set(lsKey, true);
        }
        return this.getDisplayYardDominoBoundary();
    }
});
YardModel.extend({
    loadJsonData: function(urls, eachApiCallback, callBack, apiName) {
        if ($S.isArray(urls) == false) {
            if ($S.isFunction(eachApiCallback)) {
                eachApiCallback(null, apiName);
            }
            if ($S.isFunction(callBack)) {
                callBack();
            }
            return false;
        }
        var apiSendCount = urls.length, apiReceiveCount = 0;
        var ajax = {};
        ajax.type = "json";
        ajax.dataType = "json";
        for (var i = 0; i < urls.length; i++) {
            ajax.url = urls[i];
            $.ajax({url: ajax.url,
                success: function(response, textStatus) {
                    apiReceiveCount++;
                    if ($S.isFunction(eachApiCallback)) {
                        eachApiCallback(response, apiName);
                    }
                    if (apiSendCount == apiReceiveCount) {
                        if ($S.isFunction(callBack)) {
                            callBack();
                        }
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.log("Error in api: " + apiName);
                    apiReceiveCount++;
                    if ($S.isFunction(eachApiCallback)) {
                        eachApiCallback(null, apiName);
                    }
                    if (apiSendCount == apiReceiveCount) {
                        if ($S.isFunction(callBack)) {
                            callBack();
                        }
                    }
                }
            });
        }
        return true;
    }
});
YardModel.extend({
    getUrlAttribute: function(name, defaultValue) {
        return $S.getUrlAttribute(window.location.href, name, defaultValue);
    }
});
window.YardModel = window.$YM = YardModel;
})($S);
