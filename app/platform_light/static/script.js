$(document).ready(function() {

var timerCount = 0;

var apisPath = {};
var commonPath = {
    "possible-value": ["/app/platform_light/static/json/items.json"],
    "initial-value": ["/app/platform_light/static/json/initial-value.json"],
    "expressions": ["/app/platform_light/static/json/expressions.json"],
    "timer_bits": ["/app/platform_light/static/json/timer_bits.json"]
};

for (var key in commonPath) {
    apisPath[key] = commonPath[key];
}

$YApiModel.setJquery($);
$YApiModel.setApisPath(apisPath);

function checkUIStyle() {
    $V.addTprClass();
    $V.addSignalClass();
    $YApiModel.displayChangeValueData();
    $M.resetChangeValueData();
    // $V.addPointIndicationClass();
}
function evtClick (currentTarget) {
    if (timerCount != 0) {
        return;
    }
    var value = currentTarget.val();
    var valueArr = value.split(",");
    var finalValue = {}, toggleValues = [];
    for (var i = 0; i < valueArr.length; i++) {
        if (currentTarget.hasClass("toggle")) {
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
            $V.setValues(key, 0, function() {
                checkUIStyle();
            });
        }, 1000);
    }
    for(var key in finalValue) {
        $V.setValues(key, finalValue[key], function() {
            checkUIStyle();
        });
        // checkUIStyle();
        //Activate timer for signal+route button press and manual point operation
        if (currentTarget.hasClass("auto_reset")) {
            activateTimers(key);
        }
    }
    for (var i = 0; i < toggleValues.length; i++) {
        $V.toggleValues(toggleValues[i], function() {
            checkUIStyle();
        });
    }
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
    $M.reCheckAllValues();
    $V.loadApiData(function() {
        // $(".container").attr("style", "width: 1670px;")
        var tableHtml = $V.getYardHtml();
        $("#tableHtml").addClass("table-html").html(tableHtml);
        $(".evt").on("click", function(e) {
            evtClick($(e.currentTarget));
        });
        checkUIStyle();
        $("#help").removeClass("hide");
        checkDominoDisplayStatus();
    });
});

});
