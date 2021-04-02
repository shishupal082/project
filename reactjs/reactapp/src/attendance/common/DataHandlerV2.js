import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";


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
            temp["station"] = userData[i][2];
            temp["userId"] = userData[i][4];
            temp["username"] = userData[i][5];
            temp["displayName"] = temp["username"] + ", " + temp["station"];
            finalUserData.push(temp);
        }
        DataHandler.setData("userData", finalUserData);
        DataHandler.setData("filteredUserData", finalUserData);
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
        if (!$S.isString(url)) {
            return;
        }
        var postData = {};
        var attr = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm","/") + "," + subject+","+heading+",";
        postData["subject"] = subject;
        postData["heading"] = heading;
        postData["text"] = [attr];
        postData["filename"] = "attendance.csv";
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
