import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";


// import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
// import TemplateHelper from "../../common/TemplateHelper";

var DataHandlerAddFieldReport;

(function($S){
var DT = $S.getDT();
DataHandlerAddFieldReport = function(arg) {
    return new DataHandlerAddFieldReport.fn.init(arg);
};
DataHandlerAddFieldReport.fn = DataHandlerAddFieldReport.prototype = {
    constructor: DataHandlerAddFieldReport,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(DataHandlerAddFieldReport);
// "addTextOrder": ["dateTime", "team", "station", "device", "userId", "currentUserId", "currentDateTime"],
DataHandlerAddFieldReport.extend({
    _getUserTeam: function(userTeamMapping) {
        if (!$S.isObject(userTeamMapping)) {
            return "INFO";
        }
        for(var key in userTeamMapping) {
            if (AppHandler.GetUserData(key, false)) {
                return userTeamMapping[key];
            }
        }
        return "INFO";
    },
    _getUserTeamV2: function(userId, userData) {
        if (!$S.isObject(userData) || !$S.isStringV2(userId)) {
            return "INFO";
        }
        for (var team in userData) {
            if (!$S.isArray(userData[team])) {
                continue;
            }
            if (userData[team].indexOf(userId) >= 0) {
                return team;
            }
        }
        return "INFO";
    },
    _generateStringFromPattern: function(pattern, dateTimeStr, username, station, device, team) {
        if (!$S.isString(pattern)) {
            return pattern;
        }
        var tempFilename = DT.getDateTime("YYYY/-/MM/-/DD/-/hh/-/mm","/") + "-report.csv";
        var isErrorFound = false;
        try {
            pattern = DT.getDateTimeV2(dateTimeStr, pattern, "/");
            if ($S.isStringV2(username)) {
                pattern = pattern.replaceAll("username", username);
            }
        } catch(e) {
            isErrorFound = true;
            AppHandler.TrackDebug("Error in generating filename replacing username");
        }
        try {
            if ($S.isStringV2(station)) {
                pattern = pattern.replaceAll("station", station);
            }
        } catch(e) {
            isErrorFound = true;
            AppHandler.TrackDebug("Error in generating filename replacing station");
        }
        try {
            if ($S.isStringV2(device)) {
                pattern = pattern.replaceAll("device", device);
            }
        } catch(e) {
            isErrorFound = true;
            AppHandler.TrackDebug("Error in generating filename replacing device");
        }
        try {
            if ($S.isStringV2(team)) {
                pattern = pattern.replaceAll("team", team);
            }
        } catch(e) {
            isErrorFound = true;
            AppHandler.TrackDebug("Error in generating filename replacing team");
        }
        if (isErrorFound) {
            pattern = tempFilename;
        }
        return pattern;
    },
    saveData: function(formData, callback) {
        var resultData = ["addFieldReport.dateTime.field", "team", "addFieldReport.station",
                        "addFieldReport.device", "addFieldReport.userId.field",
                        "currentUserId", "currentDateTime", "addFieldReport.comment"];
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        var currentAppData = DataHandler.getCurrentAppData({});
        var metaData = DataHandler.getMetaData({});
        var successRedirectPage = $S.findParam([currentAppData, metaData], "addFieldReport.successRedirectPage", "");
        var successRedirectUrl = DataHandler.getPageUrlByPageName(successRedirectPage);
        var addTextFilenamePattern = DataHandler.getAppData("addFieldReport.addTextFilenamePattern", "2021-01-01-00-00-user-field-report.csv");
        var username = AppHandler.GetUserData("username", "");
        var finalText = [], temp, i;
        temp = formData["addFieldReport.comment"].split("\n");
        for (i = 0; i < temp.length; i++) {
            if (temp[i].trim() !== "") {
                finalText.push(temp[i]);
            }
        }
        formData["addFieldReport.comment"] = finalText.join("; ");
        finalText = [];
        for(i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = formData["addFieldReport.station"];
        postData["heading"] = formData["addFieldReport.device"];
        var addTextFilename = this._generateStringFromPattern(addTextFilenamePattern, formData["addFieldReport.dateTime.field"], username, formData["addFieldReport.station"], formData["addFieldReport.device"], formData["team"]);
        postData["text"] = [finalText.join(",")];
        postData["filename"] = addTextFilename;
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callback);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callback);
            // console.log(response);
            if (status === "FAILURE") {
                AppHandler.TrackApiRequest("uploadText", "FAILURE");
                alert("Error in uploading data, Please Try again.");
            } else {
                AppHandler.TrackApiRequest("uploadText", "SUCCESS");
                AppHandler.LazyRedirect(successRedirectUrl, 250);
            }
        });
    }
});
DataHandlerAddFieldReport.extend({
    _getAleartMessage: function(key, value) {
        var messageMapping = {};
        messageMapping["addFieldReport.station"] = "Please select station";
        messageMapping["addFieldReport.device"] = "Please select device";
        messageMapping["addFieldReport.userId.field"] = "Please select userId";
        messageMapping["addFieldReport.comment"] = "Please enter comment";
        messageMapping["addFieldReport.dateTime.field"] = "Please enter date time";
        messageMapping["addFieldReport.dateTime.field.invalid"] = "Please enter valid date time";
        if ($S.isString(messageMapping[key])) {
            return messageMapping[key];
        }
        return "Invalid " + key;
    },
    SubmitForm: function(callback) {
        var currentAppData = DataHandler.getCurrentAppData({});
        var metaData = DataHandler.getMetaData({});
        var formData = {}, i;
        var formDataKey = ["addFieldReport.station", "addFieldReport.device", "addFieldReport.comment"];
        var fieldsData = DataHandler.getData("fieldsData", {});
        formData["currentUserId"] = AppHandler.GetUserData("username", "");
        formData["currentDateTime"] = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm","/");
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        var additionalDataRequired = $S.findParam([currentAppData, metaData], "addFieldReport.additionalDataRequired", []);
        var userTeamMapping = $S.findParam([currentAppData, metaData], "addFieldReport.teamMapping", {});
        var userIds = $S.findParam([currentAppData, metaData], "addFieldReport.userIds", {});
        if (!$S.isArray(additionalDataRequired)) {
            additionalDataRequired = [];
        }
        for(i=0; i<additionalDataRequired.length; i++) {
            formDataKey.push(additionalDataRequired[i] + ".field");
        }
        for(i=0; i<formDataKey.length; i++) {
            if ($S.isString(fieldsData[formDataKey[i]])) {
                formData[formDataKey[i]] = fieldsData[formDataKey[i]];
            } else {
                formData[formDataKey[i]] = "";
            }
        }
        var key, value;
        key = "addFieldReport.dateTime.field";
        if (formDataKey.indexOf(key) >= 0) {
            value = formData[key];
            if (!AppHandler.isValidDateStr(value)) {
                alert(this._getAleartMessage(key + ".invalid", value));
                return;
            }
            if (value.length !== 16) {
                alert(this._getAleartMessage(key, value));
                return;
            }
        } else {
            formData[key] = formData["currentDateTime"];
        }
        key = "addFieldReport.userId.field";
        var team = this._getUserTeam(userTeamMapping);
        if (formDataKey.indexOf(key) >= 0) {
            team = this._getUserTeamV2(formData[key], userIds);
        } else {
            formData[key] = formData["currentUserId"];
        }
        formData["team"] = team;
        for(key in formData) {
            value = formData[key];
            if (!$S.isString(value) || value.length === 0) {
                alert(this._getAleartMessage(key, value));
                return;
            }
        }
        this.saveData(formData, callback);
    }
});

})($S);

export default DataHandlerAddFieldReport;
