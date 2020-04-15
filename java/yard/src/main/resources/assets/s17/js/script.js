$(document).ready(function() {
$M.changeSetValueCountLimit(800000);
var LoggerInfo = $S.getScriptFileNameRef();

// $M.disableChangeLogValueStatus();
$M.enableChangeValueDataLogging();
var timerCount = 0;

var apisPath = {};
var commonPath = {
    "async-data": ["/assets/s17/json/async-data.json"],
    "partial-expressions-value": ["/assets/s17/json/partial-exp.json"],
    "possible-value": ["/assets/s17/json/possible-values.json",
                        "/assets/s17/json/possible-values-sequence.json",
                        "/assets/s17/json/possible-values-group.json"],
    "initial-value": ["/assets/s17/json/initial-value.json"],
    "expressions": ["/assets/s17/json/expressions-evt.json",
                    "/assets/s17/json/expressions-common.json",
                    "/assets/s17/json/expressions-sequence-1.json",
                    "/assets/s17/json/expressions-sequence-2.json",
                    "/assets/s17/json/expressions-ov.json",
                    "/assets/s17/json/expressions-sub-routes.json",
                    "/assets/s17/json/expressions-points-common.json",
                    "/assets/s17/json/expressions-point-4.json",
                    "/assets/s17/json/expressions-point-5.json",
                    "/assets/s17/json/expressions-point-6.json",
                    "/assets/s17/json/expressions-timer.json",
                    "/assets/s17/json/expressions-glow.json"]
};

for (var key in commonPath) {
    apisPath[key] = commonPath[key];
}

$YApiModel.setApisPath(apisPath);

function checkUIStyle() {
    $V.addTprClass();
    $V.addSignalClass();
    $V.addPointIndicationClass();
}
function evtClick (currentTarget) {
    if (timerCount != 0) {
        return;
    }
    var value = currentTarget.val();
    var valueArr = value.split(",");
    var finalValue = {}, toggleValues = [];
    for (var i = 0; i < valueArr.length; i++) {
        if (currentTarget.hasClass("tpr")) {
            toggleValues.push(valueArr[i]);
        } else {
            var valItem = valueArr[i].split("=");
            if (valItem.length == 2) {
                finalValue[valItem[0]] = valItem[1];
            }
        }
    }
    function activateTimers(key) {
        timerCount++;
        checkUIStyle();
        setTimeout(function() {
            timerCount--;
            $V.setValues(key, 0);
            checkUIStyle();
            if (timerCount == 0) {
                $YApiModel.displayChangeValueData();
            }
        }, 1000);
    }
    for(var key in finalValue) {
        $V.setValues(key, finalValue[key]);
        // checkUIStyle();
        //Activate timer for signal+route button press and manual point operation
        if (currentTarget.hasClass("signal_route_btn") || currentTarget.hasClass("point-change-request")) {
            activateTimers(key);
        }
    }
    for (var i = 0; i < toggleValues.length; i++) {
        $V.toggleValues(toggleValues[i]);
    }
    checkUIStyle();
    $YApiModel.displayChangeValueData();
    $M.resetChangeValueData();
    console.log("Click event completed: " + $M.getSetValueCount());
    // $M.disableChangeLogValueStatus();
}
function checkDominoDisplayStatus() {
    if ($V.getDisplayYardDominoBoundary()) {
        $("#tableHtml").addClass("display-domino");
    } else {
        $("#tableHtml").removeClass("display-domino");
    }
    return true;
}
$("#toggleDisplayDomino").on("click", function(e) {
    $V.toggleDisplayYardDominoBoundary();
    checkDominoDisplayStatus();
});

var yardUrl = "/assets/s17/json/yard.json";

$YApiModel.documentLoaded(function() {
    $S17M.reCheckAllValues();
    $V.loadYardDisplayData(yardUrl, function() {
        $(".container").attr("style", "width: 1425px;")
        var tableHtml = $V.getYardHtml();
        $("#tableHtml").addClass("table-html").html(tableHtml);
        $(".evt").on("click", function(e) {
            $M.resetChangeValueData();
            // $M.enableChangeLogValueStatus();
            evtClick($(e.currentTarget));
        });
        checkUIStyle();
        $("#help").removeClass("hide");
        checkDominoDisplayStatus();
        // $M.disableChangeLogValueStatus();
    });
});

});
