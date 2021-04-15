import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";


// import AppHandler from "../../common/app/common/AppHandler";

var DataHandlerTA;

(function($S){
// var DT = $S.getDT();
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
    callAddTextApi: function(subject, heading, addTextFilename, finalText, callBack) {
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        var postData = {};
        postData["subject"] = subject;
        postData["heading"] = heading;
        postData["text"] = finalText;
        postData["filename"] = addTextFilename;
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callBack);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callBack);
            if (status === "FAILURE") {
                alert("Error in uploading data, Please Try again.");
            } else {
                DataHandler.setData("fieldsData", {});
                alert("Data upload completed.");
            }
        });
    },
    SubmitFormClick: function(appStateCallback, appDataCallback) {
        var fieldsData = DataHandler.getData("fieldsData", {});
        var appData = DataHandler.getCurrentAppData();
        var filter2Data = {};
        var filename = null;
        if ($S.isObject(appData)) {
            if ($S.isObject(appData.date)) {
                filter2Data = appData.date;
            }
            if ($S.isString(appData.filename) && appData.filename.length > 0) {
                filename = appData.filename;
            }
        }
        var finalText = [], value, temp3, userData;
        var isFormOk = true;
        for (var userId in fieldsData) {
            value = fieldsData[userId];
            if (isNaN(value)) {
                isFormOk = false;
                alert("Enter value '" + value + "' is incorrect");
                break;
            }
            userData = DataHandler.getUserInfoById(userId);
            if (!$S.isString(userData.userId)) {
                continue;
            }
            temp3 = [];
            if ($S.isString(value) && value.length > 0) {
                temp3.push(filter2Data.date);
                temp3.push(userData.username + " " + filter2Data.option);
                temp3.push("dr");
                temp3.push(value);
                temp3.push(userId);
                temp3.push(userData.username + " " + filter2Data.option);
                temp3.push("cr");
                temp3.push(value);
                temp3.push(filter2Data.value);
                finalText.push(temp3.join(","));
            }
        }
        if (!$S.isString(filename)) {
            alert("Invalid filename.");
        } else if (finalText.length > 0 && isFormOk) {
            this.callAddTextApi(appData.name, filter2Data.option, filename, finalText, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else {
            alert("Atleast one entry required.");
        }
    }
});

})($S);

export default DataHandlerTA;
