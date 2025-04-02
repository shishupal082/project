var DATA = {};
$(document).ready(function() {
DATA = new Data();
var valueToDisplay = [];
var timerCount = 0;
valueToDisplay = valueToDisplay.concat(DATA.availableASRs);
valueToDisplay = valueToDisplay.concat(DATA.miscs);
valueToDisplay = valueToDisplay.concat(DATA.availableTSRs);
valueToDisplay = valueToDisplay.concat(DATA.availableNNRs);
valueToDisplay = valueToDisplay.concat(DATA.availableNRRs);
valueToDisplay = valueToDisplay.concat(DATA.availableGNRs);
valueToDisplay = valueToDisplay.concat(DATA.availableUNRs);
function checkUIStyle() {
    var possibleValues = DATA.possibleValues;
    for (var i=0; i<possibleValues.length; i++) {
        var key = possibleValues[i];
        if (key == "8-TPR-C") {
            // console.log("11");
        }
        try {
            var node = $("#" + key);
            if (node.length) {
                if (node.hasClass("tpr")) {
                    node.removeClass("btn-warning");
                    node.removeClass("btn-danger");
                    node.addClass(DATA.getTprClass(key));
                }
            }
        } catch(err) {
            // console.log("JQUERY error for node: " + key);
        }
    }
    var tableHtml = '<div>' + timerCount + '</div>';
    tableHtml += '<div><table class="table table-striped">';
    for (var i = 0; i < Math.ceil(valueToDisplay.length/8); i++) {
        tableHtml += "<tr>";
        var maxLimit = (8*(i+1) > valueToDisplay.length ? valueToDisplay.length : 8*(i+1));
        for(var j = 8*i; j<maxLimit; j++) {
            var colClass = "badge-danger alert-danger";
            if ($M(valueToDisplay[j]).isUp()) {
                colClass = "";
            }
            tableHtml += '<td><span class="badge ' + colClass + '">' + valueToDisplay[j] + " = " + $M(valueToDisplay[j]).get() + "</span></td>";
        }
        tableHtml += "</tr>";
    }
    tableHtml += "</table></div>";
    $("#currentValues").html(tableHtml);
    if ($M.isAllUp(["S1-HR", "S1-DR", "S3-DR"])) {
        $(".s1-signal-red").removeClass("alert-danger");
        $(".s1-signal-yellow").removeClass("alert-warning");
        $(".s1-signal-green").addClass("alert-success");
    } else if($M("S1-HR").isUp()) {
        $(".s1-signal-red").removeClass("alert-danger");
        $(".s1-signal-yellow").addClass("alert-warning");
        $(".s1-signal-green").removeClass("alert-success");
    } else {
        $(".s1-signal-red").addClass("alert-danger");
        $(".s1-signal-yellow").removeClass("alert-warning");
        $(".s1-signal-green").removeClass("alert-success");
    }
}

$(".evt").on("click", function(e) {
    if (timerCount != 0) {
        return;
    }
    var currentTarget = $(e.currentTarget);
    var value = currentTarget.val();
    var valueArr = value.split(",");
    var finalValue = {};
    for (var i = 0; i < valueArr.length; i++) {
        var valItem = valueArr[i].split("=");
        if (valItem.length == 2) {
            //Change value of field only for tpr
            if (currentTarget.hasClass("tpr")) {
                currentTarget.val(valItem[0] + "=" + (valItem[1]=="1"?"0": "1"));
            }
            finalValue[valItem[0]] = valItem[1];
        }
    }
    function activateTimers(key) {
        timerCount++;
        checkUIStyle();
        setTimeout(function() {
            timerCount--;
            DATA.setValues(key, 0);
            checkUIStyle();
        }, 1000);
    }
    for(var key in finalValue) {
        if (["8-NWKR-request", "8-RWKR-request"].indexOf(key) >=0) {
            if (!DATA.isPointFree("8")) {
                alert("This point is locked.");
                continue;
            }
        }
        DATA.setValues(key, finalValue[key]);
        checkUIStyle();
        //Activate timer only for signal+route button press
        if (currentTarget.hasClass("signal_route_btn") || currentTarget.hasClass("point-change-request")) {
            activateTimers(key);
        }
    }

});
checkUIStyle();

/*
S1-ASR(dn) || S1A-ASR(dn) || S30-ASR(dn) || S30A-ASR(dn) --> 13-NWKR(up) --> UM-TPR(up) --> Yellow
                                                         --> 13-RWKR(up) || 20-RWKR(up)  --> CL-TPR(up) --> Yellow
                                                         --> 20-NWKR(up) || 19-RWKR(up)  --> DM-TPR(up) --> Yellow
                                                         --> 20-RWKR(up) || 19-RWKR(up)  --> DL-TPR(up) --> Yellow

For each point normal and reverse track indication (Yellow light and Red light controlled by)
    - For yellow Point position
    - For red Point position && Point failed

For birthing track it is controlled by all possible ASR

i.e. point track has to be distributted wisely


*/
/*
Point indication logic
1) Route is not set (All TPR are up)
4,6 --> Always no color (Point control button)
a) point is in normal
    1,2,3 --> Yellow
    7,8,9 --> Yellow
    5 --> No colour (Even after pressing also, no color)

b) point is in reverse
    1,5,9 --> Yellow (No other condition)

*/
/*
Manual point operation (Assuming point was in normal)
8-RWKR-request up
    RWLR up
        NWKR dn
        NCR dn
        RCR up
        WNKR dn
        WRKR up

*/

/*
Program hirarchy
Model
    viewController, pointController, indicationController
    componentController
*/
});