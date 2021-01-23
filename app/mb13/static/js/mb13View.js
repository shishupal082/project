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

var row0 = ["0-0","0-1","0-2","0-3","0-4","0-5","0-6","0-7","0-8","0-9"];
var rowH = ["H-0","H-1","H-2","H-3","H-4","H-5","H-6","H-7","H-8","H-9"];
var rowG = ["G-0","G-1","G-2","G-3","G-4","G-5","G-6","G-7","G-8","G-9"];
var rowF = ["F-0","F-1","F-2","F-3","F-4","F-5","F-6","F-7","F-8","F-9"];
var rowE = ["E-0","E-1","E-2","E-3","E-4","E-5","E-6","E-7","E-8","E-9"];
var rowD = ["D-0","D-1","D-2","D-3","D-4","D-5","D-6","D-7","D-8","D-9"];
var rowC = ["C-0","C-1","C-2","C-3","C-4","C-5","C-6","C-7","C-8","C-9"];
var rowB = ["B-0","B-1","B-2","B-3","B-4","B-5","B-6","B-7","B-8","B-9"];
var rowA = ["A-0","A-1","A-2","A-3","A-4","A-5","A-6","A-7","A-8","A-9"];

var requiredContent = [];
requiredContent.push(row0);
requiredContent.push(rowH);
requiredContent.push(rowG);
requiredContent.push(rowF);
requiredContent.push(rowE);
requiredContent.push(rowD);
requiredContent.push(rowC);
requiredContent.push(rowB);
requiredContent.push(rowA);
requiredContent.push(row0);

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
        signals = $YApiModel.getPossiblesValueByType("panel-indication");
        signals = signals.concat($YApiModel.getPossiblesValueByType("gate-panel-indication"));
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
