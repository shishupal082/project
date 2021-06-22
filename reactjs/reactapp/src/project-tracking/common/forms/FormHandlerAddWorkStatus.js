import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import TemplateHandler from "../template/TemplateHandler";
import Config from "../Config";

import AppHandler from "../../../common/app/common/AppHandler";
import TemplateHelper from "../../../common/TemplateHelper";
import FormHandler from "./FormHandler";


var FormHandlerAddSupplyItem;

(function($S){
var DT = $S.getDT();

FormHandlerAddSupplyItem = function(arg) {
    return new FormHandlerAddSupplyItem.fn.init(arg);
};
FormHandlerAddSupplyItem.fn = FormHandlerAddSupplyItem.prototype = {
    constructor: FormHandlerAddSupplyItem,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(FormHandlerAddSupplyItem);
FormHandlerAddSupplyItem.extend({
    getFormTemplate: function() {
        var newWorkStatus = TemplateHandler.getTemplate("newWorkStatus");
        var requiredKeys = [Config.fieldsKey.DateKey, Config.fieldsKey.DistanceKey,
                            Config.fieldsKey.RemarksKey, Config.fieldsKey.SectionKey];
        var fieldsData = DataHandler.getData("fieldsData", {});
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        var formValues = {};
        for (var i=0; i<requiredKeys.length; i++) {
            formValues[requiredKeys[i]] = fieldsData[requiredKeys[i]];
        }
        if (!AppHandler.isValidDateStr(formValues[Config.fieldsKey.DateKey])) {
            formValues[Config.fieldsKey.DateKey] = DT.getDateTime("YYYY/-/MM/-/DD","/");
            DataHandler.setFieldsData(Config.fieldsKey.DateKey, formValues[Config.fieldsKey.DateKey]);
        }
        TemplateHelper.updateTemplateValue(newWorkStatus, formValues);
        return newWorkStatus;
    },
    saveWorkStatus: function(formData, callback) {
        var resultData = ["table_name", "unique_id", "pid", "username", Config.fieldsKey.SectionKey,
                        Config.fieldsKey.DistanceKey, Config.fieldsKey.DateKey,
                        Config.fieldsKey.RemarksKey];
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        formData["table_name"] = DataHandler.getTableName("projectWorkStatus");
        if (!$S.isStringV2(formData["table_name"])) {
            alert(FormHandler.GetAleartMessage("tableName.invalid"))
            return;
        }
        formData["unique_id"] = FormHandler.GetUniqueId();
        formData["pid"] = DataHandler.getPathParamsData("pid");
        formData["username"] = AppHandler.GetUserData("username", "");
        formData[Config.fieldsKey.RemarksKey] = FormHandler.FormateString(formData[Config.fieldsKey.RemarksKey]);
        var finalText = [];
        for(var i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = formData[Config.fieldsKey.SectionKey];
        postData["heading"] = formData[Config.fieldsKey.DistanceKey] + "km";
        postData["text"] = [finalText.join(",")];
        postData["filename"] = formData["table_name"] + ".csv";
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
    submit: function(callback) {
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
                alert(FormHandler.GetAleartMessage(requiredKeys[i]));
                break;
            }
            if (Config.fieldsKey.DateKey === requiredKeys[i]) {
                if (!AppHandler.isValidDateStr(temp)) {
                    isFormValid = false;
                    alert(FormHandler.GetAleartMessage(requiredKeys[i]));
                    break;
                }
            }
            if (Config.fieldsKey.DistanceKey === requiredKeys[i]) {
                if (!$S.isNumeric(temp)) {
                    isFormValid = false;
                    alert(FormHandler.GetAleartMessage(requiredKeys[i] + ".invalid"));
                    break;
                }
            }
            formData[requiredKeys[i]] = temp;
        }
        if (isFormValid) {
            this.saveWorkStatus(formData, callback);
        }
    }
});
})($S);

export default FormHandlerAddSupplyItem;
