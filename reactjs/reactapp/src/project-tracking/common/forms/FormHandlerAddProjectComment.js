import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import TemplateHandler from "../template/TemplateHandler";
import Config from "../Config";

import AppHandler from "../../../common/app/common/AppHandler";
import TemplateHelper from "../../../common/TemplateHelper";
import CommonConfig from "../../../common/app/common/CommonConfig";
import FormHandler from "./FormHandler";


var FormHandlerAddProjectComment;

(function($S){
// var DT = $S.getDT();

FormHandlerAddProjectComment = function(arg) {
    return new FormHandlerAddProjectComment.fn.init(arg);
};
FormHandlerAddProjectComment.fn = FormHandlerAddProjectComment.prototype = {
    constructor: FormHandlerAddProjectComment,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(FormHandlerAddProjectComment);
FormHandlerAddProjectComment.extend({
    getFormTemplate: function(pageName) {
        var template = TemplateHandler.getTemplate("addCommentProjectTemplate");
        var requiredKeys = [Config.fieldsKey.AddProjectComment];
        var formValue = {};
        var fieldsData = DataHandler.getData("fieldsData", {});
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        for (var i=0; i<requiredKeys.length; i++) {
            formValue[requiredKeys[i]] = fieldsData[requiredKeys[i]];
        }
        TemplateHelper.updateTemplateValue(template, formValue);
        return template;
    },
    save: function(pageName, formData, callback) {
        var resultData = ["table_name", "unique_id", "pid", "username", "subject",
                        Config.fieldsKey.AddProjectComment];
        var url = CommonConfig.getApiUrl("getAddTextApiV2", null, true);
        if (!$S.isString(url)) {
            return;
        }
        formData["table_name"] = DataHandler.getTableName("pageName:" + pageName + ".projectComment");
        if (!$S.isStringV2(formData["table_name"])) {
            alert(FormHandler.GetAleartMessage("tableName.invalid"))
            return;
        }
        formData["unique_id"] = FormHandler.GetUniqueId();
        formData["pid"] = DataHandler.getPathParamsData("pid");
        formData["username"] = AppHandler.GetUserData("username", "");
        formData["subject"] = "Comment";
        formData[Config.fieldsKey.AddProjectComment] = FormHandler.FormateString(formData[Config.fieldsKey.AddProjectComment]);
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
        $S.sendPostRequest(CommonConfig.JQ, url, postData, function(ajax, status, response) {
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
        var requiredKeys = [Config.fieldsKey.AddProjectComment];
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
            this.save(pageName, formData, callback);
        }
    }
});
})($S);

export default FormHandlerAddProjectComment;
