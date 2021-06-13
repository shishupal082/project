import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";

import AppHandler from "../../common/app/common/AppHandler";

var FormHandler;

(function($S){
var DT = $S.getDT();

FormHandler = function(arg) {
    return new FormHandler.fn.init(arg);
};
FormHandler.fn = FormHandler.prototype = {
    constructor: FormHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(FormHandler);
FormHandler.extend({
    saveWorkStatus: function(formData, callback) {
        var resultData = ["table_name", "pid", Config.fieldsKey.SectionKey,
                        Config.fieldsKey.DistanceKey, Config.fieldsKey.DateKey,
                        "username", Config.fieldsKey.RemarksKey];
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        formData["table_name"] = "project_work_status";
        formData["pid"] = DataHandler.getPathParamsData("pid");
        formData["username"] = AppHandler.GetUserData("username", "");
        var finalText = [], temp, i;
        temp = formData[Config.fieldsKey.RemarksKey].split("\n");
        for (i = 0; i < temp.length; i++) {
            if (temp[i].trim() !== "") {
                finalText.push(temp[i]);
            }
        }
        formData[Config.fieldsKey.RemarksKey] = finalText.join("; ");
        finalText = [];
        for(i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = formData[Config.fieldsKey.SectionKey];
        postData["heading"] = formData[Config.fieldsKey.DistanceKey] + "km";
        postData["text"] = [finalText.join(",")];
        postData["filename"] = "project_work_status.csv";
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callback);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callback);
            if (status === "FAILURE") {
                AppHandler.TrackApiRequest("updateWorkStatus", "FAILURE");
                alert("Error in uploading data, Please Try again.");
            } else {
                AppHandler.TrackApiRequest("updateWorkStatus", "SUCCESS");
                AppHandler.LazyReload(250);
            }
        });
    },
    saveNewProject: function(formData, callback) {
        var resultData = ["table_name", "pid",
                        Config.fieldsKey.ProjectNameKey, "username"];
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        formData["table_name"] = "project_table";
        formData["pid"] = DT.getDateTime("YYYY/MM/DD/hh/mm/ss/./ms","/");
        formData["username"] = AppHandler.GetUserData("username", "");
        var finalText = [];
        for(var i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = formData[Config.fieldsKey.ProjectNameKey];
        postData["heading"] = formData["pid"];
        postData["text"] = [finalText.join(",")];
        postData["filename"] = "project_table.csv";
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callback);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callback);
            if (status === "FAILURE") {
                AppHandler.TrackApiRequest("addNewProject", "FAILURE");
                alert("Error in uploading data, Please Try again.");
            } else {
                AppHandler.TrackApiRequest("addNewProject", "SUCCESS");
                AppHandler.LazyReload(250);
            }
        });
    }
});
FormHandler.extend({
    _getAleartMessage: function(key, value) {
        var messageMapping = {};
        messageMapping[Config.fieldsKey.DateKey] = "Please enter valid date";
        messageMapping[Config.fieldsKey.SectionKey] = "Please select section";
        messageMapping[Config.fieldsKey.RemarksKey] = "Remarks Required";
        messageMapping[Config.fieldsKey.DistanceKey] = "Distance Required";
        messageMapping[Config.fieldsKey.ProjectNameKey] = "Project Name Required";
        messageMapping[Config.fieldsKey.DistanceKey + ".invalid"] = "Enter Valid Distance";
        if ($S.isString(messageMapping[key])) {
            return messageMapping[key];
        }
        return "Invalid " + key;
    }
});
FormHandler.extend({
    submitNewWorkStatus: function(callback) {
        var requiredKeys = [Config.fieldsKey.DateKey, Config.fieldsKey.DistanceKey,
                            Config.fieldsKey.RemarksKey, Config.fieldsKey.SectionKey];
        var fieldsData = DataHandler.getData("fieldsData", {});
        var i, isFormValid = true, temp, formData = {};
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        for (i=0; i<requiredKeys.length; i++) {
            temp = fieldsData[requiredKeys[i]];
            if (!$S.isStringV2(temp)) {
                isFormValid = false;
                alert(this._getAleartMessage(requiredKeys[i]));
                break;
            }
            if (Config.fieldsKey.DateKey === requiredKeys[i]) {
                if (!AppHandler.isValidDateStr(temp)) {
                    isFormValid = false;
                    alert(this._getAleartMessage(requiredKeys[i]));
                    break;
                }
            }
            if (Config.fieldsKey.DistanceKey === requiredKeys[i]) {
                if (!$S.isNumeric(temp)) {
                    isFormValid = false;
                    alert(this._getAleartMessage(requiredKeys[i] + ".invalid"));
                    break;
                }
            }
            formData[requiredKeys[i]] = temp;
        }
        if (isFormValid) {
            this.saveWorkStatus(formData, callback);
        }
    },
    submitNewProject: function(callback) {
        var requiredKeys = [Config.fieldsKey.ProjectNameKey];
        var fieldsData = DataHandler.getData("fieldsData", {});
        var i, isFormValid = true, temp, formData = {};
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        for (i=0; i<requiredKeys.length; i++) {
            temp = fieldsData[requiredKeys[i]];
            if (!$S.isStringV2(temp)) {
                isFormValid = false;
                alert(this._getAleartMessage(requiredKeys[i]));
                break;
            }
            formData[requiredKeys[i]] = temp;
        }
        if (isFormValid) {
            this.saveNewProject(formData, callback);
        }
    }
});
})($S);

export default FormHandler;
