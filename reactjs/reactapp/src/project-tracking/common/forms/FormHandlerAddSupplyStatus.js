import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import TemplateHandler from "../template/TemplateHandler";
import Config from "../Config";

import AppHandler from "../../../common/app/common/AppHandler";
import TemplateHelper from "../../../common/TemplateHelper";
import FormHandler from "./FormHandler";


var FormHandlerAddSupplyStatus;

(function($S){
// var DT = $S.getDT();

FormHandlerAddSupplyStatus = function(arg) {
    return new FormHandlerAddSupplyStatus.fn.init(arg);
};
FormHandlerAddSupplyStatus.fn = FormHandlerAddSupplyStatus.prototype = {
    constructor: FormHandlerAddSupplyStatus,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(FormHandlerAddSupplyStatus);
FormHandlerAddSupplyStatus.extend({
    getFormTemplate: function() {
        var addSupplyStatus = TemplateHandler.getTemplate("addSupplyStatus");
        var requiredKeys = [Config.fieldsKey.Value, Config.fieldsKey.supplyDiscription,
                            Config.fieldsKey.RemarksKey];
        var fieldsData = DataHandler.getData("fieldsData", {});
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        var formValues = {}, formText = {};
        for (var i=0; i<requiredKeys.length; i++) {
            formValues[requiredKeys[i]] = fieldsData[requiredKeys[i]];
        }
        TemplateHelper.updateTemplateValue(addSupplyStatus, formValues);
        var supplyDiscriptionTemplate = DataHandler.getAppData(Config.fieldsKey.supplyDiscription, []);
        if (!$S.isArray(supplyDiscriptionTemplate)) {
            supplyDiscriptionTemplate = [];
        }
        formText[Config.fieldsKey.supplyDiscription] = supplyDiscriptionTemplate;
        TemplateHelper.updateTemplateText(addSupplyStatus, formText);
        return addSupplyStatus;
    },
    saveAddSupplyStatus: function(pageName, formData, callback) {
        var resultData = ["table_name", "unique_id", "pid", "sid", "username", Config.fieldsKey.supplyDiscription,
                        Config.fieldsKey.Value, Config.fieldsKey.RemarksKey];
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        formData["table_name"] = DataHandler.getTableName(pageName + ".materialSupplyStatus");
        if (!$S.isStringV2(formData["table_name"])) {
            alert(FormHandler.GetAleartMessage("tableName.invalid"))
            return;
        }
        formData["unique_id"] = FormHandler.GetUniqueId();
        formData["pid"] = DataHandler.getPathParamsData("pid");
        formData["sid"] = DataHandler.getPathParamsData("sid");
        formData["username"] = AppHandler.GetUserData("username", "");
        formData[Config.fieldsKey.RemarksKey] = FormHandler.FormateString(formData[Config.fieldsKey.RemarksKey]);
        var finalText = [];
        for(var i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = formData[Config.fieldsKey.supplyDiscription];
        postData["heading"] = formData["pid"];
        postData["text"] = [finalText.join(",")];
        postData["filename"] = formData["table_name"] + ".csv";
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callback);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callback);
            if (status === "FAILURE") {
                AppHandler.TrackApiRequest("updatedSupplyStatus", "FAILURE");
                alert("Error in uploading data, Please Try again.");
            } else {
                AppHandler.TrackApiRequest("updatedSupplyStatus", "SUCCESS");
                AppHandler.LazyReload(250);
            }
        });
    },
    submit: function(pageName, callback) {
        var requiredKeys = [Config.fieldsKey.Value, Config.fieldsKey.supplyDiscription, Config.fieldsKey.RemarksKey];
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
            formData[requiredKeys[i]] = AppHandler.ReplaceComma(temp);
        }
        if (isFormValid) {
            this.saveAddSupplyStatus(pageName, formData, callback);
        }
    }
});
})($S);

export default FormHandlerAddSupplyStatus;
