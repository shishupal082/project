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
var zeroClass = "zero";
var oneClass = "one";
function setButtonProperty(currentTarget, key, value) {
    if (value === "1" || value === 1) {
        // currentTarget.removeClass(oneClass);
        currentTarget.addClass(zeroClass);
        currentTarget.val(key+"=0");
    } else {
        currentTarget.removeClass(zeroClass);
        // currentTarget.addClass(oneClass);
        currentTarget.val(key+"=1");
    }
}
function setButtonPropertyV2(id) {
    var currentTarget = $("#"+id);
    currentTarget.removeClass(zeroClass);
    currentTarget.val(id+"=1");
}
function evtClick (currentTarget) {
    if (timerCount != 0) {
        return;
    }
    var value = currentTarget.val();
    var valueArr = value.split(",");
    var finalValue = {}, toggleValues = [];
    var buttonRelease = [];
    for (var i = 0; i < valueArr.length; i++) {
        if (currentTarget.hasClass("tpr")) {
            toggleValues.push(valueArr[i]);
        } else if (currentTarget.hasClass("event_btn")) {
            var valItem = valueArr[i].split("=");
            finalValue[valItem[0]] = valItem[1];
            setButtonProperty(currentTarget, valItem[0], valItem[1]);
            if (currentTarget.hasClass("toggle")) {
                buttonRelease.push(valItem[0]);
            }
        }
    }
    for(var key in finalValue) {
        $V.setValues(key, finalValue[key]);
        // checkUIStyle();
    }
    for (var i = 0; i < toggleValues.length; i++) {
        $V.toggleValues(toggleValues[i]);
    }
    for (var i = 0; i < buttonRelease.length; i++) {
        $V.setValues(buttonRelease[i], 0);
        setButtonPropertyV2(buttonRelease[i]);
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
        $(".container").attr("style", "width: 1200px;")
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
