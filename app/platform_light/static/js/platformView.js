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

var topLoopLine = ["PF3", "", "", "S6", "", "", "S2"];
var requiredContent = [];
requiredContent.push(topLoopLine);
$M().setBinaryOperators(["+","*","~"]);
$M.enableChangeValueDataLogging();
View.extend({
    getYardHtml: function() {
        var table = $M.getTable(tableContent, "yard");
        return table.getHtml();
    },
    setValues: function(name, newValue, callback) {
        $M.setValue(name, newValue, callback);
        return $M(name).get();
    },
    toggleValues: function(name, callback) {
        return $M.toggleValue(name, callback);
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
        var apiUrl = ["/app/platform_light/static/json/yard-top.json?"+requestId];
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
        var signals = $YApiModel.getPossiblesValueByType("signal");
        // var signals = [
        //     "PF3_UECR", "PF3_RECR",
        //     "S6_UR_A","S6_UECR"
        // ];
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
