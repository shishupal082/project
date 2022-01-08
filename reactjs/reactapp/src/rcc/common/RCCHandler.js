import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import DataHandlerV3 from "./DataHandlerV3";
// import Config from "./Config";


// import AppHandler from "../../common/app/common/AppHandler";
// import CommonConfig from "../../common/app/common/CommonConfig";

var RCCHandler;

(function($S){
// var DT = $S.getDT();
RCCHandler = function(arg) {
    return new RCCHandler.fn.init(arg);
};
RCCHandler.fn = RCCHandler.prototype = {
    constructor: RCCHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(RCCHandler);
var temp, temp2, temp3, i, j, k;
RCCHandler.extend({
    updateText: function(obj, key, value) {
        if ($S.isObject(obj) && $S.isStringV2(key) && $S.isStringV2(value)) {
            if ($S.isStringV2(obj[key])) {
                obj[key] += "," + value;
            } else {
                obj[key] = value;
            }
        }
    },
    getRccRenderData: function() {
        var dbViewData = DataHandler.getData("dbViewData", {});
        var tableName = "tlsr_trsr";
        var tableData = [];
        var signalRouteKey = ["conflicting_signal", "on_route_signal", "in_isolation_signal"];
        if ($S.isObject(dbViewData) && $S.isObject(dbViewData[tableName]) && $S.isArray(dbViewData[tableName].tableData)) {
            tableData = dbViewData[tableName].tableData;
        }
        var signalMapping = {};
        for (i=0; i<tableData.length; i++) {
            if ($S.isObject(tableData[i])) {
                for (j=0; j<signalRouteKey.length; j++) {
                    if ($S.isArray(tableData[i][signalRouteKey[j]])) {
                        temp = tableData[i][signalRouteKey[j]];
                        for (k=0; k<temp.length; k++) {
                            if ($S.isStringV2(temp[k])) {
                                if (!$S.isObject(signalMapping[temp[k]])) {
                                    signalMapping[temp[k]] = {"tableData": [], "tableRow": []};
                                }
                                signalMapping[temp[k]].tableData.push(tableData[i]);
                            }
                        }
                    }
                }
            }
        }
        for (var signalRoute in signalMapping) {
            temp = [];
            if ($S.isObject(signalMapping[signalRoute]) && $S.isArray(signalMapping[signalRoute].tableData)) {
                temp2 = {"signal_route": signalRoute};
                for (i=0; i<signalMapping[signalRoute].tableData.length; i++) {
                    temp3 = signalMapping[signalRoute].tableData[i];
                    if ($S.isArray(temp3["conflicting_signal"]) && temp3["conflicting_signal"].indexOf(signalRoute) >= 0) {
                        this.updateText(temp2, "conflicting", temp3["parameter"]);
                    }
                    if ($S.isArray(temp3["in_isolation_signal"]) && temp3["in_isolation_signal"].indexOf(signalRoute) >= 0) {
                        this.updateText(temp2, "in_isolation", temp3["parameter"]);
                    }
                    if ($S.isArray(temp3["on_route_signal"]) && temp3["on_route_signal"].indexOf(signalRoute) >= 0) {
                        this.updateText(temp2, "on_route", temp3["parameter"]);
                    }
                }
                temp.push(temp2);
            }
            signalMapping[signalRoute]["tableRow"] = temp;
        }
        temp = Object.keys(signalMapping);
        temp.sort();
        var result = [];
        for (i=0; i<temp.length; i++) {
            if ($S.isObject(signalMapping[temp[i]]) && $S.isArray(signalMapping[temp[i]].tableRow)) {
                result = result.concat(signalMapping[temp[i]].tableRow);
            }
        }
        var finalTable = DataHandlerV3.getFinalTable({"tlsr_trsr": {"tableData": result}}, null);
        return finalTable;
    }
});

})($S);

export default RCCHandler;
