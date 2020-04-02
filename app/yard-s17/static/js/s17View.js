(function($M, $YH, $YApiModel) {

var LoggerInfo = $S.getScriptFileNameRef();

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

var topLoopLineText = ["","","","","", "ll-text", "p-6-text"];
var topLoopLine = ["","","","","4B-tpr", "ll-tpr", "ll-tpr-sh", "sdg-tpr-0", "sdg-tpr"]
var topLoopPoint = ["","","","","4-point-mid","5-point-mid","5-point-mid-2"]
var mainLine = ["1A-tpr","1-tpr", "9-tpr", "10/11-tpr", "4A-tpr", "ml-tpr", "5A-tpr", "2/3-tpr", "13-tpr", "12-tpr", "12A-tpr"];

var requiredContent = [];
requiredContent.push(topLoopLineText);
requiredContent.push(topLoopLine);
requiredContent.push(topLoopPoint);
requiredContent.push(mainLine);

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
        return $YH.getDisplayYardDominoBoundary();
    },
    toggleDisplayYardDominoBoundary: function() {
        return $YH.toggleDisplayYardDominoBoundary();
    }
});
View.extend({
    getTprClass: function(name) {
        if ($M.isDown(name)) {
            return "btn-danger";
        }
        return "";
    }
});
View.extend({
    loadYardDisplayData: function(callBack) {
        var apiUrl = ["/app/yard-s17/static/json/yard.json?"+requestId];
        $M.loadJsonData($, apiUrl, function(response) {
            if (response) {
                for (var key in response) {
                    Object.assign(yardComponent, response[key]);
                }
            }
        }, function() {
            tableContent = $YH.getYardTableContent(yardComponent, requiredContent);
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
                        node.addClass($V.getTprClass(key));
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
            "S2-RECR","S2-HECR","S2-DECR",
            "S11-RECR","S11-HECR","S11-DECR",
            "S12-RECR","S12-HECR","S12-DECR",
            "S3-RECR","S3-HECR",
            "S9-RECR","S9-HECR",
            "S10-RECR","S10-HECR",
            "S13-RECR","S13-HECR",
            "SH7-RECR","SH7-HECR",
            "SH8-RECR","SH8-HECR"];
        var signalClass = "";
        for (var i=0; i <signals.length; i++) {
            signalClass = $M.isUp(signals[i]) ? "active" : "";
            $("#"+signals[i]).removeClass("active").addClass(signalClass);
        }
        return 1;
    }
});

window.View = window.$V = View;
})($M, $YH, $YApiModel);
