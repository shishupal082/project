import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import Config from "../Config";

import TemplateHelper from "../../../common/TemplateHelper";
import AppHandler from "../../../common/app/common/AppHandler";
import CommonConfig from "../../../common/app/common/CommonConfig";
import CommonDataHandler from "../../../common/app/common/CommonDataHandler";


import FormHandlerAddSupplyStatus from "./FormHandlerAddSupplyStatus";
import FormHandlerAddSupplyItem from "./FormHandlerAddSupplyItem";
import FormHandlerAddWorkStatus from "./FormHandlerAddWorkStatus";
import FormHandlerUploadFile from "./FormHandlerUploadFile";
import FormHandlerAddProjectComment from "./FormHandlerAddProjectComment";
import FormHandlerAddProjectFiles from "./FormHandlerAddProjectFiles";

var FormHandler;

(function($S){
// var DT = $S.getDT();

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
        var messageMapping = DataHandler.getAppData("messageMapping", {});
        if ($S.isObject(messageMapping) && $S.isString(messageMapping[key])) {
            return messageMapping[key];
        }
        return "Invalid " + key;
    },
    FormateString: function(str) {
        return AppHandler.FormateString(str);
    },
    GetUniqueId: function() {
        return AppHandler.GetUniqueId();
    },
    IsResponseFailure: function(response, dafaultMessage) {
        return AppHandler.IsResponseFailure(response, dafaultMessage);
    }
});
FormHandler.extend({
    _getFormTemplateName: function(pageName, formType) {
        var formTemplateName = "formTemplate";
        if ($S.isStringV2(formType)) {
            formTemplateName = formType + "." + formTemplateName;
        }
        return formTemplateName;
    },
    _getFormName: function(pageName, formType) {
        var formName = "formName";
        if ($S.isStringV2(formType)) {
            formName = formType + "." + formName;
        }
        return formName;
    },
    getGenericTemplate: function(pageName, formType, formIdentifier) {
        // FormType parameter used for finding proper id1Page form
        // As each id1 may have different form types
        if (DataHandlerV2.isDisabled("form", formIdentifier)) {
            return null;
        }
        var formTemplateName = this._getFormTemplateName(pageName, formType);
        var formName = this._getFormName(pageName, formType);
        var formTemplate = DataHandler.getAppData(pageName + "." + formTemplateName, null);
        var finalFormName = DataHandler.getAppData(pageName + "." + formName, "");
        var validationData = null, status = null;
        if ($S.isStringV2(finalFormName)) {
            validationData = DataHandler.getAppData(finalFormName + ".validationData");
            status = DataHandler.getData("addentry.submitStatus", "");
        }
        formTemplate = CommonDataHandler.getFormTemplate(formTemplate, validationData, "addentry.submitStatus", status);
        return formTemplate;
    },
    submitGenericForm: function(pageName, formName, formType, callback) {
        var status = DataHandler.getData("addentry.submitStatus", "");
        if (status === CommonConfig.IN_PROGRESS) {
            return null;
        }
        var tableNameKey = formName
        if ($S.isStringV2(formType)) {
            tableNameKey += "." + formType;
        }
        var requiredKeys = DataHandler.getAppData(formName + ".requiredKeys", []);
        var validationData = DataHandler.getAppData(formName + ".validationData", {});
        var tableName = DataHandler.getTableName(tableNameKey + ".tableName", "");
        var messageMapping = DataHandler.getAppData("messageMapping", {});
        CommonDataHandler.submitForm(pageName, formName, tableName, messageMapping, requiredKeys, validationData, function(status) {
            DataHandler.setData("addentry.submitStatus", status);
            $S.callMethod(callback);
        });
    }
});
FormHandler.extend({
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
    submitAddLink: function(pageName, callback) {
        FormHandlerUploadFile.submitAddLink(pageName, callback);
    },
    submitAddProjectFiles: function(pageName, callback) {
        FormHandlerAddProjectFiles.submit(pageName, callback);
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
        var url = CommonConfig.getApiUrl("getAddTextApiV2", null, true);
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
        $S.sendPostRequest(CommonConfig.JQ, url, postData, function(ajax, status, response) {
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
        return uploadFileTemplate;
    },
    getAddLinkTemplate: function(pageName) {
        if (DataHandlerV2.isDisabled("form", "projectLinkForm")) {
            return null;
        }
        var uploadFileTemplate = FormHandlerUploadFile.getAddLinkTemplate(pageName);
        return uploadFileTemplate;
    },
    getAddProjectCommentTemplate: function(pageName) {
        if (DataHandlerV2.isDisabled("form", "projectCommentForm")) {
            return null;
        }
        var template = FormHandlerAddProjectComment.getFormTemplate(pageName);
        this.updateBtnStatus(template);
        return template;
    },
    getAddProjectFilesTemplate: function(pageName, fileInfoData, allProjects) {
        var template = FormHandlerAddProjectFiles.getFormTemplate(pageName, fileInfoData, allProjects);
        this.updateBtnStatus(template);
        return template;
    }
});
})($S);

export default FormHandler;
