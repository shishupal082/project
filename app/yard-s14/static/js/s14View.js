(function($M, $YH, $YApiModel) {

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

var topLoopLine = ["","","","","216-tpr-top-4","LP2-tpr","LP2-tpr-sh"];
var topLoopPoint = ["","","","","216-tpr-top-3","216-tpr-top-1","216-tpr-top-2"]
var mainLine = ["201-tpr","202-tpr","204-tpr","205-tpr","205-tpr-1","UD-Mn-tpr","216-tpr","217-tpr","218-tpr","219-tpr"]
var bottomLoopPoint = ["","","","101-point","101-point-1","","108-point"];
var bottomLoopLine = ["","","","LP1-tpr-sh","LP1-tpr-pre","LP1-tpr", "108-point-B"];
var sdgLine = ["","","","","","siding-point"];
var requiredContent = [];
requiredContent.push(topLoopLine);
requiredContent.push(topLoopPoint);
requiredContent.push(mainLine);
requiredContent.push(bottomLoopPoint);
requiredContent.push(bottomLoopLine);
requiredContent.push(sdgLine);

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
    },
    getUrlAttributeType: function(defaultType) {
        var type = $YH.getUrlAttribute("type");
        if (["type1","type2"].indexOf(type) >= 0) {
            return type;
        }
        return defaultType;
    }
});
View.extend({
    loadApiData: function(callBack) {
        var apiUrl = ["/app/yard-s14/static/json/yard-top.json?"+requestId,
                      "/app/yard-s14/static/json/yard-bottom.json?"+requestId];
        $YH.loadJsonData(apiUrl, function(response) {
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
        // var tprNames = $YApiModel.getTprNames();
        var tprNames = [
                "201-TPR", "202-TPR", "204-TPR",
                "205-TPR", "207-TPR", "LP1-TPR", "M-TPR", "LP2-TPR",
                "215-TPR", "216-TPR", "217-TPR", "218-TPR", "219-TPR"
            ];
        for (var i=0; i<tprNames.length; i++) {
            var key = tprNames[i];
            try {
                var node = $("#yard").find("."+key);
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
        // var pointsIndicationName = $YApiModel.getPointIndicationNames();
        var pointsIndicationName = ["101-WFK", "102-WFK", "103-WFK", "107-WFK", "108-WFK"];
        var pointCls = "";
        for (var i=0; i <pointsIndicationName.length; i++) {
            pointCls = $M.isUp(pointsIndicationName[i]) ? "active" : "";
            $("."+pointsIndicationName[i]).removeClass("active").addClass(pointCls);
        }
        return 1;
    },
    addSignalClass: function() {
        // var signals = $YApiModel.getSignalNames();
        var signals = [
            "S1-RECR", "S1-HECR", "S1-DECR",
            "S3-RECR", "S3-DECR",
            "S4-RECR", "S4-HECR", "S4-DECR",
            "S5-RECR", "S5-HECR",
            "S6-RECR", "S6-HECR",
            "S12-RECR", "S12-HECR",
            "S13-RECR", "S13-HECR",
            "S14-RECR", "S14-HECR", "S14-DECR",
            "S15-RECR", "S15-DECR",
            "S19-RECR", "S19-HECR", "S19-DECR",
            "SH2-RECR","SH2-HECR",
            "SH16-RECR","SH16-HECR"
        ];
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
