(function(window, $M, $YApiModel) {

$M.extend({
    "S1-RECR": function(name) {
        var newValue = 0;
        if ($M.isDown("S1-HR")) {
            newValue = 1;
        }
        $M.setValue(name, newValue);
    }
});

$M.extend({
    "setValueChangedCallback": function(name, oldValue, newValue) {
        return $M.reCheckAllValues();
    }
});

var RequestId = $M.getRequestId();

var Controller = function(selector, context) {
    return new Controller.fn.init(selector, context);
};
/*
Direct access by id: $C("id").get()
*/
Controller.fn = Controller.prototype = {
    constructor: Controller,
    init: function(selector, context) {
        if (typeof selector === "string") {
            this.signalNum = selector;
        }
        if (selector === "string" && context === "signal") {
            this.signalNum = selector;
        }
        return this;
    }
};

ExtendObject(Controller);

Controller.extend({
    documentLoaded: function() {
        var possibleValues = $M.getPossibleValuesFromComponentModel();
        var currentValues = $M.getCurrentValuesFromComponentModel();
        $M().setPossibleValues(possibleValues);
        $M().initializeCurrentValues(currentValues);
        var allExpressions = [], exps = {};
        allExpressions.push($M.getSignalExpressionsFromComponentModel());
        allExpressions.push($M.getPointExpressionsFromComponentModel());
        for (var i = 0; i < allExpressions.length; i++) {
            exps = allExpressions[i];
            for (var key in exps) {
                if ($M.isArray(exps[key])) {
                    for (var j = 0; j < exps[key].length; j++) {
                        if ($M.isObject(exps[key][j])) {
                            $M(key).addExp($M.generateExpression(exps[key][j]));
                        } else {
                            $M(key).addExp(exps[key][j]);
                        }
                    }
                } else if ($M.isObject(exps[key])) {
                    $M(key).addExp($M.generateExpression(exps[key]));
                }
            }
        }
        var debugRequired = [];
        // debugRequired.push("1-ASR");
        for (var i = 0; i < debugRequired.length; i++) {
            $M(debugRequired[i]).addDebug();
        }
        $M.reCheckAllValues();
        return 0;
    }
});
Controller.extend({
    getPossibleValues: function() {
        return $M.getPossibleValues();
    },
    setValues: function(name, value) {
        $M.setValue(name, value);
        return 0;
    },
    toggleValues: function(name) {
        $M.toggleValue(name);
        return $M(name).get();
    },
    getSignalClass: function(name, aspect) {
        return $M.isUp(name) ? "active" : "";
    },
    getIndicationClass: function(name) {
        return $M.isUp(name) ? "active" : "";
    },
    getTableHtml: function(tableId) {
        var tableContent = $M.getYardFromYardModel();
        var table = $M.getTable(tableContent, tableId);
        return table.getHtml();
    },
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
        return "";
    },
    addSignalClass: function() {
        var signals = ["S1-RECR", "S1-HECR", "S1-DECR", "S2-RECR", "S2-HECR",
                        "S3-RECR", "S3-HECR", "S3-DECR", "S4-RECR", "S4-HECR",
                        "S13-RECR", "S13-HECR", "S13-DECR", "S14-RECR", "S14-HECR",
                        "S15-RECR", "S15-HECR", "S15-DECR", "S16-RECR", "S16-HECR"];
        for (var i=0; i <signals.length; i++) {
            $("#"+signals[i]).removeClass("active").addClass(Controller.getSignalClass(signals[i]));
        }
    }
});



var yardComponent = {};
var tableContent = [];

var topLoopLine = ["","","left-top", "8-point-top", "s14-tpr", "l-tpr-1", "l-tpr-2", "s2-tpr", "right-top"];
var topLoopPoint = ["","","","8-point-mid","","","","9-point-mid-1","9-point-mid"];
var mainLine = ["1-tpr", "16-tpr", "8-tpr", "8c-tpr", "s15-tpr", "m-tpr-1", "m-tpr-2", "s3-tpr", "9d-tpr", "9-tpr", "4-tpr"];
var bottomLoopLine = ["","","","","",""];
// bottomLoopLine.push("tc");
var requiredContent = [];
requiredContent.push(topLoopLine);
requiredContent.push(topLoopPoint);
requiredContent.push(mainLine);
requiredContent.push(bottomLoopLine);

Controller.extend({
    loadApiData: function(yardApiUrl, callBack) {
        var verifyFromDomino = true;
        if (verifyFromDomino) {
            $YApiModel.enableDomino();
        }
        var apiUrl = [yardApiUrl+"?"+RequestId];
        $M.loadJsonData($, apiUrl, function(response) {
            if (response) {
                for (var key in response) {
                    Object.assign(yardComponent, response[key]);
                }
            }
            tableContent = $YApiModel.getYardTableContent(yardComponent, requiredContent);
            callBack();
        });
        return true;
    },
    getYardHtml: function() {
        var table = $M.getTable(tableContent, "yard");
        return table.getHtml();
    },
    getDisplayYardDominoBoundary: function() {
        return $YApiModel.getDisplayYardDominoBoundary();
    },
    toggleDisplayYardDominoBoundary: function() {
        return $YApiModel.toggleDisplayYardDominoBoundary();
    }
});

/*End of direct access of methods*/
window.$VC = Controller;
})(window, $M, $YApiModel);
