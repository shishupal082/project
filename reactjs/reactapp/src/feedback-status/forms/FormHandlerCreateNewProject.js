import $S from "../../interface/stack.js";
import DataHandler from "../common/DataHandler";
import TemplateHandler from "../common/TemplateHandler";
import Config from "../common/Config";

import CommonConfig from "../../common/app/common/CommonConfig";
import AppHandler from "../../common/app/common/AppHandler";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";
// import TemplateHelper from "../../common/TemplateHelper";
import FormHandler from "./FormHandler";


var FormHandlerCreateNewProject;

(function($S){
// var DT = $S.getDT();

FormHandlerCreateNewProject = function(arg) {
    return new FormHandlerCreateNewProject.fn.init(arg);
};
FormHandlerCreateNewProject.fn = FormHandlerCreateNewProject.prototype = {
    constructor: FormHandlerCreateNewProject,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(FormHandlerCreateNewProject);
FormHandlerCreateNewProject.extend({
    getFormTemplate: function() {
        var newProjectTemplate = TemplateHandler.getTemplate("home.addNewProject");
        return newProjectTemplate;
    },
    saveNewProject: function(formData, callback) {
        var resultData = ["table_name", "unique_id", "username", Config.fieldsKey.ProjectNameKey];
        var url = CommonConfig.getApiUrl("getAddTextApiV2", null, true);
        if (!$S.isString(url)) {
            return;
        }
        formData["table_name"] = DataHandler.getTableName("projectTable");
        if (!$S.isStringV2(formData["table_name"])) {
            alert(FormHandler.GetAleartMessage("tableName.invalid"))
            return;
        }
        formData["unique_id"] = FormHandler.GetUniqueId();
        formData["username"] = AppHandler.GetUserData("username", "");
        var finalText = [];
        for(var i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = formData[Config.fieldsKey.ProjectNameKey];
        postData["heading"] = formData["pid"];
        postData["text"] = [finalText.join(",")];
        postData["filename"] = formData["table_name"] + ".csv";
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callback);
        $S.sendPostRequest(CommonConfig.JQ, url, postData, function(ajax, status, response) {
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
    },
    submit: function(callback) {
        var requiredKeys = [Config.fieldsKey.ProjectNameKey];
        var fieldsData = CommonDataHandler.getData("fieldsData", {});
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
            this.saveNewProject(formData, callback);
        }
    }
});
})($S);

export default FormHandlerCreateNewProject;
