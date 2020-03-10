(function($S, $M, $YM) {

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
        return $YM.getDisplayYardDominoBoundary();
    },
    toggleDisplayYardDominoBoundary: function() {
        return $YM.toggleDisplayYardDominoBoundary();
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
    loadApiData: function(callBack) {
        var apiUrl = ["/app/yard-s14/static/json/yard-top.json?"+requestId,
                      "/app/yard-s14/static/json/yard-bottom.json?"+requestId];
        $YM.loadJsonData(apiUrl, function(response) {
            if (response) {
                for (var key in response) {
                    Object.assign(yardComponent, response[key]);
                }
            }
            tableContent = $YM.getYardTableContent(yardComponent, requiredContent);
        }, callBack);
        return true;
    },
    addPointIndicationClass: function(name) {
        var pointsIndicationName = ["101-WFK", "102-WFK", "103-WFK", "107-WFK", "108-WFK"];
        var pointCls = "";
        for (var i=0; i <pointsIndicationName.length; i++) {
            pointCls = $M.isUp(pointsIndicationName[i]) ? "btn-warning" : "";
            $("."+pointsIndicationName[i]).removeClass("btn-warning").addClass(pointCls);
        }
    },
    addSignalClass: function() {
        var signals = ["S1-RECR", "S1-HECR", "S1-DECR",
                        "S3-RECR", "S3-DECR",
                        "S4-RECR", "S4-HECR", "S4-DECR",
                        "S5-RECR", "S5-HECR",
                        "S6-RECR", "S6-HECR",
                        "S12-RECR", "S12-HECR",
                        "S13-RECR", "S13-HECR",
                        "S14-RECR", "S14-HECR", "S14-DECR",
                        "S15-RECR", "S15-DECR",
                        "S19-RECR", "S19-HECR", "S19-DECR"];
        var signalClass = "";
        for (var i=0; i <signals.length; i++) {
            signalClass = $M.isUp(signals[i]) ? "active" : "";
            $("#"+signals[i]).removeClass("active").addClass(signalClass);
        }
    }
});

window.View = window.$V = View;
})($S, $M, $YM);
