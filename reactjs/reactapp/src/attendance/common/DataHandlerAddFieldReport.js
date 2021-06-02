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
    _generateStringFromPattern: function(pattern, username, device, team) {
        if (!$S.isString(pattern)) {
            return pattern;
        }
        try {
            pattern = DT.getDateTime(pattern, "/");
            if ($S.isString(username)) {
                pattern = pattern.replaceAll("username", username);
            }
            if ($S.isString(device)) {
                pattern = pattern.replaceAll("device", device);
            }
            if ($S.isString(team)) {
                pattern = pattern.replaceAll("team", team);
            }
        } catch(e) {
            // DataHandler.TrackDebug("Error in generating " + name);
            pattern = DT.getDateTime("YYYY/-/MM/-/DD/-/hh/-/mm","/") + "-report.csv";
        }
        return pattern;
    },
    _generateFinalRedirectUrl: function(pattern, basepathname, dbview) {
        if (!$S.isString(pattern)) {
            return pattern;
        }
        try {
            pattern = pattern.replaceAll("{basepathname}", basepathname);
            pattern = pattern.replaceAll("{dbview}", dbview);
        } catch(e) {
            // DataHandler.TrackDebug("Error in generating " + name);
            pattern = basepathname + "/" + dbview;
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
        var currentAppData = DataHandler.getCurrentAppData();
        var metaData = DataHandler.getData("metaData", {});
        var successRedirectUrl = $S.findParam([currentAppData, metaData], "addFieldReport.successRedirectUrl", "");
        var userTeamMapping = $S.findParam([currentAppData, metaData], "addFieldReport.teamMapping", {});
        var addTextFilenamePattern = $S.findParam([currentAppData, metaData], "addFieldReport.addTextFilenamePattern", "2021-01-01-00-00-field-report.csv");
        var username = AppHandler.GetUserData("username", "");
        var team = this._getUserTeam(userTeamMapping);
        formData["team"] = team;
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
        var addTextFilename = this._generateStringFromPattern(addTextFilenamePattern, username, formData["addFieldReport.device"], team);
        postData["text"] = [finalText.join(",")];
        postData["filename"] = addTextFilename;
        successRedirectUrl = this._generateFinalRedirectUrl(successRedirectUrl, Config.basepathname, Config.dbview);
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callback);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callback);
            // console.log(response);
            if (status === "FAILURE") {
                // DataHandler.TrackApiRequest("uploadText", "FAILURE");
                alert("Error in uploading data, Please Try again.");
            } else {
                // DataHandler.TrackApiRequest("uploadText", "SUCCESS");
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
        var currentAppData = DataHandler.getCurrentAppData();
        var metaData = DataHandler.getData("metaData", {});
        var formData = {}, i;
        var formDataKey = ["addFieldReport.station", "addFieldReport.device", "addFieldReport.comment"];
        var fieldsData = DataHandler.getData("fieldsData", {});
        formData["currentUserId"] = AppHandler.GetUserData("username", "");
        formData["currentDateTime"] = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm","/");
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        var additionalDataRequired = $S.findParam([currentAppData, metaData], "addFieldReport.additionalDataRequired", []);
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
            if (value.length !== 16) {
                alert(this._getAleartMessage(key, value));
                return;
            }
            if (!AppHandler.isValidDateStr(value)) {
                alert(this._getAleartMessage(key + ".invalid", value));
                return;
            }
        } else {
            formData[key] = formData["currentDateTime"];
        }
        key = "addFieldReport.userId.field";
        if (formDataKey.indexOf(key) < 0) {
            formData[key] = formData["currentUserId"];
        }
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
