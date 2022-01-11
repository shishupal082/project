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
var EMPTY = "EMPTY";
var SIGNAL_TYPE = ["S", "C", "SH"];
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
    _splitSignal: function(signalRoute, isNumeric) {
        var result = {}, temp, signalNumber;
        if ($S.isStringV2(signalRoute)) {
            temp = signalRoute.split("-");
            if (temp.length >= 2 && $S.isBooleanTrue(isNumeric) && $S.isNumeric(temp[1])) {
                signalNumber = temp[1] * 1;
            } else {
                signalNumber = temp[1];
            }
            if (temp.length >= 4) {
                result = {"name": temp[0], "number": signalNumber, "route": temp[2], "ov": temp[3]};
            } else if(temp.length >= 3) {
                result = {"name": temp[0], "number": signalNumber, "route": temp[2]};
            } else if(temp.length >= 2) {
                result = {"name": temp[0], "number": signalNumber};
            }
        }
        return result;
    },
    _sortSignalName: function(signalNames) {
        var result = [];
        var sortingFields, i, temp3 = [];
        if ($S.isArray(signalNames)) {
            for (i=0; i<signalNames.length; i++) {
                if ($S.isStringV2(signalNames[i])) {
                    temp3.push(this._splitSignal(signalNames[i], true));
                }
            }
        }
        // sortingFields = [{"name": "route", "value": "ascending"}, {"name": "name", "value": "ascending"}];
        // temp3 = $S.sortResultV2(temp3, sortingFields, "name");
        var tempSignalType = SIGNAL_TYPE.concat(["OV", "OV1", "OV2", "OV3", "OV4"]);
        temp3 = temp3.sort(function(a, b) {
            if ($S.isObject(a) && $S.isObject(b)) {
                for (var j=0; j<tempSignalType.length; j++) {
                    if (a["name"] === tempSignalType[j]) {
                        return -1;
                    } else if (b["name"] === tempSignalType[j]) {
                        return 1;
                    }
                }
            }
            return 0;
        });
        sortingFields = [{"name": "route", "value": "ascending"}];
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
    _combineRoute: function(route1, route2) {
        if (!$S.isStringV2(route1)) {
            return route2;
        } else if (!$S.isStringV2(route2)) {
            return route1;
        }
        return this._getFinalConflictingRoute(route1 + "," + route2);
    },
    _combineTableRow: function(routeTableRow, ovTableRow) {
        if (!$S.isObject(ovTableRow) || !$S.isObject(routeTableRow)) {
            return;
        }
        if ($S.isStringV2(ovTableRow["signal_route"])) {
            routeTableRow["set_overlap"] = ovTableRow["signal_route"];
        }
        if ($S.isStringV2(ovTableRow["conflicting_route"])) {
            routeTableRow["conflicting_route"] = this._combineRoute(routeTableRow["conflicting_route"], ovTableRow["conflicting_route"]);
        }
    },
    _getFinalRoute: function(tableRow, signalMapping, tableData) {
        var overlap = [];
        var finalTableRow = [];
        var signalRoute, parameter, parameterRoute, i;
        var temp;
        if (!$S.isArray(tableData)) {
            tableData = [];
        }
        if (!$S.isObject(signalMapping)) {
            signalMapping = {};
        }
        if ($S.isObject(tableRow) && $S.isStringV2(tableRow["signal_route"])) {
            signalRoute = tableRow["signal_route"];
            for (i=0; i<tableData.length; i++) {
                if ($S.isObject(tableData[i]) && $S.isStringV2(tableData[i]["parameter"])) {
                    parameter = tableData[i]["parameter"];
                    parameterRoute = DataHandlerV3.parseSignal(parameter);
                    if (parameterRoute.indexOf(signalRoute) >= 0) {
                        if ($S.isStringV2(tableData[i]["set_overlap"])) {
                            overlap.push(tableData[i]["set_overlap"]);
                        }
                    }
                }
            }
        }
        if (overlap.length > 0) {
            overlap = DataHandlerV3.parseSignal(overlap.join(","));
            for (i=0; i<overlap.length; i++) {
                temp = $S.clone(tableRow);
                if ($S.isObject(signalMapping[overlap[i]]) && $S.isObject(signalMapping[overlap[i]]["tableRow"])) {
                    this._combineTableRow(temp, signalMapping[overlap[i]]["tableRow"]);
                }
                finalTableRow.push(temp);
            }
        } else {
            finalTableRow.push(tableRow);
        }
        return finalTableRow;
    },
    getRccRenderData: function() {
        var dbViewData = DataHandler.getData("dbViewData", {});
        var tableName = "tlsr_trsr";
        var tableData = [];
        var temp, temp2, temp3;
        var signalRouteKey = ["conflicting_signal", "on_route_signal", "in_isolation_signal", "conflicting_route_signal"];
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
                    if ($S.isArray(temp3["conflicting_route_signal"]) && temp3["conflicting_route_signal"].indexOf(signalRoute) >= 0) {
                        this._updateText(temp2, "conflicting_route", temp3["parameter"]);
                    }
                }
            }
            signalMapping[signalRoute]["tableRow"] = temp2;
        }
        this._updateConflictingSignal(signalMapping);
        this._combineConflictingSignal(signalMapping);
        temp = Object.keys(signalMapping);
        temp = this._sortSignalName(temp);
        var result = [];
        for (i=0; i<temp.length; i++) {
            if ($S.isObject(signalMapping[temp[i]]) && $S.isObject(signalMapping[temp[i]].tableRow)) {
                result = result.concat(this._getFinalRoute(signalMapping[temp[i]].tableRow, signalMapping, tableData));
            }
        }
        var finalTable = DataHandlerV3.getFinalTable({"tlsr_trsr": {"tableData": result}}, null);
        return finalTable;
    },
    _addConflict: function(route, route2, signalMapping) {
        if (!$S.isObject(signalMapping) || !$S.isStringV2(route)) {
            return;
        }
        if (!$S.isObject(signalMapping[route]) || !$S.isObject(signalMapping[route]["tableRow"])) {
            signalMapping[route] = {"tableRow": {"signal_route": route}};
        }
        if ($S.isStringV2(signalMapping[route]["tableRow"]["conflicting_route"])) {
            if (signalMapping[route]["tableRow"]["conflicting_route"].indexOf(route2) < 0) {
                this._updateText(signalMapping[route]["tableRow"], "conflicting_route", route2);
            }
        } else {
            this._updateText(signalMapping[route]["tableRow"], "conflicting_route", route2);
        }
    },
    _checkConflicting: function(signalRoute, conflicting, signalMapping) {
        var conflictingRoute;
        for(var i=0; i<conflicting.length; i++) {
            if (!$S.isObject(signalMapping[conflicting[i]])) {
                signalMapping[conflicting[i]] = {"tableRow": {"signal_route": conflicting[i]}};
            }
            if (!$S.isObject(signalMapping[conflicting[i]]["tableRow"])) {
                signalMapping[conflicting[i]]["tableRow"] = {"signal_route": conflicting[i]}
            }
            conflictingRoute = signalMapping[conflicting[i]]["tableRow"]["conflicting_route"];
            conflictingRoute = DataHandlerV3.parseSignal(conflictingRoute);
            if (conflictingRoute.indexOf(signalRoute) < 0) {
                this._updateText(signalMapping[conflicting[i]]["tableRow"], "conflicting_route", signalRoute);
            }
        }
    },
    _updateConflictingSignal: function(signalMapping) {
        if (!$S.isObject(signalMapping)) {
            return;
        }
        var arrConflicting;
        for (var signalRoute in signalMapping) {
            if ($S.isObject(signalMapping[signalRoute]) && $S.isObject(signalMapping[signalRoute]["tableRow"])) {
                arrConflicting = DataHandlerV3.parseSignal(signalMapping[signalRoute]["tableRow"]["conflicting_route"]);
                this._checkConflicting(signalRoute, arrConflicting, signalMapping);
            }
        }
    },
    _combineSignalRoute: function(signalByType, signalByNumber, signalByRoute, arr) {
        var result = [];
        var combinedRoute;
        var isFound;
        var alreadyFoundList = [];
        for (var signalNumber in signalByNumber) {
            if ($S.isArray(signalByNumber[signalNumber])) {
                for(var i=0; i<SIGNAL_TYPE.length; i++) {
                    combinedRoute = "";
                    isFound = false;
                    for (var j=0; j<signalByNumber[signalNumber].length; j++) {
                        if ($S.isObject(signalByNumber[signalNumber][j])) {
                            if (alreadyFoundList.indexOf(signalByNumber[signalNumber][j]["signalRoute"]) >= 0) {
                                continue;
                            }
                            if (signalByNumber[signalNumber][j]["attr"]["name"] === SIGNAL_TYPE[i]) {
                                if ($S.isStringV2(signalByNumber[signalNumber][j]["attr"]["route"])) {
                                    if ($S.isStringV2(combinedRoute)) {
                                        combinedRoute += "/" + signalByNumber[signalNumber][j]["attr"]["route"];
                                    } else {
                                        combinedRoute = signalByNumber[signalNumber][j]["attr"]["route"];
                                    }
                                    alreadyFoundList.push(signalByNumber[signalNumber][j]["signalRoute"]);
                                    isFound = true;
                                }
                            }
                        }
                    }
                    if (isFound) {
                        if ($S.isStringV2(combinedRoute)) {
                            result.push(SIGNAL_TYPE[i] + "-" + signalNumber + "-" + combinedRoute);
                        } else {
                            result.push(SIGNAL_TYPE[i] + "-" + signalNumber);
                        }
                    }
                }
            }
        }
        this._combineRemaining(arr, result, alreadyFoundList);
        return result;
    },
    _combineSignalType: function(signalByType, signalByNumber, signalByRoute, arr) {
        var result = [];
        var signalNumbers = Object.keys(signalByNumber);
        var combinedType;
        var isFound;
        var alreadyFoundList = [];
        for (var route in signalByRoute) {
            if ($S.isArray(signalByRoute[route])) {
                for(var i=0; i<signalNumbers.length; i++) {
                    combinedType = "";
                    isFound = false;
                    for (var j=0; j<signalByRoute[route].length; j++) {
                        if ($S.isObject(signalByRoute[route][j])) {
                            if (alreadyFoundList.indexOf(signalByRoute[route][j]["signalRoute"]) >= 0) {
                                continue;
                            }
                            if (signalByRoute[route][j]["attr"]["number"] === signalNumbers[i]) {
                                if ($S.isStringV2(signalByRoute[route][j]["attr"]["name"]) && SIGNAL_TYPE.indexOf(signalByRoute[route][j]["attr"]["name"]) >= 0) {
                                    if ($S.isStringV2(combinedType)) {
                                        combinedType += "/" + signalByRoute[route][j]["attr"]["name"];
                                    } else {
                                        combinedType = signalByRoute[route][j]["attr"]["name"];
                                    }
                                    alreadyFoundList.push(signalByRoute[route][j]["signalRoute"]);
                                    isFound = true;
                                }
                            }
                        }
                    }
                    if (isFound) {
                        if ($S.isStringV2(combinedType)) {
                            if (route === EMPTY) {
                                result.push(combinedType + "-" + signalNumbers[i]);
                            } else {
                                result.push(combinedType + "-" + signalNumbers[i] + "-" + route);
                            }
                        }
                    }
                }
            }
        }
        this._combineRemaining(arr, result, alreadyFoundList);
        return result;
    },
    _combineSignalNumber: function(signalByType, signalByNumber, signalByRoute, arr) {
        var result = [];
        var combinedAttr;
        var isFound;
        var alreadyFoundList = [];
        var signalType = Object.keys(signalByType);
        for (var route in signalByRoute) {
            if ($S.isArray(signalByRoute[route])) {
                for(var i=0; i<signalType.length; i++) {
                    combinedAttr = "";
                    isFound = false;
                    for (var j=0; j<signalByRoute[route].length; j++) {
                        if ($S.isObject(signalByRoute[route][j])) {
                            if (alreadyFoundList.indexOf(signalByRoute[route][j]["signalRoute"]) >= 0) {
                                continue;
                            }
                            if (signalByRoute[route][j]["attr"]["name"] === signalType[i]) {
                                if ($S.isStringV2(signalByRoute[route][j]["attr"]["number"])) {
                                    if ($S.isStringV2(combinedAttr)) {
                                        combinedAttr += "/" + signalByRoute[route][j]["attr"]["number"];
                                    } else {
                                        combinedAttr = signalByRoute[route][j]["attr"]["number"];
                                    }
                                    alreadyFoundList.push(signalByRoute[route][j]["signalRoute"]);
                                    isFound = true;
                                }
                            }
                        }
                    }
                    if (isFound) {
                        if ($S.isStringV2(combinedAttr)) {
                            if (route === EMPTY) {
                                result.push(signalType[i] + "-" + combinedAttr);
                            } else {
                                result.push(signalType[i] + "-" + combinedAttr + "-" + route);
                            }
                        } else {
                            result.push(signalType[i] + "-" + combinedAttr);
                        }
                    }
                }
            }
        }
        this._combineRemaining(arr, result, alreadyFoundList);
        return result;
    },
    _mergeResult: function(arr, combineAttr) {
        var result = [], temp;
        if (!$S.isArray(arr)) {
            return result;
        }
        var signalByType = {};
        var signalByNumber = {};
        var signalByRoute = {};
        for (var i=0; i<arr.length; i++) {
            temp = this._splitSignal(arr[i], false);
            if ($S.isStringV2(temp["name"])) {
                if (!$S.isArray(signalByType[temp["name"]])) {
                    signalByType[temp["name"]] = [];
                }
                signalByType[temp["name"]].push({"signalRoute": arr[i], "attr": temp});
            }
            if ($S.isStringV2(temp["number"])) {
                if (!$S.isArray(signalByNumber[temp["number"]])) {
                    signalByNumber[temp["number"]] = [];
                }
                signalByNumber[temp["number"]].push({"signalRoute": arr[i], "attr": temp});
            }
            if (!$S.isStringV2(temp["route"])) {
                temp["route"] = EMPTY;
            }
            if (!$S.isArray(signalByRoute[temp["route"]])) {
                signalByRoute[temp["route"]] = [];
            }
            signalByRoute[temp["route"]].push({"signalRoute": arr[i], "attr": temp});
        }
        if (combineAttr === "route") {
            result = this._combineSignalRoute(signalByType, signalByNumber, signalByRoute, arr);
        } else if (combineAttr === "type") {
            result = this._combineSignalType(signalByType, signalByNumber, signalByRoute, arr);
        } else if (combineAttr === "number") {
            result = this._combineSignalNumber(signalByType, signalByNumber, signalByRoute, arr);
        }
        return result;
    },
    _combineConflictingSignal: function(signalMapping) {
        if (!$S.isObject(signalMapping)) {
            return;
        }
        for (var signalRoute in signalMapping) {
            if ($S.isObject(signalMapping[signalRoute]) && $S.isObject(signalMapping[signalRoute]["tableRow"])) {
                signalMapping[signalRoute]["tableRow"]["conflicting_route"] = this._getFinalConflictingRoute(signalMapping[signalRoute]["tableRow"]["conflicting_route"]);
            }
        }
    }
});
RCCHandler.extend({
    _removeDuplicate: function(arr) {
        var result = [];
        if ($S.isArray(arr)) {
            for (var i=0; i<arr.length; i++) {
                if ($S.isStringV2(arr[i])) {
                    if (result.indexOf(arr[i]) < 0) {
                        result.push(arr[i]);
                    }
                }
            }
        }
        return result;
    },
    _combineRemaining: function(arr, result, alreadyFoundList) {
        if (!$S.isArray(arr) || !$S.isArray(result) || !$S.isArray(alreadyFoundList)) {
            return;
        }
        for (var i=0; i<arr.length; i++) {
            if (alreadyFoundList.indexOf(arr[i]) < 0) {
                result.push(arr[i]);
            }
        }
    },
    _getFinalConflictingRoute: function(conflictingRouteStr) {
        if (!$S.isStringV2(conflictingRouteStr)) {
            return "";
        }
        var arrConflicting = DataHandlerV3.parseSignal(conflictingRouteStr);
        arrConflicting = this._removeDuplicate(arrConflicting);
        arrConflicting = this._sortSignalName(arrConflicting);
        arrConflicting = this._mergeResult(arrConflicting, "route");
        arrConflicting = this._mergeResult(arrConflicting, "type");
        arrConflicting = this._mergeResult(arrConflicting, "number");
        return arrConflicting.join(",");
    }
});
})($S);

export default RCCHandler;
