$(document).ready(function() {

var yardApiUrl = UIYardUrl;

$M.changeSetValueCountLimit(UISetValueCountLimit);

var LoggerInfo = $S.getScriptFileNameRef(location);

// $M.disableChangeLogValueStatus();
$M.enableChangeValueDataLogging();
var timerCount = 0;

var apisPath = {};

for (var key in UICommonPath) {
    apisPath[key] = UICommonPath[key];
}

$YApiModel.setJquery($);
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

$YApiModel.documentLoaded(function() {
    $V.reCheckAllValues();
    $V.loadYardDisplayData(yardApiUrl, function() {
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
