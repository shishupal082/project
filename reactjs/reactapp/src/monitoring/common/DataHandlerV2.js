import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";


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
    generateFileInfo: function (str) {
        if (!$S.isString(str)) {
            return null;
        }
        function parseDateHeading(filename) {
            var dateHeading = "others";
            var p1 = /[1-9]{1}[0-9]{3}-[0-1][0-9]-[0-3][0-9]/i;
            var dateObj, temp;
            if ($S.isString(filename) && filename.length >= 10) {
                temp = filename.substring(0, 10);
                dateObj = DT.getDateObj(temp);
                if (dateObj !== null) {
                    if (temp.search(p1) >= 0) {
                        dateHeading = temp;
                    }
                }
            }
            return dateHeading;
        }
        var strArr = str.split("/");
        var r = {}, temp;
        if (strArr.length === 2) {
            r = {"actualFilename": str, "filename": strArr[1], "username": strArr[0], "ext": "", "dateHeading": ""};
            r["dateHeading"] = parseDateHeading(r["filename"]);
            temp = r.filename.split(".");
            if (temp.length > 1) {
                r["ext"] = temp[temp.length-1];
            }
            return r;
        }
        return null;
    },
    GenerateFilesInfoResponse: function(response) {
        var tempResult = [];
        var finalResult = [];
        var dashboardResult = [];
        function reverseFileName(obj) {
            if (!$S.isObject(obj) || !$S.isString(obj.filepath)) {
                return obj;
            }
            var str = obj.filepath;
            var strArr = str.split("/");
            if (strArr.length === 2) {
                obj.filepath = strArr[1] + "/" + strArr[0];
            }
            return obj;
        }
        if ($S.isArray(response)) {
            var i, fileResponse;
            for(i=0; i<response.length; i++) {
                fileResponse = reverseFileName(response[i]);
                if (fileResponse !== null) {
                    tempResult.push(fileResponse);
                }
            }
            tempResult = tempResult.sort(function(a,b) {
                if ($S.isObject(a) && $S.isObject(b)) {
                    if ($S.isString(a.filepath)) {
                        return a.filepath.localeCompare(b.filepath);
                    }
                }
                return -1;
            });
            for(i=0; i<tempResult.length; i++) {
                fileResponse = reverseFileName(tempResult[i]);
                if (fileResponse !== null) {
                    finalResult.push(fileResponse);
                }
            }
            for(i=finalResult.length-1; i>=0; i--) {
                fileResponse = DataHandlerV2.generateFileInfo(finalResult[i].filepath);
                Object.assign(finalResult[i], fileResponse);
                dashboardResult.push(finalResult[i]);
            }
        }
        return dashboardResult;
    },
});

DataHandlerV2.extend({
    callAddTextApi: function(station, device, text, callBack) {
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        if ($S.isString(text)) {
            var finalText = [], temp;
            temp = text.split("\n");
            for (var i = 0; i < temp.length; i++) {
                if (temp[i].trim() !== "") {
                    finalText.push(temp[i]);
                }
            }
            text = finalText.join("; ");
        }
        var entryByDateUrl = Config.getApiUrl("entryByDateUrl", "", false);
        var postData = {};
        var currentDateTime = DT.getDateTime("YYYY/-/MM/-/DD/-/hh/-/mm","/");
        var currentDateTime2 = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm","/");
        var username = AppHandler.GetUserData("username", "");
        var team = DataHandler.getData("userTeam", "info");
        postData["subject"] = station;
        postData["heading"] = team+","+device;
        postData["text"] = [currentDateTime2+","+team+","+station+","+device+","+text+","+username];
        postData["filename"] = currentDateTime + "-report.csv";
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callBack);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callBack);
            // console.log(response);
            if (status === "FAILURE") {
                DataHandler.TrackApiRequest("uploadText", "FAILURE");
                alert("Error in uploading data, Please Try again.");
            } else {
                DataHandler.TrackApiRequest("uploadText", "SUCCESS");
                AppHandler.LazyRedirect(entryByDateUrl, 250);
            }
        });
    },
    callUploadFileApi: function(station, device, file, callBack) {
        var url = Config.getApiUrl("uploadfileApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        url += "?u=" + AppHandler.GetUserData("username", "");
        var team = DataHandler.getData("userTeam", "info");
        var formData = new FormData();
        formData.append("subject", station);
        formData.append("heading", team+","+device);
        formData.append("file", file);
        var uploadFileMessage = "Uploaded File";
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callBack);
        $S.uploadFile(Config.JQ, url, formData, function(ajax, status, response) {
            if (status === "FAILURE") {
                DataHandler.TrackApiRequest("uploadFile", "Api-FAILURE");
                DataHandler.setData("addentry.submitStatus", "completed");
                $S.callMethod(callBack);
                alert("Error in uploading file, Please Try again.");
            } else {
                if ($S.isObject(response)) {
                    if (response.status === "FAILURE") {
                        if ($S.isString(response.error)) {
                            alert(response.error);
                        } else {
                            alert("Error in uploading file, Please try again.");
                        }
                        DataHandler.TrackApiRequest("uploadFile", "FAILURE");
                        DataHandler.setData("addentry.submitStatus", "completed");
                        $S.callMethod(callBack);
                    } else {
                        DataHandler.TrackApiRequest("uploadFile", "SUCCESS");
                        if ($S.isObject(response.data) && $S.isString(response.data.fileName) && response.data.fileName.length > 0) {
                            uploadFileMessage = "Uploaded file: " + response.data.fileName + "," + station + "," + team + "," + device;
                        }
                        DataHandlerV2.callAddTextApi(station, device, uploadFileMessage);
                    }
                }
            }
        }, function(percentComplete) {
            DataHandler.setData("addentry.fileUploadPercentage", percentComplete);
            $S.callMethod(callBack);
        });
    }
});

DataHandlerV2.extend({
    SubmitFormClick: function(appStateCallback, appDataCallback) {
        var currentPageName = DataHandler.getData("currentPageName", null);
        var subject = DataHandler.getData("addentry.subject", "");
        var heading = DataHandler.getData("addentry.heading", "");
        var comment = DataHandler.getData("addentry.textarea", "");
        var file = DataHandler.getData("addentry.file", null, true);
        if (subject.length < 1) {
            alert("Please select station");
            return;
        }
        if (heading.length < 1) {
            alert("Please select device");
            return;
        }
        if (currentPageName === "addentry") {
            if (comment.length < 1) {
                alert("Please enter comment");
                return;
            }
            this.callAddTextApi(subject, heading, comment, function() {
                DataHandler.ForceReload(appStateCallback, appDataCallback);
            });
        } else if (currentPageName === "uploadfile") {
            if (!$S.isObject(file)) {
                alert("Please select file");
                return;
            }
            this.callUploadFileApi(subject, heading, file, function() {
                DataHandler.ForceReload(appStateCallback, appDataCallback);
            });
        }
    }
});

})($S);

export default DataHandlerV2;
