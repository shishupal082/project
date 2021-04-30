import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";
// import PageHandler from "./PageHandler";


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
        var configDisabledPage = {"disabledPages": Config.disabledPages};
        var disabledPages = $S.findParam([currentAppData, metaData, configDisabledPage], "disabledPages");
        var linkText = $S.findParam([currentAppData, metaData], "linkText");
        if (!$S.isArray(disabledPages)) {
            disabledPages = [];
        }
        if (!$S.isObject(linkText)) {
            linkText = {};
        }
        var pages = Config.pages;
        var list2Data = [];
        var temp;
        for(var key in pages) {
            if (key !== "home" && disabledPages.indexOf(key) < 0) {
                if ($S.isString(linkText[key])) {
                    temp = linkText[key];
                } else {
                    temp = $S.capitalize(key);
                }
                list2Data.push({"name": key, "toText": temp, "toUrl": pages[key]});
            }
        }
        return list2Data;
    },
    isPageDisabled: function(pageName) {
        var metaData = DataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        var configDisabledPage = {"disabledPages": Config.disabledPages};
        var disabledPages = $S.findParam([currentAppData, metaData, configDisabledPage], "disabledPages");
        if ($S.isArray(disabledPages)) {
            return disabledPages.indexOf(pageName) >= 0;
        }
        return false;
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
    handleAttendanceDataLoad: function(attendanceDataTable) {
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
                for(i=finalAttendanceData[key].attendance.length-1; i>=0; i--) {
                    temp2 = finalAttendanceData[key].attendance[i];
                    if (temp.indexOf(temp2.date) < 0) {
                        temp.push(temp2.date);
                        if (temp2.type !== "") {
                            latestAttendanceData[key].attendance.push(temp2);
                        }
                    }
                }
            }
        }
        DataHandler.setData("attendanceData", finalAttendanceData);
        DataHandler.setData("latestAttendanceData", latestAttendanceData);
    },
    handleMetaDataLoad: function(metaDataResponse) {
        var finalMetaData = {}, i;
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
    },
    generateFilterOptions: function() {
        var metaData = DataHandler.getData("metaData", {});
        var userData = DataHandler.getData("userData", []);
        var filterDataValues = DataHandler.getData("filterValues", {});
        var filterOptions = AppHandler.generateFilterData(metaData, userData, filterDataValues);
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
        var attr = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm","/") + "," + subject+","+heading+","+AppHandler.GetUserData("username", "")+",";
        postData["subject"] = subject;
        postData["heading"] = heading;
        postData["text"] = [attr];
        postData["filename"] = currentAppData.saveDataFilename;
        var msg = "Error in saving data, Please Try again.";
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            if (status === "FAILURE") {
                alert(msg);
            } else if ($S.isObject(response) && response.status === "FAILURE") {
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
    _getAttendanceField: function(attendanceData, userData, dateAttr, attendanceOption) {
        var text = "", temp;
        var userId = "", name = "";
        var i;
        if ($S.isArray(userData)) {
            for(i = 0; i<userData.length; i++) {
                if ($S.isObject(userData[i])) {
                    if (userData[i].name === "userId") {
                        userId = userData[i].value;
                    } else if (userData[i].name === "name") {
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
                    if (dateAttr.dateStr === temp[i].date) {
                        text = temp[i].type;
                        break;
                    }
                }
            }
        }
        if ($S.isObject(attendanceOption)) {
            attendanceOption = $S.clone(attendanceOption);
            attendanceOption.value = text;
            attendanceOption.name = selectName;
        } else {
            attendanceOption = text;
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
                            temp["value"] = this._getAttendanceField(attendanceData, userDataV2[j], dateArray[i].allDate[k], attendanceOption);
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
        var count = 0;
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
                            count += $S.searchItems(userData.pattern, [attendance[i].type], userData.searchByPattern).length;
                        }
                    }
                }
            }
        }
        return count;
    },
    GenerateSummaryUserData: function(dateArray, userData) {
        var renderData = [];
        var i, j, k, temp, userDataV2, isCounting, userId;
        var attendanceData = DataHandler.getData("latestAttendanceData", {});
        if ($S.isArray(dateArray)) {
            for(i=dateArray.length-1; i>=0; i--) {
                if (!$S.isObject(dateArray[i])) {
                    continue;
                }
                userDataV2 = $S.clone(userData);
                if ($S.isArray(userDataV2)) {
                    for (j = 0; j < userDataV2.length; j++) {
                        if ($S.isArray(userDataV2[j])) {
                            isCounting = false;
                            for(k=0; k<userDataV2[j].length; k++) {
                                if ($S.isObject(userDataV2[j][k])) {
                                    if (userDataV2[j][k].name === "userId") {
                                        userId = userDataV2[j][k].value;
                                        isCounting = true;
                                        continue;
                                    }
                                    if (isCounting) {
                                        userDataV2[j][k].value = this._getAttendanceCount(attendanceData, dateArray[i], userDataV2[j][k], userId);
                                    }
                                }
                            }
                        }
                    }
                }
                temp = {"tableHeading": dateArray[i].dateHeading, "tableData": userDataV2};
                renderData.push(temp);
            }
        }
        return renderData;
    },
    _getLastRow: function(userData, defaultCount) {
        if (!$S.isArray(userData) || userData.length < 1) {
            return null;
        }
        var lastRow = $S.clone(userData[0]);
        if (!$S.isArray(lastRow)) {
            return null;
        }
        if ($S.isUndefined(defaultCount)) {
            defaultCount = "";
        }
        var i, j;
        var userIdFound = false;
        var count, temp;
        for(i=0; i<lastRow.length; i++) {
            if (!$S.isObject(lastRow[i])) {
                continue;
            }
            if (lastRow[i].name === "userId") {
                userIdFound = true;
                if (i>0) {
                    lastRow[i-1].text = {"tag": "b", "text": "Total"};
                }
                continue;
            }
            if (userIdFound === false) {
                lastRow[i].value = "";
                lastRow[i].text = "";
                continue;
            }
            count = 0;
            for(j=0; j<userData.length; j++) {
                if (!$S.isArray(userData[j])) {
                    continue;
                }
                if (i>=userData[j].length) {
                    break;
                }
                temp = 0;
                if ($S.isNumeric(userData[j][i].value)) {
                    temp = userData[j][i].value*1;
                } else {
                    continue;
                }
                if (temp === 0) {
                    userData[j][i].value = defaultCount;
                }
                count += temp;
            }
            lastRow[i].value = {"tag": "b", "text": count};
        }
        return lastRow;
    },
    GenerateSummaryTotalRow: function(renderData) {
        if (!$S.isArray(renderData)) {
            return;
        }
        var i, lastRow;
        var appControlData = DataHandler.getCurrentAppData();
        var metaData = DataHandler.getData("metaData", {});
        var defaultCount = $S.findParam([appControlData, metaData], "defaultCount", "");
        for(i=0; i<renderData.length; i++) {
            if ($S.isObject(renderData[i]) && $S.isArray(renderData[i].tableData)) {
                lastRow = this._getLastRow(renderData[i].tableData, defaultCount);
                if (!$S.isArray(lastRow)) {
                    continue;
                }
                renderData[i].tableData.push(lastRow);
            }
        }
        return renderData;
    },
    GenerateFinalTaUserData: function(userData) {
        var renderData = [];
        var i;
        var text, userId;
        var fieldsData = DataHandler.getData("fieldsData", {});
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        if ($S.isArray(userData)) {
            for(i=0; i<userData.length; i++) {
                text = $S.findParam(userData[i], "taRowField.entry.name", "", "fieldName", "text");
                userId = $S.findParam(userData[i], "taRowField.entry.name", "", "fieldName", "value");
                if ($S.isObject(text)) {
                    text.name = userId;
                    if (!isNaN(fieldsData[userId])) {
                        text.value = fieldsData[userId];
                    }
                }
            }
        }
        renderData.push({"tableData": userData});
        return renderData;
    }
});

})($S);

export default DataHandlerV2;
