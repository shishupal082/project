$(document).ready(function() {

var timerCount = 0;

function checkDominoDisplayStatus() {
    if ($V.getDisplayYardDominoBoundary()) {
        $("#tableHtml").addClass("display-domino");
    } else {
        $("#tableHtml").removeClass("display-domino");
    }
    return true;
}
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
}
$("#toggleDisplayDomino").on("click", function(e) {
    $V.toggleDisplayYardDominoBoundary();
    checkDominoDisplayStatus();
});
$C.documentLoaded(function() {
    $M.reCheckAllValues();
    $V.loadApiData(function() {
        $(".container").attr("style", "width: 1655px;")
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
