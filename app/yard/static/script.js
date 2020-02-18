$(document).ready(function() {
$YV.documentLoaded();
$V.documentLoaded();
var timerCount = 0;
var tableHtml = $YV.getYardHtml();
$("#tableHtml").addClass("table-html").html(tableHtml);

// $V.extend({
// 	table: function() {
// 		var table = $M.getTable([], "name");
// 		tIds = table.getProcessedTids();
// 		table.clearProcessedTids();
// 		for (var i=0; i<900; i++) {
// 			table.clearProcessedTids();
// 			console.log(table.getHtml());
// 		}
// 		table.setProcessedTids(tIds);
// 		console.log(tIds);
// 		return 0;
// 	}
// });
function checkDominoDisplayStatus() {
    if ($YV.getDisplayYardDominoBoundary()) {
        $("#tableHtml").addClass("display-domino");
    } else {
        $("#tableHtml").removeClass("display-domino");
    }
    return true;
}
function checkUIStyle() {
    var possibleValues = $V.getPossibleValues();
    for (var i=0; i<possibleValues.length; i++) {
        var key = possibleValues[i];
        try {
            var node = $("#yard").find("."+key);
            if (node.length) {
                if (node.hasClass("tpr")) {
                    node.removeClass("btn-warning");
                    node.removeClass("btn-danger");
                    node.addClass($V.getTprClass(key));
                } else if (node.hasClass("indication")) {
                    node.removeClass("btn-warning");
                    node.addClass($V.getIndicationClass(key));
                }
            }
        } catch(err) {
            // console.log("JQUERY error for node: " + key);
        }
    }
    // $("#timerCount").html(timerCount);
    $V.addSignalClass();
}
$("#toggleDisplayDomino").on("click", function(e) {
    $YV.toggleDisplayYardDominoBoundary();
    checkDominoDisplayStatus();
});
$(".evt").on("click", function(e) {
    if (timerCount != 0) {
        return;
    }
    var currentTarget = $(e.currentTarget);
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
});
checkUIStyle();
$("#help").removeClass("hide");
checkDominoDisplayStatus();
});
