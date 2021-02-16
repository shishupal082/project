import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";


import AppHandler from "../../common/app/common/AppHandler";

var DataHandlerV2;

(function($S){
// var DT = $S.getDT();
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
	callAddTextApi: function(subject, heading, addTextFilename, finalText, callBack) {
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        var successRedirectUrl = Config.basepathname;//Config.getApiUrl("", "", false);
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
                AppHandler.LazyRedirect(successRedirectUrl, 250);
            }
        });
    },
	SubmitFormClick: function(appStateCallback, appDataCallback) {
		var fieldsData = DataHandler.getData("fieldsData", {});
		var currentAppId = DataHandler.getData("currentAppId", "");
		// var filter2 = DataHandler.getData("filter2", "");
		var appData = DataHandler.getCurrentAppData();
		var filter2Data = DataHandler.getCurrentFilter2Data();
		var finalText = [], value, temp3, userData;
		var isFormOk = true;
		if ($S.isObject(filter2Data) && $S.isString(filter2Data.date)) {
			for (var usedid in fieldsData) {
				value = fieldsData[usedid];
				if (isNaN(value)) {
					isFormOk = false;
					alert("Enter value '" + value + "' is incorrect");
					break;
				}
				userData = DataHandler.getUserInfoById(usedid);
				if (!$S.isString(userData.id)) {
					continue;
				}
				temp3 = [];
				if ($S.isString(value) && value.length > 0) {
					temp3.push(filter2Data.date);
					temp3.push(userData.name + " " + filter2Data.option);
					temp3.push("dr");
					temp3.push(value);
					temp3.push(usedid);
					temp3.push(userData.name  + " " + filter2Data.option);
					temp3.push("cr");
					temp3.push(value);
					temp3.push(filter2Data.value);
					finalText.push(temp3.join(","));
				}
			}
		}
		var filename = currentAppId + ".csv";
		if (finalText.length > 0 && isFormOk) {
			this.callAddTextApi(appData.name, filter2Data.option, filename, finalText);
		} else {
			alert("Atleast one entry required");
		}
	}
});

DataHandlerV2.extend({
	HandleUserDataCsvLoad: function(response) {
		var responseArr = AppHandler.ParseCSVData(response);
		var metaData = DataHandler.getData("metaData", {});
		var accounts = [];
		for (var i = 0; i < responseArr.length; i++) {
			if (responseArr[i].length > 0) {
				if (["true"].indexOf(responseArr[i][0]) < 0) {
					continue;
				}
			} else {
				continue;
			}
			if (responseArr[i].length >= 6) {
				accounts.push({"id": responseArr[i][3],
					"name": responseArr[i][5],
					"team": responseArr[i][1],
					"station": responseArr[i][2],
					"designation": responseArr[i][4]});
			} else {
				$S.log("Invalid entry: " + responseArr[i].join(","));
			}
		}
		metaData.accounts = accounts;
		DataHandler.setData("metaData", metaData);
	}
});

})($S);

export default DataHandlerV2;
