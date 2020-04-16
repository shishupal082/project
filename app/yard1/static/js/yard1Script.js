$(document).ready(function() {

var yardApiUrl = UIYardUrl;

$M.changeSetValueCountLimit(UISetValueCountLimit);
$M.enableChangeValueDataLogging();
$VC.documentLoaded();

var timerCount = 0;

function checkDominoDisplayStatus() {
    if ($VC.getDisplayYardDominoBoundary()) {
        $("#tableHtml").addClass("display-domino");
    } else {
        $("#tableHtml").removeClass("display-domino");
    }
    return true;
}
function checkUIStyle() {
    var possibleValues = $VC.getPossibleValues();
    for (var i=0; i<possibleValues.length; i++) {
        var key = possibleValues[i];
        try {
            var node = $("#yard").find("."+key);
            if (node.length) {
                if (node.hasClass("tpr")) {
                    node.removeClass("btn-warning");
                    node.removeClass("btn-danger");
                    node.addClass($VC.getTprClass(key));
                } else if (node.hasClass("indication")) {
                    node.removeClass("active");
                    node.addClass($VC.getIndicationClass(key));
                }
            }
        } catch(err) {
            // console.log("JQUERY error for node: " + key);
        }
    }
    // $("#timerCount").html(timerCount);
    $VC.addSignalClass();
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
            $VC.setValues(key, 0);
            checkUIStyle();
            if (timerCount == 0) {
                $YApiModel.displayChangeValueData();
            }
        }, 1000);
    }
    for(var key in finalValue) {
        $VC.setValues(key, finalValue[key]);
        // checkUIStyle();
        //Activate timer for signal+route button press and manual point operation
        if (currentTarget.hasClass("signal_route_btn") || currentTarget.hasClass("point-change-request")) {
            activateTimers(key);
        }
    }
    for (var i = 0; i < toggleValues.length; i++) {
        $VC.toggleValues(toggleValues[i]);
    }
    checkUIStyle();
    $YApiModel.displayChangeValueData();
    $M.resetChangeValueData();
    console.log("Click event completed: " + $M.getSetValueCount());
}
$("#toggleDisplayDomino").on("click", function(e) {
    $VC.toggleDisplayYardDominoBoundary();
    checkDominoDisplayStatus();
});

$VC.loadApiData(yardApiUrl, function() {
    var tableHtml = $VC.getYardHtml();
    $("#tableHtml").addClass("table-html").html(tableHtml);
    $(".evt").on("click", function(e) {
        $M.resetChangeValueData();
        evtClick($(e.currentTarget));
    });
    checkUIStyle();
    // $YApiModel.displayChangeValueData();
    // $M.resetChangeValueData();
    $("#help").removeClass("hide");
    checkDominoDisplayStatus();
});
});
