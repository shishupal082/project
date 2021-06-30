import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import TemplateHandler from "../template/TemplateHandler";
import Config from "../Config";

import AppHandler from "../../../common/app/common/AppHandler";
import TemplateHelper from "../../../common/TemplateHelper";
import FormHandler from "./FormHandler";


var FormHandlerAddSupplyItem;

(function($S){
// var DT = $S.getDT();

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
        var addSupplyItem = TemplateHandler.getTemplate("addNewSupplyItem");
        var requiredKeys = [Config.fieldsKey.NewSupplyItemName, Config.fieldsKey.NewSupplyItemDetails];
        var formValue = {};
        var fieldsData = DataHandler.getData("fieldsData", {});
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        for (var i=0; i<requiredKeys.length; i++) {
            formValue[requiredKeys[i]] = fieldsData[requiredKeys[i]];
        }
        TemplateHelper.updateTemplateValue(addSupplyItem, formValue);
        return addSupplyItem;
    },
    saveNewSupplyItem: function(pageName, formData, callback) {
        var resultData = ["table_name", "unique_id", "pid", "username",
                        Config.fieldsKey.NewSupplyItemName, Config.fieldsKey.NewSupplyItemDetails];
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        formData["table_name"] = DataHandler.getTableName(pageName + ".materialSupplyItems");
        if (!$S.isStringV2(formData["table_name"])) {
            alert(FormHandler.GetAleartMessage("tableName.invalid"))
            return;
        }
        formData["unique_id"] = FormHandler.GetUniqueId();
        formData["pid"] = DataHandler.getPathParamsData("pid");
        formData["username"] = AppHandler.GetUserData("username", "");
        formData[Config.fieldsKey.NewSupplyItemDetails] = FormHandler.FormateString(formData[Config.fieldsKey.NewSupplyItemDetails]);
        var finalText = [];
        for(var i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = formData[Config.fieldsKey.NewSupplyItemName];
        postData["heading"] = formData["pid"];
        postData["text"] = [finalText.join(",")];
        postData["filename"] = formData["table_name"] + ".csv";
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callback);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callback);
            if (status === "FAILURE") {
                AppHandler.TrackApiRequest("addSupplyItem", "FAILURE");
                alert("Error in uploading data, Please Try again.");
            } else {
                AppHandler.TrackApiRequest("addSupplyItem", "SUCCESS");
                AppHandler.LazyReload(250);
            }
        });
    },
    submit: function(pageName, callback) {
        var requiredKeys = [Config.fieldsKey.NewSupplyItemName, Config.fieldsKey.NewSupplyItemDetails];
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
            this.saveNewSupplyItem(pageName, formData, callback);
        }
    }
});
})($S);

export default FormHandlerAddSupplyItem;
