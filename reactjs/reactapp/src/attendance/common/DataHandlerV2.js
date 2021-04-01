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
                finalData = finalData.concat(AppHandler.ParseTextData(response[i], ",", true, true));
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
    },
    handleAttendanceDataLoad: function(response) {
        var attendanceData = this._generateResponse(response);
        var tempAttendanceData = [], finalAttendanceData = [];
        var tempData = {};
        var i, temp;
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
            if (!$S.isObject(tempData[temp["userId"]])) {
                tempData[temp["userId"]] = {"attendance": []};
            }
            tempData[temp["userId"]].attendance.push(temp);
            tempAttendanceData.push(temp);
        }

        DataHandler.setData("attendanceData", tempData);
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
        var allDate, tempAllDate, arrangedDate;
        if ($S.isArray(finalMetaData.dateRange) && finalMetaData.dateRange.length === 2) {
            allDate = AppHandler.GenerateDateBetween2Date(finalMetaData.dateRange[0], finalMetaData.dateRange[1]);
            tempAllDate = allDate.map(function(el, i, arr){
                return el.dateStr;
            });
            arrangedDate = AppHandler.generateDateSelectionParameter(tempAllDate);
            if ($S.isObject(arrangedDate)) {
                for(var key in arrangedDate) {
                    if ($S.isArray(arrangedDate[key])) {
                        for (i=0; i<arrangedDate[key].length; i++) {
                            if ($S.isArray(arrangedDate[key][i].dateRange) && arrangedDate[key][i].dateRange.length === 2) {
                                arrangedDate[key][i].allDate = AppHandler.GenerateDateBetween2Date(arrangedDate[key][i].dateRange[0], arrangedDate[key][i].dateRange[1]);
                            }
                        }
                    }
                }
            }
        }
        DataHandler.setData("dateParameters", arrangedDate);
        DataHandler.metaDataInit();
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
