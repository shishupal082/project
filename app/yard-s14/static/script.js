$(document).ready(function() {

var timerCount = 0;

var apisPath = {};
var commonPath = {
    "possible-value": ["/app/yard-s14/static/json/common/items.json"],
    "initial-value": ["/app/yard-s14/static/json/initial-value.json"],
    "expressions": []
};

var type1Path = {
    "possible-value": ["/app/yard-s14/static/json/items.json"],
    "initial-value": [],
    "expressions": ["/app/yard-s14/static/json/expressions.json"]
};

var type2Path = {
    "possible-value": ["/app/yard-s14/static/json/type2/items.json"],
    "initial-value": [],
    "expressions": []
};

var version = $V.getUrlAttributeType("type2");

for (var key in commonPath) {
    apisPath[key] = commonPath[key];
    switch(version) {
        case "type1":
            apisPath[key] = apisPath[key].concat(type1Path[key]);
        break;
        case "type2":
            apisPath[key] = apisPath[key].concat(type2Path[key]);
        break;
    }
}

$C.setApisPath(apisPath);

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
