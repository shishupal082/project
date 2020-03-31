(function($M) {

var LoggerInfo = $M.getScriptFileNameRef();
var reChekingVersion = "v2";
var RequestId = $M.getRequestId();
var AsyncData = {};

$M.extend({
    changeValueCallback: function(key, oldValue, newValue) {
        if ($M.isArray(AsyncData[key])) {
            for (var i = 0; i < AsyncData[key].length; i++) {
                $M.setValueWithExpressionV2(AsyncData[key][i]);
            }
        }
        return 1;
    }
});

if (reChekingVersion != "v2") {
    $M.extend({
        setValueChangedCallback: function(key, oldValue, newValue) {
            $M.reCheckAllValues();
            return 0;
        }
    });
}
var S17Model = function(selector, context) {
    return new S17Model.fn.init(selector, context);
};
S17Model.fn = S17Model.prototype = {
    constructor: S17Model,
    init: function(selector, context) {
        this.selector = selector;
        this.context = context;
        return this;
    }
};

ExtendObject(S17Model);
S17Model.extend({
    loadAsyncData: function(callBack) {
        var urls = [];
        urls.push("/app/yard-s17/static/json/async-data.json");
        for (var i = 0; i < urls.length; i++) {
            urls[i] = urls[i] + "?" + RequestId;
        }
        $M.loadJsonData($, urls, function(response) {
            if ($M.isObject(response)) {
                AsyncData = response;
            } else {
                $M.log("Invalid response (asyncData):" + response, LoggerInfo);
            }
        }, callBack);
    }
});
S17Model.extend({
    getRecheckingVersion: function() {
        return reChekingVersion;
    },
    reCheckAllValues: function() {
        if (reChekingVersion == "v2") {
            $M.setVariableDependencies();
            $M.addInMStack($M.getPossibleValues());
            $M.reCheckAllValuesV2();
        } else {
            $M.reCheckAllValues();
        }
        return true;
    }
});

window.S17Model = window.$S17M = S17Model;
})($M);
