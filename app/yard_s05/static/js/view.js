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

var topLoopLine = ["Common-bits", "Track-bits", "Shunt-signal", "Main-signal"];
var requiredContent = [];
requiredContent.push(topLoopLine);
$M().setBinaryOperators(["+","*","~"]);
$M.enableChangeValueDataLogging();
var dataLoadStatus = "not-started";
var bitMapping = {};

var indicationBitMapping = {};
View.extend({
    setClassNameMapping: function(fileResponse) {
        var temp, key, logicEquation, value, className;
        if ($S.isArray(fileResponse)) {
            for (var i=0; i<fileResponse.length; i++) {
                temp = fileResponse[i].split(",");
                if (temp.length === 4) {
                    key = temp[0];
                    logicEquation = temp[1];
                    value = temp[2];
                    className = temp[3];
                    if (!$S.isArray(indicationBitMapping[key])) {
                        indicationBitMapping[key] = [];
                    }
                    indicationBitMapping[key].push({"key": key, "logicEquation": logicEquation, value: value, "className": className});
                }
            }
        }
    }
});
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
    },
    generateBitMapping: function(response) {
        var possibleKeys = $YApiModel.getPossibleKeys();
        if ($S.isString(response)) {
            if (response.length === possibleKeys.length) {
                for (var i=0; i<possibleKeys.length; i++) {
                    bitMapping[possibleKeys[i]] = response.charAt(i) === '1' ? '1' : '0';
                }
            }
        }
    }
});
View.extend({
    loadYardData: function(callBack) {
        var apiUrl = ["/app/yard_s05/data/ui/yard-top.json?"+requestId];
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
    loadApiData: function(callback) {
        if (dataLoadStatus === "in-progress") {
            return;
        }
        var url = "http://localhost:3000/get_bit_status";
        dataLoadStatus = "in-progress";
        $S.loadJsonData($, [url], function(response, apiName, ajax) {
            if ($S.isObject(response) && $S.isArray(response.data)) {
                if (response.data.length === 1 && $S.isObject(response.data[0])) {
                    if (true || currentBitUpdateId !== response.data[0]["bit_update_id"]) {
                        if ($S.isStringV2(response.data[0]["bit_status"])) {
                            $V.generateBitMapping(response.data[0]["bit_status"]);
                        }
                    }
                }
            }
            dataLoadStatus = "completed";
            $S.callMethod(callback);
        });
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
    _isLogicTrue: function(logic, value) {
        if (bitMapping[logic] === value) {
            return true;
        }
        return false;
    },
    renderData: function(response) {
        // var displayKeys = $YApiModel.getDisplayKeys();
        // var displayClass = "";
        // for (var i=0; i <displayKeys.length; i++) {
        //     if ($S.isBooleanTrue(bitMapping[displayKeys[i]])) {
        //         displayClass = "active";
        //     } else {
        //         displayClass = "";
        //     }
        //     $("#"+displayKeys[i]).removeClass("active").addClass(displayClass);
        // }
        var className;
        for (var key in indicationBitMapping) {
            if ($S.isArray(indicationBitMapping[key])) {
                for (var i=0; i<indicationBitMapping[key].length; i++) {
                    className = indicationBitMapping[key][i].className;
                    if (this._isLogicTrue(indicationBitMapping[key][i].logicEquation, indicationBitMapping[key][i].value)) {
                        $("#"+key).addClass(className);
                    } else {
                        $("#"+key).removeClass(className);
                    }
                }
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
        var signals = $YApiModel.getInputKeys();
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
    },
    startTimer: function() {
        setInterval(function() {
            // $V.toggleValues("FLASH");
            $V.loadApiData(function() {
                $V.renderData();
            });
        }, 1000);
    }
});

window.View = window.$V = View;
})($M, $YH, $YApiModel);
