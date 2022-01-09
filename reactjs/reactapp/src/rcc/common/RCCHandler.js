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

RCCHandler.extend({
    _updateText: function(obj, key, value) {
        if ($S.isObject(obj) && $S.isStringV2(key) && $S.isStringV2(value)) {
            if ($S.isStringV2(obj[key])) {
                obj[key] += "," + value;
            } else {
                obj[key] = value;
            }
        }
    },
    _updateTextV2: function(obj, key, value) {
        var arr1, arr2, temp;
        if ($S.isObject(obj) && $S.isStringV2(key) && $S.isStringV2(value)) {
            if ($S.isStringV2(obj[key])) {
                arr1 = obj[key].split(",");
                arr2 = value.split(",");
                for (var i=0; i<arr2.length; i++) {
                    temp = arr2[i].trim();
                    if (arr1.indexOf(temp) < 0) {
                        obj[key] += "," + temp;
                    }
                }
            } else {
                obj[key] = value;
            }
        }
    },
    _getSignalRoute: function(obj) {
        if (!$S.isObject(obj)) {
            return "";
        }
        var route = "";
        if ($S.isStringV2(obj["name"])) {
            if ($S.isStringV2(route)) {
                route = route + "-" + obj["name"];
            } else {
                route = obj["name"];
            }
        }
        if ($S.isNumeric(obj["number"])) {
            if ($S.isStringV2(route)) {
                route = route + "-" + obj["number"];
            } else {
                route = obj["number"];
            }
        }
        if ($S.isStringV2(obj["route"])) {
            if ($S.isStringV2(route)) {
                route = route + "-" + obj["route"];
            } else {
                route = obj["route"];
            }
        }
        if ($S.isStringV2(obj["ov"])) {
            if ($S.isStringV2(route)) {
                route = route + "-" + obj["ov"];
            } else {
                route = obj["ov"];
            }
        }
        return route;
    },
    _sortSignalName: function(signalNames) {
        var result = [];
        var temp, sortingFields, i, temp3 = [];
        if ($S.isArray(signalNames)) {
            for (i=0; i<signalNames.length; i++) {
                if ($S.isStringV2(signalNames[i])) {
                    temp = signalNames[i].split("-");
                    if (temp.length >= 4) {
                        temp3.push({"name": temp[0], "number": temp[1]*1, "route": temp[2], "ov": temp[3]});
                    } else if(temp.length >= 3) {
                        temp3.push({"name": temp[0], "number": temp[1]*1, "route": temp[2]});
                    } else if(temp.length >= 2) {
                        temp3.push({"name": temp[0], "number": temp[1]*1});
                    }
                }
            }
        }
        sortingFields = [{"name": "route", "value": "ascending"}, {"name": "name", "value": "ascending"}];
        temp3 = $S.sortResultV2(temp3, sortingFields, "name");
        sortingFields = [{"name": "number", "value": "ascending"}];
        temp3 = $S.sortResultV2(temp3, sortingFields, "name");
        for(i=0; i<temp3.length; i++) {
            if (!$S.isObject(temp3[i])) {
                continue;
            }
            if (!$S.isNumeric(temp3[i]["number"]) || !$S.isStringV2(temp3[i]["name"])) {
                continue;
            }
            result.push(this._getSignalRoute(temp3[i]));
        }
        return result;
    },
    _addTempRouteConfig: function(tempRouteConfig, dbViewTableRow) {
        var signalRoute = [];
        if (!$S.isObject(tempRouteConfig)) {
            tempRouteConfig = {};
        }
        if ($S.isObject(dbViewTableRow) && dbViewTableRow.type === "signal") {
            signalRoute = DataHandlerV3.parseSignal(dbViewTableRow.parameter);
            if ($S.isArray(signalRoute) && signalRoute.length > 1) {
                for(var i=0; i<signalRoute.length; i++) {
                    if (!$S.isArray(tempRouteConfig[signalRoute[i]])) {
                        tempRouteConfig[signalRoute[i]] = [];
                    }
                    tempRouteConfig[signalRoute[i]].push(dbViewTableRow);
                }
            }
        }
        return true;
    },
    getRccRenderData: function() {
        var dbViewData = DataHandler.getData("dbViewData", {});
        var tableName = "tlsr_trsr";
        var tableData = [];
        var temp, temp2, temp3;
        var tempRouteConfig = {};
        var signalRouteKey = ["conflicting_signal", "on_route_signal", "in_isolation_signal"];
        if ($S.isObject(dbViewData) && $S.isObject(dbViewData[tableName]) && $S.isArray(dbViewData[tableName].tableData)) {
            tableData = dbViewData[tableName].tableData;
        }
        var signalMapping = {};
        var i, j, k, signalRoute;
        for (i=0; i<tableData.length; i++) {
            if ($S.isObject(tableData[i])) {
                for (j=0; j<signalRouteKey.length; j++) {
                    if ($S.isArray(tableData[i][signalRouteKey[j]])) {
                        temp = tableData[i][signalRouteKey[j]];
                        for (k=0; k<temp.length; k++) {
                            if ($S.isStringV2(temp[k])) {
                                if (!$S.isObject(signalMapping[temp[k]])) {
                                    signalMapping[temp[k]] = {"tableData": [], "tableRow": {}};
                                }
                                signalMapping[temp[k]].tableData.push(tableData[i]);
                                this._addTempRouteConfig(tempRouteConfig, tableData[i]);
                            }
                        }
                    }
                }
            }
        }
        for (signalRoute in signalMapping) {
            temp2 = {};
            if ($S.isObject(signalMapping[signalRoute]) && $S.isArray(signalMapping[signalRoute].tableData)) {
                temp2 = {"signal_route": signalRoute};
                for (i=0; i<signalMapping[signalRoute].tableData.length; i++) {
                    temp3 = signalMapping[signalRoute].tableData[i];
                    if ($S.isArray(temp3["conflicting_signal"]) && temp3["conflicting_signal"].indexOf(signalRoute) >= 0) {
                        this._updateText(temp2, "conflicting", temp3["parameter"]);
                    }
                    if ($S.isArray(temp3["in_isolation_signal"]) && temp3["in_isolation_signal"].indexOf(signalRoute) >= 0) {
                        this._updateText(temp2, "in_isolation", temp3["parameter"]);
                    }
                    if ($S.isArray(temp3["on_route_signal"]) && temp3["on_route_signal"].indexOf(signalRoute) >= 0) {
                        this._updateText(temp2, "on_route", temp3["parameter"]);
                    }
                }
            }
            signalMapping[signalRoute]["tableRow"] = temp2;
        }
        for(signalRoute in tempRouteConfig) {
            if (signalMapping[signalRoute] && $S.isObject(signalMapping[signalRoute]["tableRow"])) {
                if ($S.isArray(tempRouteConfig[signalRoute])) {
                    for(i=0; i<tempRouteConfig[signalRoute].length; i++) {
                        this._updateTextV2(signalMapping[signalRoute]["tableRow"], "conflicting", tempRouteConfig[signalRoute][i]["conflicting"]);
                    }
                }
            // } else {
            //     signalMapping[signalRoute] = {"tableData": [], "tableRow": []};
            }
            // signalMapping[signalRoute].tableData = signalMapping[signalRoute].tableData.concat(tempRouteConfig[signalRoute]);
        }
        temp = Object.keys(signalMapping);
        temp = this._sortSignalName(temp);
        var result = [];
        for (i=0; i<temp.length; i++) {
            if ($S.isObject(signalMapping[temp[i]]) && $S.isObject(signalMapping[temp[i]].tableRow)) {
                result.push(signalMapping[temp[i]].tableRow);
            }
        }
        var finalTable = DataHandlerV3.getFinalTable({"tlsr_trsr": {"tableData": result}}, null);
        return finalTable;
    }
});

})($S);

export default RCCHandler;
