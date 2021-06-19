import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";
import DataHandlerDBView from "./DataHandlerDBView";


// import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";

var DataHandlerV2;

(function($S){
var DT = $S.getDT();
DataHandlerV2 = function(arg) {
    return new DataHandlerV2.fn.init(arg);
};
DataHandlerV2.fn = DataHandlerV2.prototype = {
    constructor: DataHandlerV2,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(DataHandlerV2);

DataHandlerV2.extend({
    getList2Data: function() {
        var metaData = DataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        var enabledPages = $S.findParam([currentAppData, metaData, Config.tempConfig], "enabledPages");
        var redirectPages = $S.findParam([currentAppData, metaData, Config.tempConfig], "redirectPages");
        var linkText = $S.findParam([currentAppData, metaData, Config.tempConfig], "linkText");
        if (!$S.isArray(enabledPages)) {
            enabledPages = [];
        }
        if (!$S.isObject(linkText)) {
            linkText = {};
        }
        var pages = Config.pages;
        var list2Data = [];
        var temp, i, key;
        temp = Object.keys(pages);
        var pageOrder = [];
        for(i=0; i<enabledPages.length; i++) {
            if (temp.indexOf(enabledPages[i]) >= 0) {
                pageOrder.push(enabledPages[i]);
            }
        }
        for(i=0; i<pageOrder.length; i++) {
            key = pageOrder[i];
            if (key !== "home") {
                if ($S.isString(linkText[key])) {
                    temp = linkText[key];
                } else {
                    temp = $S.capitalize(key);
                }
                list2Data.push({"name": key, "toText": temp, "toUrl": pages[key]});
            }
        }
        if ($S.isArray(redirectPages)) {
            for(i=0; i<redirectPages.length; i++) {
                temp = redirectPages[i];
                if (!$S.isObject(temp)) {
                    continue;
                }
                if (!$S.isStringV2(temp.name)) {
                    continue;
                }
                if (!$S.isStringV2(temp.toText)) {
                    continue;
                }
                if (!$S.isStringV2(temp.toUrl)) {
                    continue;
                }
                list2Data.push({"name": temp.name, "toText": temp.toText, "toUrl": temp.toUrl});
            }
        }
        return list2Data;
    },
    getList2DataByName: function(name) {
        var list2Data = this.getList2Data();
        if ($S.isArray(list2Data)) {
            for(var i=0; i<list2Data.length; i++) {
                if (!$S.isObject(list2Data[i])) {
                    continue;
                }
                if (list2Data[i].name === name) {
                    return list2Data[i];
                }
            }
        }
        return null;
    },
    getList3Data: function(pageName) {
        var metaData = DataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        var name = "list3Data", i;
        var allPages = Object.keys(Config.pages);
        if ([Config.home].indexOf(currentList2Id) >= 0) {
            var enabledPages = $S.findParam([currentAppData, metaData, Config.tempConfig], "enabledPages", []);
            if ($S.isArray(enabledPages)) {
                for (i = 0; i<enabledPages.length; i++) {
                    if ($S.isStringV2(enabledPages[i]) && allPages.indexOf(enabledPages[i]) >= 0) {
                        currentList2Id = enabledPages[i];
                        break;
                    }
                }
            }
        }
        if ([Config.entry, Config.update, Config.summary].indexOf(currentList2Id) >= 0) {
            name = "list3Data_1";
        } else if ([Config.dbview, Config.dbview_summary, Config.custom_dbview, Config.add_field_report].indexOf(currentList2Id) >= 0) {
            name = "list3Data_2";
        } else if ([Config.ta].indexOf(currentList2Id) >= 0) {
            name = "list3Data_3";
        } else {
            return [];
        }
        var list3Data = $S.findParam([currentAppData, metaData], name, []);
        if ($S.isArray(list3Data)) {
            for (i = 0; i < list3Data.length; i++) {
                if ($S.isObject(list3Data[i])) {
                    if (!$S.isString(list3Data[i].name)) {
                        list3Data[i].name = name + "-name-" + i;
                    }
                }
            }
        }
        return list3Data;
    },
    isPageDisabled: function(pageName) {
        if (pageName === "home") {
            return false;
        }
        var metaData = DataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        var enabledPages = $S.findParam([currentAppData, metaData, Config.tempConfig], "enabledPages");
        if ($S.isArray(enabledPages)) {
            return enabledPages.indexOf(pageName) < 0;
        }
        return true;
    },
    getDBViewTableData: function(tableName) {
        if (!$S.isString(tableName) || tableName.length < 1) {
            return [];
        }
        var dbViewData = DataHandler.getData("dbViewData", {});
        if ($S.isObject(dbViewData)) {
            if ($S.isObject(dbViewData[tableName]) && $S.isArray(dbViewData[tableName].tableData)) {
                return dbViewData[tableName].tableData;
            }
        }
        return [];
    },
    handleAttendanceDataLoad: function() {
        var attendanceDataTable = DataHandler.getData("attendanceData", []);
        var attendanceDataKey = DataHandler.getAppData("attendanceDataKey", "");
        var finalAttendanceData = {};
        var latestAttendanceData = {};
        var i, userId, temp, temp2, attendanceData;
        if ($S.isObject(attendanceDataTable)) {
            for(var tableName in attendanceDataTable) {
                if ($S.isObject(attendanceDataTable[tableName])) {
                    if ($S.isArray(attendanceDataTable[tableName].tableData)) {
                        attendanceData = attendanceDataTable[tableName].tableData;
                        break;
                    }
               }
            }
        }
        if (!$S.isArray(attendanceData)) {
            attendanceData = [];
        }
        if (!$S.isStringV2(attendanceDataKey)) {
            attendanceDataKey = "type";
        }
        for(i=0; i<attendanceData.length; i++) {
            if (!$S.isObject(attendanceData[i])) {
                continue;
            }
            if (!AppHandler.isValidDateStr(attendanceData[i]["date"])) {
                continue;
            }
            userId = attendanceData[i]["userId"];
            if (!$S.isString(userId) || userId.length < 1) {
                continue;
            }
            if (!$S.isObject(finalAttendanceData[userId])) {
                finalAttendanceData[userId] = {"attendance": []};
            }
            finalAttendanceData[userId].attendance.push(attendanceData[i]);
        }
        for(var key in finalAttendanceData) {
            if (!$S.isObject(latestAttendanceData[key])) {
                latestAttendanceData[key] = {"attendance": []};
            }
            if ($S.isArray(finalAttendanceData[key].attendance)) {
                temp = [];
                for(i=0; i<finalAttendanceData[key].attendance.length; i++) {
                    temp2 = finalAttendanceData[key].attendance[i];
                    if (temp.indexOf(temp2.date) < 0) {
                        temp.push(temp2.date);
                        temp2.type = temp2[attendanceDataKey];
                        if (temp2.type !== "") {
                            latestAttendanceData[key].attendance.push(temp2);
                        }
                    }
                }
            }
        }
        DataHandler.setData("latestAttendanceData", latestAttendanceData);
    },
    handleMetaDataLoad: function(metaDataResponse) {
        var finalMetaData = {}, i;
        var appControlMetaData = DataHandler.getData("appControlMetaData", {});
        if ($S.isObject(appControlMetaData)) {
            finalMetaData = appControlMetaData;
        }
        if ($S.isArray(metaDataResponse)) {
            for (i=0; i<metaDataResponse.length; i++) {
                if ($S.isObject(metaDataResponse[i])) {
                    finalMetaData = Object.assign(finalMetaData, metaDataResponse[i]);
                }
            }
        }
        DataHandler.setData("metaData", finalMetaData);
        var dateSelect = DataHandler.getData("date-select", "");
        if (dateSelect === "") {
            if ($S.isString(finalMetaData.dateSelect) && finalMetaData.dateSelect.length > 0) {
                dateSelect = finalMetaData.dateSelect;
            } else {
                dateSelect = Config.defaultDateSelect;
            }
        }
        DataHandler.setData("date-select", dateSelect);
        var currentList3Data = DataHandler.getCurrentList3Data();
        var keys, list3Data, currentList3Id = "";
        if ($S.isObject(currentList3Data)) {
            keys = Object.keys(currentList3Data);
            if (keys.length < 1) {
                list3Data = this.getList3Data();
                if ($S.isArray(list3Data)) {
                    for (i = 0; i < list3Data.length; i++) {
                        if ($S.isObject(list3Data[i])) {
                            if ($S.isBooleanTrue(list3Data[i].defaultSelected)) {
                                currentList3Id = list3Data[i].name;
                                DataHandler.setData("currentList3Id", currentList3Id);
                                break;
                            }
                        }
                    }
                }
            }
        }
    },
    generateFilterOptions: function() {
        var currentAppData = DataHandler.getCurrentAppData();
        var metaData = DataHandler.getData("metaData", {});
        var userData = DataHandler.getData("userData", []);
        var filterDataValues = DataHandler.getData("filterValues", {});
        var filterOptions = AppHandler.generateFilterData(currentAppData, metaData, userData, filterDataValues);
        DataHandler.setData("filterOptions", filterOptions);
    }
});

DataHandlerV2.extend({
    callAddTextApi: function(subject, heading, callBack) {
        var url = Config.getApiUrl("addTextApi", null, true);
        var currentAppData = DataHandler.getCurrentAppData();
        if (!$S.isString(url)) {
            return;
        }
        if (!$S.isObject(currentAppData)) {
            return;
        }
        if (!$S.isString(currentAppData.saveDataFilename) || currentAppData.saveDataFilename.length < 1) {
            alert("Invalid saveDataFilename.");
            return;
        }
        var postData = {};
        var attr = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm/:/ss/./ms","/") + "," + subject+","+heading+","+AppHandler.GetUserData("username", "")+",";
        postData["subject"] = subject;
        postData["heading"] = heading;
        postData["text"] = [attr];
        postData["filename"] = currentAppData.saveDataFilename;
        var msg = "Error in saving data, Please Try again.";
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            if (status === "FAILURE" || ($S.isObject(response) && response.status === "FAILURE")) {
                alert(msg);
            }
            $S.callMethod(callBack);
        });
    }
});

DataHandlerV2.extend({
    _getTdClassNameFromDateAttr: function(dateAttr, nhList, phList) {
        var className = "";
        if (!$S.isArray(nhList)) {
            nhList = [];
        }
        if (!$S.isArray(phList)) {
            phList = [];
        }
        if ($S.isObject(dateAttr)) {
            if ($S.isString(dateAttr.day)) {
                className = "day-"+dateAttr.day;
            }
            if (nhList.indexOf(dateAttr.dateStr) >= 0) {
                className += " day-nh";
            }
            if (phList.indexOf(dateAttr.dateStr) >= 0) {
                className += " day-ph";
            }
        }
        return className;
    },
    _getAttendanceField: function(attendanceData, userData, dateAttr, attendanceOption, selectFieldName) {
        var text = [], temp;
        var userId = "", name = "";
        var i;
        if (!$S.isString(selectFieldName) || selectFieldName.length < 1) {
            selectFieldName = "name";
        }
        if ($S.isArray(userData)) {
            for(i = 0; i<userData.length; i++) {
                if ($S.isObject(userData[i])) {
                    if (userData[i].name === "userId") {
                        userId = userData[i].value;
                    } else if (userData[i].name === selectFieldName) {
                        name = userData[i].value;
                    }
                }
            }
        }
        var selectName = userId + "," + dateAttr.dateStr + "," + name;
        if ($S.isObject(attendanceData) && $S.isObject(attendanceData[userId])) {
            if ($S.isArray(attendanceData[userId].attendance)) {
                temp = attendanceData[userId].attendance;
                for(i=temp.length-1; i>=0; i--) {
                    if (!$S.isObject(temp[i])) {
                        continue;
                    }
                    if (!$S.isStringV2(temp[i].type)) {
                        continue;
                    }
                    if (AppHandler.isDateLiesInRangeV3(dateAttr.dateStr, temp[i].date)) {
                        text.push(temp[i].type);
                    } else if (dateAttr.dateStr === temp[i].date) {
                        text.push(temp[i].type);
                    }
                }
            }
        }
        if ($S.isObject(attendanceOption)) {
            attendanceOption = $S.clone(attendanceOption);
            attendanceOption.value = text.join(",");
            attendanceOption.name = selectName;
        } else {
            attendanceOption = text.join(",");
        }
        return attendanceOption;
    },
    GenerateEntryUpdateUserData: function(dateArray, userData, pageName) {
        var renderData = [];
        var i, j, k, temp, userDataV2;
        var attendanceData = DataHandler.getData("latestAttendanceData", {});
        var metaData = DataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        var nhList = $S.findParam([currentAppData, metaData], "nhList", []);
        var phList = $S.findParam([currentAppData, metaData], "phList", []);
        var attendanceOption = $S.findParam([currentAppData, metaData], "attendanceOption", {});
        var selectFieldName = $S.findParam([currentAppData, metaData], "selectFieldName", {});
        var textFilter = $S.getTextFilter(), className;
        if (pageName === "entry") {
            attendanceOption = "";
        }
        if ($S.isArray(dateArray)) {
            for(i=dateArray.length-1; i>=0; i--) {
                if (!$S.isObject(dateArray[i])) {
                    continue;
                }
                userDataV2 = $S.clone(userData);
                if ($S.isArray(userDataV2) && $S.isArray(dateArray[i].allDate)) {
                    for(j=0; j<userDataV2.length; j++) {
                        for (k=0; k<dateArray[i].allDate.length; k++) {
                            temp = {};
                            temp["name"] = dateArray[i].allDate[k].dateStr;
                            temp["heading"] = dateArray[i].allDate[k].date.toString();
                            className = this._getTdClassNameFromDateAttr(dateArray[i].allDate[k], nhList, phList);
                            temp["className"] = textFilter(userDataV2[j].className).addClass(className).getClassName();
                            temp["value"] = this._getAttendanceField(attendanceData, userDataV2[j], dateArray[i].allDate[k], attendanceOption, selectFieldName);
                            userDataV2[j].push(temp);
                        }
                    }
                }
                temp = {"tableHeading": dateArray[i].dateHeading, "tableData": userDataV2};
                renderData.push(temp);
            }
        }
        return renderData;
    },
    _getAttendanceCount: function(attendanceData, dateAttr, userData, userId) {
        var count = 0, temp, dateResult = [];
        var attendance, startDate, endDate;
        if ($S.isObject(attendanceData) && $S.isObject(attendanceData[userId])) {
            if ($S.isArray(attendanceData[userId].attendance)) {
                attendance = attendanceData[userId].attendance;
                for (var i = 0; i < attendance.length; i++) {
                    if (!$S.isObject(attendance[i])) {
                        continue;
                    }
                    if (!$S.isString(attendance[i].type) || attendance[i].type.length < 1) {
                        continue;
                    }
                    if ($S.isArray(userData.pattern)) {
                        if ($S.isObject(dateAttr) && $S.isArray(dateAttr.dateRange) && dateAttr.dateRange.length === 2) {
                            startDate = dateAttr.dateRange[0];
                            endDate = dateAttr.dateRange[1];
                        }
                        if (AppHandler.isDateLiesInRange(startDate, endDate, attendance[i].date)) {
                            temp = $S.searchItems(userData.pattern, [attendance[i].type], userData.searchByPattern);
                            if (temp.length > 0) {
                                dateResult.push(attendance[i].date);
                            }
                            count += temp.length;
                        }
                    }
                }
            }
        }
        return {"count": count, "dateResult": dateResult};
    },
    getProjectData: function() {
        var currentPId = DataHandler.getPathParamsData("pid");
        var projectTable = DataHandlerDBView.getTableDataByAttr(DataHandler.getTableName("projectTable"), "pid", currentPId);
        var response = {"status": "SUCCESS"};
        if (projectTable.length !== 1) {
            response["status"] = "FAILURE";
            response["reason"] = "Invalid Project Id: " + currentPId;
        } else {
            response["pName"] = projectTable[0].pName;
            response["uploadedFileData"] = DataHandler.getData("uploadedFileData", []);
        }
        return response;
    },
    getProjectWorkStatus: function(sortingFields) {
        var currentPId = DataHandler.getPathParamsData("pid");
        var response = this.getProjectData();
        var workStatus = DataHandlerDBView.getTableDataByAttr(DataHandler.getTableName("projectWorkStatus"), "pid", currentPId);
        workStatus = $S.sortResultV2(workStatus, sortingFields, "name");
        response["workStatus"] = workStatus;
        return response;
    },
    getProjectSupplyStatus: function(sortingFields) {
        var currentPId = DataHandler.getPathParamsData("pid");
        var response = this.getProjectData();
        var supplyStatus = DataHandlerDBView.getTableDataByAttr(DataHandler.getTableName("materialSupplyStatus"), "pid", currentPId);
        supplyStatus = $S.sortResultV2(supplyStatus, sortingFields, "name");
        response["supplyStatus"] = supplyStatus;
        return response;
    }
});

})($S);

export default DataHandlerV2;