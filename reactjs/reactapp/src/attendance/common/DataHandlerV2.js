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
        if (!$S.isArray(disabledPages)) {
            disabledPages = [];
        }
        var pages = Config.pages;
        var list2Data = [];
        for(var key in pages) {
            if (key !== "home" && disabledPages.indexOf(key) < 0) {
                list2Data.push({"name": key, "toText": $S.capitalize(key), "toUrl": pages[key]});
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
    handleUserDataLoad: function() {
        var finalUserData = this.getDBViewTableData("table1");
        DataHandler.setData("userData", finalUserData);
        DataHandler.setData("filteredUserData", finalUserData);
    },
    handleAttendanceDataLoad: function() {
        var attendanceData = this.getDBViewTableData("table2");
        var finalAttendanceData = {};
        var latestAttendanceData = {};
        var i, userId, temp, temp2;
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
                        latestAttendanceData[key].attendance.push(temp2);
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

})($S);

export default DataHandlerV2;
