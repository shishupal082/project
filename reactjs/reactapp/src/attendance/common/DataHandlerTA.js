import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";

import AppHandler from "../../common/app/common/AppHandler";
import CommonConfig from "../../common/app/common/CommonConfig";

var DataHandlerTA;

(function($S){
var DT = $S.getDT();
DataHandlerTA = function(arg) {
    return new DataHandlerTA.fn.init(arg);
};
DataHandlerTA.fn = DataHandlerTA.prototype = {
    constructor: DataHandlerTA,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(DataHandlerTA);

DataHandlerTA.extend({
    callAddTextApi: function(subject, heading, addTextFilename, finalText, callback) {
        var url = CommonConfig.getApiUrl("getAddTextApiV2", null, true);
        if (!$S.isString(url)) {
            return;
        }
        var postData = {};
        postData["text"] = finalText;
        postData["filename"] = addTextFilename;
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callback);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            if (status === "FAILURE") {
                alert("Error in uploading data, Please Try again.");
                $S.callMethod(callback);
            } else {
                DataHandler.setData("fieldsData", {});
                alert("Data upload completed.");
                // $S.callMethod(callback);
                AppHandler.LazyReload(250);
            }
        });
    },
    SubmitFormClick: function(callback) {
        var fieldsData = DataHandler.getData("fieldsData", {});
        var appData = DataHandler.getCurrentAppData({});
        var metaData = DataHandler.getMetaData({});
        var filename = $S.findParam([appData, metaData], "filename", "");
        var dateField = DataHandler.getCurrentList3Data();
        if (!$S.isString(filename) || filename.length === 0) {
            alert("Invalid filename.");
            return;
        }
        if (!$S.isObject(dateField) || !AppHandler.isValidDateStr(dateField.date)) {
            alert("Invalid date parameter.");
            return;
        } else if (!$S.isString(dateField.value) || dateField.value.length < 1) {
            alert("Invalid date parameter.");
            return;
        }
        var finalText = [], value, temp3, userData;
        var isFormOk = true;
        var userId, name;
        var entryTime = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm/:/ss/./ms","/");
        var uploadedBy = AppHandler.GetUserData("username", "");
        for (var key in fieldsData) {
            value = fieldsData[key];
            if (isNaN(value)) {
                isFormOk = false;
                alert("Enter value '" + value + "' is incorrect");
                break;
            }
            userData = DataHandler.getUserInfoById(key);
            userId = $S.findParam(userData, "userId", "", "name", "value");
            name = $S.findParam(userData, "name", "", "name", "value");
            if (!$S.isString(userId) || userId.length === 0) {
                continue;
            }
            temp3 = [];
            if ($S.isString(value) && value.length > 0) {
                temp3.push(dateField.date);
                temp3.push(name + " " + dateField.text);
                temp3.push("dr");
                temp3.push(value);
                temp3.push(userId);
                temp3.push(name + " " + dateField.text);
                temp3.push("cr");
                temp3.push(value);
                temp3.push(dateField.value);
                temp3.push(entryTime);
                temp3.push(uploadedBy);
                finalText.push(temp3.join(","));
            }
        }
        if (finalText.length > 0 && isFormOk) {
            this.callAddTextApi(appData.name, dateField.text, filename, finalText, function() {
                $S.callMethod(callback);
            });
        } else {
            alert("Atleast one entry required.");
        }
    }
});

})($S);

export default DataHandlerTA;
