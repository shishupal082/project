(function($M, $YApiModel) {

var LoggerInfo = $S.getScriptFileNameRef(location);
$M.addCallbackSetValueCountLimitExceed(function() {
    $("#alarm").html("Limit Exceeds.");
});
var View = function(selector, context) {
    return new View.fn.init(selector, context);
};
View.fn = View.prototype = {
    constructor: View,
    init: function(selector, context) {
        this.selector = selector;
        this.context = context;
        return this;
    }
};

ExtendObject(View);

var yardComponent = {};
var tableContent = [];
var requestId = $M.getRequestId();

var topLoopLine = ["rjp-siding","top-loop"];
var topLoopPoint = ["","top-mid-point"];
var mainLine = ["S2","ml","S1","S21"];
var bottomLoopPoint = ["","bottom-mid-point"];
var bottomLoop = ["","bottom-loop"];

var requiredContent = [];
requiredContent.push(topLoopLine);
requiredContent.push(topLoopPoint);
requiredContent.push(mainLine);
requiredContent.push(bottomLoopPoint);
requiredContent.push(bottomLoop);

View.extend({
    getYardHtml: function() {
        var table = $M.getTable(tableContent, "yard");
        return table.getHtml();
    },
    setValues: function(name, value) {
        $M.setValue(name, value);
        return $M(name).get();
    },
    toggleValues: function(name) {
        return $M.toggleValue(name);
    },
    getDisplayYardDominoBoundary: function() {
        return $YApiModel.getDisplayYardDominoBoundary();
    },
    toggleDisplayYardDominoBoundary: function() {
        return $YApiModel.toggleDisplayYardDominoBoundary();
    },
    reCheckAllValues: function() {
        $M.setVariableDependencies();
        $M.addInMStack($M.getPossibleValues());
        $M.reCheckAllValuesV2();
        return true;
    }
});
View.extend({
    getTprClass: function(name) {
        if ($M.isValidKey(name + "-R")) {
            if ($M.isUp(name + "-R")) {
                return "btn-danger";
            }
        }
        if ($M.isValidKey(name + "-Y")) {
            if ($M.isUp(name + "-Y")) {
                return "btn-warning";
            }
        }
        if ($M.isDown(name)) {
            // return "btn-danger";
        }
        return "";
    }
});
View.extend({
    loadYardDisplayData: function(yardUrl, callBack) {
        var apiUrl = [yardUrl+"?"+requestId];
        $M.loadJsonData($, apiUrl, function(response) {
            if (response) {
                for (var key in response) {
                    Object.assign(yardComponent, response[key]);
                }
            }
        }, function() {
            tableContent = $YApiModel.getYardTableContent(yardComponent, requiredContent);
            callBack();
        });
        return true;
    },
    addTprClass: function(name) {
        var tprNames = $YApiModel.getPossiblesValueByType("tpr");
        tprNames = tprNames.concat($YApiModel.getPossiblesValueByType("tpr-class"));
        for (var i=0; i<tprNames.length; i++) {
            var key = tprNames[i];
            var keyClass = key.replace("/", "_");
            try {
                var node = $("#yard").find("."+keyClass);
                if (node.length) {
                    if (node.hasClass("tpr")) {
                        node.removeClass("btn-warning");
                        node.removeClass("btn-danger");
                        node.addClass(View.getTprClass(key));
                    }
                }
            } catch(err) {
                console.log("JQUERY error for node: " + key);
            }
        }
        return 1;
    },
    addPointIndicationClass: function(name) {
        var pointsIndicationName = $YApiModel.getPossiblesValueByType("pointIndication");
        var pointCls = "";
        for (var i=0; i <pointsIndicationName.length; i++) {
            pointCls = $M.isUp(pointsIndicationName[i]) ? "active" : "";
            $("."+pointsIndicationName[i]).removeClass("active").addClass(pointCls);
        }
        return 1;
    },
    addSignalClass: function() {
        var signals = [];
        // signals = $YApiModel.getPossiblesValueByType("signal");
        signals = ["S1-RECR","S1-HECR","S1-DECR",
            "S1-Co-RECR","S1-Co-HECR",
            "S2-Co-RECR","S2-Co-HECR",
            "S2-RECR","S2-HECR","S2-DECR",
            "S21-RECR","S21-HECR",
            "S22-RECR","S22-HECR",
            "S9-RECR","S9-HECR","S9-DECR",
            "S10-RECR","S10-HECR","S10-DECR",
            "S11-RECR","S11-HECR",
            "S12-RECR","S12-HECR",
            "S13-RECR","S13-HECR",
            "S14-RECR","S14-HECR",
            "SH5-RECR","SH5-HECR",
            "S6-RECR",
            "SH6-RECR","SH6-HECR",
            "SH8-RECR","SH8-HECR",
            "SH9-RECR","SH9-HECR",
            "SH10-RECR","SH10-HECR",
            "SH11-RECR","SH11-HECR",
            "SH12-RECR","SH12-HECR",
            "SH13-RECR","SH13-HECR",
            "SH14-RECR","SH14-HECR"];
        var signalClass = "";
        for (var i=0; i <signals.length; i++) {
            signalClass = $M.isUp(signals[i]) ? "active" : "";
            $("#"+signals[i]).removeClass("active").addClass(signalClass);
        }
        return 1;
    }
});

window.$V = View;
})($M, $YApiModel);
