import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import TemplateHandler from "../template/TemplateHandler";
import Config from "../Config";

import AppHandler from "../../../common/app/common/AppHandler";
import TemplateHelper from "../../../common/TemplateHelper";
// import CommonConfig from "../../../common/app/common/CommonConfig";
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
        var resultData = ["table_name", "unique_id", "username", "pid", "subject", Config.fieldsKey.AddProjectComment];
        formData["pid"] = DataHandler.getPathParamsData("pid", "");
        formData["subject"] = "Comment";
        var tableName = DataHandler.getTableName("pageName:" + pageName + ".projectComment");
        FormHandler.saveProjectContent(formData, resultData, tableName, "Subject", "Heading", "addProjectComment", function(formStatus, resultStatus) {
            if (formStatus === "in_progress") {
                $S.callMethod(callback);
            } else if (resultStatus === "SUCCESS") {
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
