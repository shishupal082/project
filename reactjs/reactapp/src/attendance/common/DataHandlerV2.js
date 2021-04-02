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
        var disabledPages = [];
        if ($S.isObject(metaData) && $S.isArray(metaData.disabledPages)) {
            disabledPages = metaData.disabledPages;
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
    _generateResponse: function(response) {
        var finalData = [];
        if ($S.isArray(response)) {
            for (var i = 0; i<response.length; i++) {
                finalData = finalData.concat(AppHandler.ParseTextData(response[i], ",", false, true));
            }
        }
        return finalData;
    },
    handleUserDataLoad: function(response) {
        var userData = this._generateResponse(response);
        var finalUserData = [];
        var i, temp;
        for(i=0; i<userData.length; i++) {
            if (!$S.isArray(userData[i]) || userData[i].length < 6) {
                continue;
            }
            if (!AppHandler.isValidDateStr(userData[i][0])) {
                continue;
            }
            temp = {};
            temp["team"] = userData[i][1];
            temp["teamDisplay"] = temp["team"];
            temp["station"] = userData[i][2];
            temp["stationDisplay"] = temp["station"];
            temp["designation"] = userData[i][3];
            temp["designationDisplay"] = temp["designation"];
            temp["userId"] = userData[i][4];
            temp["username"] = userData[i][5];
            temp["usernameDisplay"] = temp["username"];
            temp["displayName"] = temp["username"] + ", " + temp["station"];
            finalUserData.push(temp);
        }
        DataHandler.setData("userData", finalUserData);
        DataHandler.setData("filteredUserData", finalUserData);
        var metaData = DataHandler.getData("metaData", {});
        var filterDataValues = DataHandler.getFilterDataValues();
        var filterOptions = AppHandler.generateFilterData(metaData, finalUserData, filterDataValues);
        DataHandler.setData("filterOptions", filterOptions);
    },
    handleAttendanceDataLoad: function(response) {
        var attendanceData = this._generateResponse(response);
        var finalAttendanceData = {};
        var latestAttendanceData = {};
        var i, temp, temp2;
        for(i=0; i<attendanceData.length; i++) {
            if (!$S.isArray(attendanceData[i]) || attendanceData[i].length < 5) {
                continue;
            }
            if (!AppHandler.isValidDateStr(attendanceData[i][0])) {
                continue;
            }
            temp = {};
            temp["userId"] = attendanceData[i][1];
            temp["date"] = attendanceData[i][2];
            temp["username"] = attendanceData[i][3];
            temp["type"] = attendanceData[i][4];
            if (!$S.isObject(finalAttendanceData[temp["userId"]])) {
                finalAttendanceData[temp["userId"]] = {"attendance": []};
            }
            finalAttendanceData[temp["userId"]].attendance.push(temp);
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
