import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";


// import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
import CommonConfig from "../../common/app/common/CommonConfig";
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
// "addTextOrder": ["uiUserId", "team", "station", "device", "comment"]
// "finalTextOrder": ["sNo","entryTime","addedBy","tableName","tableUniqueId","uiEntryTime","uiUserId", "team", "station", "device", "remarks"]
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
    _generateStringFromPattern: function(pattern, dateTimeStr) {
        if (!$S.isString(pattern)) {
            return pattern;
        }
        var tempFilename = "field_report_" + DT.getDateTime("YYYY/-/MMM","/") + ".csv";
        var isErrorFound = false;
        try {
            pattern = DT.getDateTimeV2(dateTimeStr, pattern, "/");
        } catch(e) {
            isErrorFound = true;
            AppHandler.TrackDebug("Error in generating filename from pattern given");
        }
        if (isErrorFound) {
            pattern = tempFilename;
        }
        return pattern;
    },
    saveData: function(formData, uiEntryTime, callback) {
        // team,station,device,uiUserId,comment
        var resultData = ["addFieldReport.userId.field", "team", "addFieldReport.station",
                        "addFieldReport.device", "addFieldReport.comment"];
        var url = CommonConfig.getApiUrl("getAddTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        var currentAppData = DataHandler.getCurrentAppData({});
        var metaData = DataHandler.getMetaData({});
        var successRedirectPage = $S.findParam([currentAppData, metaData], "addFieldReport.successRedirectPage", "");
        var successRedirectUrl = DataHandler.getPageUrlByPageName(successRedirectPage);
        var addTextFilenamePattern = DataHandler.getAppData("addFieldReport.addTextFilenamePattern", "");
        var tableName = DataHandler.getAppData("addFieldReport.tableName", "");
        if (!$S.isStringV2(tableName)) {
            alert("Invalid table name");
            return;
        }
        if (!$S.isStringV2(addTextFilenamePattern)) {
            alert("Invalid filename pattern");
            return;
        }
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
        var addTextFilename = this._generateStringFromPattern(addTextFilenamePattern, formData["addFieldReport.dateTime.field"]);
        postData["text"] = [finalText.join(",")];
        postData["filename"] = addTextFilename;
        postData["tableName"] = tableName;
        postData["uiEntryTime"] = uiEntryTime;
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callback);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callback);
            // console.log(response);
            if (status === "FAILURE" || ($S.isObjectV2(response) && response.status === "FAILURE")) {
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
        var currentUserId = AppHandler.GetUserData("username", "");
        var uiEntryTime = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm","/");
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
            uiEntryTime = value;
        }
        key = "addFieldReport.userId.field";
        var team = this._getUserTeam(userTeamMapping);
        if (formDataKey.indexOf(key) >= 0) {
            team = this._getUserTeamV2(formData[key], userIds);
        } else {
            formData[key] = currentUserId;
        }
        formData["team"] = team;
        for(key in formData) {
            value = formData[key];
            if (!$S.isString(value) || value.length === 0) {
                alert(this._getAleartMessage(key, value));
                return;
            }
        }
        this.saveData(formData, uiEntryTime, callback);
    }
});

})($S);

export default DataHandlerAddFieldReport;
