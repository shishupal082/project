$(document).ready(function() {
// $M.setLoggerDateTimeState(true,"D/YYYY/-/MM/-/DD/-/T/hh/:/mm/:/ss/:/ms","/");
// $M.disableReChecking();
// $M.enableVerifyExpression();
var tableHtml = "", timerCount=-1;
function getLogTime() {
    var dateTime = $M.getDT().getDateTime("T/hh/:/mm/:/ss/./ms","/");
    return dateTime;
}
var stageLoggingEnable = true;
stageLoggingEnable = false;
// tableHtml += $V.getTableHtml("yard-1");
// tableHtml += '<hr style="height:3px;background-color:#eee;border:0;"></hr>';
tableHtml += $V.getRouteDisplayHtml("i1D");
tableHtml += '<hr style="height:1px;background-color:#eee;border:0;margin-top:10px;margin-bottom:10px;"></hr>';
tableHtml += $V.getTableHtml("yard-2");
tableHtml += '<hr style="height:3px;background-color:#eee;border:0;"></hr>';
tableHtml += $V.getTableHtml("yard-3", 'class="table"');
tableHtml += '<hr style="height:3px;background-color:#eee;border:0;"></hr>';
tableHtml += $V.getTableHtml("yard-4", 'class="table"');
$("#tableHtml").html(tableHtml);
function checkUIStyle() {
    $("#timerCount").html(timerCount);
	var possibleValues = $V.getPossibleValues();
	for (var i=0; i<possibleValues.length; i++) {
        var key = possibleValues[i];
        try {
            var node = $("#" + key);
            if (node.length) {
                if (node.hasClass("tpr")) {
                    if (["1D-2-8"].indexOf(key) >= 0) {
                        if ($V.isCrossingEnable(key)) {
                            $("#" + key + " span").html("x");
                            $("#" + key + " span").attr("style", "padding: 3px 5px;");
                        } else {
                            $("#" + key + " span").attr("style", "");
                            $("#" + key + " span").html("&nbsp;")
                        }
                    }
                    node.removeClass("btn-warning");
                    node.addClass($V.getTprClass(key));
                } else if (node.hasClass("nrr")) {
                    node.removeClass("btn-success");
                    node.addClass($V.getHrClass(node.attr("exp"), key));
                }
            }
        } catch(err) {
            // console.log("JQUERY error for node: " + key);
        }
    }
}
$(".evt").on("click", function(e) {
	if (timerCount != 0) {
        return;
    }
    if (stageLoggingEnable) {
        console.log(getLogTime() + " - Start ...");
    }
    
	var currentTarget = $(e.currentTarget);
    var value = currentTarget.val();
    var valueArr = value.split(",");
    var finalValue = {};
    for (var i = 0; i < valueArr.length; i++) {
        var valItem = valueArr[i].split("=");
        if (valItem.length == 2) {
            finalValue[valItem[0]] = valItem[1];
        }
    }
    function activateTimers(key) {
        setTimeout(function() {
            if (stageLoggingEnable) {
                console.log(getLogTime() + " - Start activateTimers ..." + key);
            }
            $V.setValues(key, 0);
            timerCount--;
            checkUIStyle();
            if (stageLoggingEnable) {
                console.log(getLogTime() + " - End activateTimers ..." + key);
            }
        }, 1500);
    }
    function setUsingTimer(key, value) {
        setTimeout(function() {
            if (stageLoggingEnable) {
                console.log(getLogTime() + " - Start setUsingTimer ..." + key);
            }
            $V.setValues(key, value);
            if (stageLoggingEnable) {
                console.log(getLogTime() + " - End setUsingTimer ..." + key);
            }
        }, 1);
    }
    for(var key in finalValue) {
        timerCount++;
        var value = finalValue[key];
        setUsingTimer(key, value);
        // $V.setValues(key, value);
        checkUIStyle();
        activateTimers(key);
        //Activate timer for e+u button press
        if (currentTarget.hasClass("e-u")) {
        }
    }
    if (stageLoggingEnable) {
        console.log(getLogTime() + " - End ...");
    }
});
$("#timerCount").html("Loading please wait...");
// $("#timerCount").addClass("btn btn-danger");
if (stageLoggingEnable) {
    console.log(getLogTime() + " - Loading start ...");
}
$V.documentLoaded(function() {
    timerCount=0;
    // $("#timerCount").removeClass("btn-danger").removeClass("btn");
    checkUIStyle();
    if (stageLoggingEnable) {
        console.log(getLogTime() + " - Loading complete.");
    }
});
window.CheckUIStyle = checkUIStyle;
});
