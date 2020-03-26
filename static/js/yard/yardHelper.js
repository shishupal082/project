/*
    - use localStorage to displayDominoBoundary
        - getDisplayYardDominoBoundary, toggleDisplayYardDominoBoundary
    - properly arrange table data for creating html
    - Verify each domino data if configured
    - loadJsonData for given api url
    - getUrlAttribute using stack
*/
(function($S) {
var ValidateDomino = false
var YardHelper = function(selector, context) {
    return new YardHelper.fn.init(selector, context);
};
YardHelper.fn = YardHelper.prototype = {
    constructor: YardHelper,
    init: function(selector, context) {
        this.selector = selector;
        this.context = context;
        return this;
    }
};
ExtendObject(YardHelper);

var lsKey = "displayYardDominoBoundary";
var keyMapping = {
    "displayYardDominoBoundary": "item1"
};
lsKey = keyMapping[lsKey];

var LS = $S.getLocalStorage();

function getTableHtml(yardData, name) {
    var tableData = [];
    if (yardData && yardData[name]) {
        tableData = yardData[name];
    }
    if (ValidateDomino) {
        /* Checking data intigrity.*/
        var d = $S.getDomino(name);
        for (var i = 0; i < tableData.length; i++) {
            d.setRowData(i, tableData[i]);
        }
        tableData = d.getData();
        /* Checking data intigrity End.*/
    }
    var table = $S.getTable(tableData, name);
    return table.getHtml();
}

YardHelper.extend({
    getYardTableContent: function(yardComponent, requiredContent) {
        var tableContent = [];
        for (var i = 0; i < requiredContent.length; i++) {
            var curData = [];
            for (var j = 0; j < requiredContent[i].length; j++) {
                if (requiredContent[i][j] == "") {
                    curData.push("");
                } else {
                    curData.push(getTableHtml(yardComponent, requiredContent[i][j]));
                }
            }
            tableContent.push(curData);
        }
        return tableContent;
    },
    enableDomino: function () {
        ValidateDomino = true;
        return true;
    },
    disableDomino: function () {
        ValidateDomino = false;
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
function apiCall(ajax, callBack) {
    $.ajax({url: ajax.url,
        success: function(response, textStatus) {
            callBack(ajax, "SUCCESS", response);
        },
        error: function(xhr, textStatus, errorThrown) {
            callBack(ajax, "FAILURE", null);
        }
    });
}
YardHelper.extend({
    loadJsonData: function(urls, eachApiCallback, callBack, apiName) {
        return $S.loadJsonData(apiCall, urls, eachApiCallback, callBack, apiName);
    }
});
YardHelper.extend({
    getUrlAttribute: function(name, defaultValue) {
        return $S.getUrlAttribute(window.location.href, name, defaultValue);
    }
});
window.YardHelper = window.$YH = YardHelper;
})($S);
