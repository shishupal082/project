import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import Config from "../Config";

import TemplateHelper from "../../../common/TemplateHelper";
import AppHandler from "../../../common/app/common/AppHandler";


import FormHandlerAddSupplyStatus from "./FormHandlerAddSupplyStatus";
import FormHandlerAddSupplyItem from "./FormHandlerAddSupplyItem";
import FormHandlerCreateNewProject from "./FormHandlerCreateNewProject";
import FormHandlerAddWorkStatus from "./FormHandlerAddWorkStatus";
import FormHandlerUploadFile from "./FormHandlerUploadFile";
import FormHandlerAddProjectComment from "./FormHandlerAddProjectComment";

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
    GetAleartMessage: function(key, value) {
        var messageMapping = Config.messageMapping;
        if ($S.isObject(messageMapping) && $S.isString(messageMapping[key])) {
            return messageMapping[key];
        }
        return "Invalid " + key;
    },
    FormateString: function(str) {
        if (!$S.isStringV2(str)) {
            return str;
        }
        var temp = str.split("\n"), finalText = [];
        for (var i = 0; i < temp.length; i++) {
            if (temp[i].trim() !== "") {
                finalText.push(temp[i]);
            }
        }
        return finalText.join("; ");
    },
    GetUniqueId: function() {
        return DT.getDateTime("YYYY/MM/DD/hh/mm/ss/./ms","/");
    },
    IsResponseFailure: function(response, dafaultMessage) {
        if (!$S.isObject(response)) {
            alert(dafaultMessage);
            return true;
        }
        if (response.status === "FAILURE") {
            if (response.failureCode === "UNAUTHORIZED_USER") {
                alert(response.error);
                AppHandler.LazyReload(250);
                return true;
            } else {
                alert(response.error);
                return true;
            }
        }
        return false;
    }
});
FormHandler.extend({
    submitNewProject: function(pageName, callback) {
        FormHandlerCreateNewProject.submit(callback);
    },
    submitAddProjectComment: function(pageName, callback) {
        FormHandlerAddProjectComment.submit(pageName, callback);
    },
    submitNewSupplyItem: function(pageName, callback) {
        FormHandlerAddSupplyItem.submit(pageName, callback);
    },
    submitAddSupplyStatus: function(pageName, callback) {
        FormHandlerAddSupplyStatus.submit(pageName, callback);
    },
    submitNewWorkStatus: function(pageName, callback) {
        FormHandlerAddWorkStatus.submit(pageName, callback);
    },
    submitUploadFile: function(pageName, callback) {
        FormHandlerUploadFile.submit(callback);
    },
    submitDeleteFile: function(pageName, uniqueId, callback) {
        if (!$S.isStringV2(uniqueId)) {
            return;
        }
        var fileTableName = DataHandler.getTableName("fileTable");
        var filePath = DataHandlerV2.getDisplayName(fileTableName, "unique_id", uniqueId, "filename");
        var deleting = window.confirm("Are you sure? You want to delete file: " + filePath);
        if (deleting) {
            FormHandlerUploadFile.deleteFile(uniqueId, filePath, callback);
        }
    },
    addInDeleteTable: function(deleteId, delete_key, delete_value, callback) {
        if (!$S.isStringV2(deleteId)) {
            deleteId = "";
        }
        if (!$S.isStringV2(delete_key)) {
            delete_key = "";
        }
        if (!$S.isStringV2(delete_value)) {
            delete_value = "";
        }
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        var resultData = ["table_name", "unique_id", "deleteId", "username", "isDeleted", "delete_key", "delete_value"];
        var formData = {};
        formData["table_name"] = DataHandler.getTableName("deleteTable");
        formData["unique_id"] = this.GetUniqueId();
        formData["deleteId"] = AppHandler.ReplaceComma(deleteId);
        formData["username"] = AppHandler.GetUserData("username", "");
        formData["isDeleted"] = "true";
        formData["delete_key"] = AppHandler.ReplaceComma(delete_key);;
        formData["delete_value"] = AppHandler.ReplaceComma(delete_value);;
        var finalText = [];
        for(var i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = formData["username"];
        postData["heading"] = formData["delete_value"];
        postData["text"] = [finalText.join(",")];
        postData["filename"] = formData["table_name"] + ".csv";
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            if (status === "FAILURE" || !$S.isObject(response) || response.status === "FAILURE") {
                AppHandler.TrackApiRequest("addInDeleteTable", "FAILURE");
            } else {
                AppHandler.TrackApiRequest("addInDeleteTable", "SUCCESS");
            }
            $S.callMethod(callback);
        });
    }
});
FormHandler.extend({
    updateBtnStatus: function(template) {
        var status = DataHandler.getData("addentry.submitStatus", "");
        if (status === "in_progress") {
            TemplateHelper.addClassTemplate(template, "addentry.submitStatus", "btn-secondary disabled");
            TemplateHelper.removeClassTemplate(template, "addentry.submitStatus", "btn-primary");
        } else {
            TemplateHelper.removeClassTemplate(template, "addentry.submitStatus", "disabled");
            TemplateHelper.removeClassTemplate(template, "addentry.submitStatus", "btn-secondary");
            TemplateHelper.addClassTemplate(template, "addentry.submitStatus", "btn-primary");
        }
    },
    getAddNewProjectTemplate: function() {
        if (DataHandlerV2.isDisabled("form", "addNewProjectForm")) {
            return null;
        }
        var formTemplate = FormHandlerCreateNewProject.getFormTemplate();
        this.updateBtnStatus(formTemplate);
        return formTemplate;
    },
    getAddNewSupplyItemTemplate: function() {
        if (DataHandlerV2.isDisabled("form", "addNewItemForm")) {
            return null;
        }
        var formTemplate = FormHandlerAddSupplyItem.getFormTemplate();
        this.updateBtnStatus(formTemplate);
        return formTemplate;
    },
    getUpdateSupplyTemplate: function(pageName) {
        var formTemplate;
        if ([Config.updateWorkStatus].indexOf(pageName) >= 0) {
            formTemplate = FormHandlerAddWorkStatus.getFormTemplate();
        } else {
            formTemplate = FormHandlerAddSupplyStatus.getFormTemplate();
        }
        this.updateBtnStatus(formTemplate);
        return formTemplate;
    },
    getUploadFileTemplate: function(pageName) {
        if (DataHandlerV2.isDisabled("form", "fileUploadForm")) {
            return null;
        }
        var uploadFileTemplate = FormHandlerUploadFile.getUploadFileTemplate();
        this.updateBtnStatus(uploadFileTemplate);
        return uploadFileTemplate;
    },
    getAddProjectCommentTemplate: function(pageName) {
        if (DataHandlerV2.isDisabled("form", "projectCommentForm")) {
            return null;
        }
        var template = FormHandlerAddProjectComment.getFormTemplate(pageName);
        this.updateBtnStatus(template);
        return template;
    }
});
})($S);

export default FormHandler;
