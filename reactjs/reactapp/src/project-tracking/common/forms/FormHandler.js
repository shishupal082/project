import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import Config from "../Config";

import TemplateHelper from "../../../common/TemplateHelper";
import AppHandler from "../../../common/app/common/AppHandler";
import CommonConfig from "../../../common/app/common/CommonConfig";
import CommonDataHandler from "../../../common/app/common/CommonDataHandler";


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
        return CommonDataHandler.getAleartMessage(messageMapping, key);
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
        var configMessageMapping = Config.getConfigData("messageMapping", {});
        if ($S.isObject(messageMapping)) {
            messageMapping = Object.assign(configMessageMapping, messageMapping);
        } else {
            messageMapping = configMessageMapping;
        }
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
        var action = "";
        var deleteFileValue = DataHandler.getFieldsData("delete_file.form.button", "");
        var removeFileValue = DataHandler.getFieldsData("remove_file.form.button", "");
        if (deleteFileValue === "delete") {
            action = "delete";
        } else if (removeFileValue === "remove") {
            action = "remove";
        }
        if (["delete", "remove"].indexOf(action) < 0) {
            alert("Config error.");
            return;
        }
        var fileTableName = DataHandler.getTableName("fileTable");
        var filePath = DataHandlerV2.getDisplayName(fileTableName, "unique_id", uniqueId, "filename");
        var deleting = window.confirm("Are you sure? You want to " + action + " file: " + filePath);
        if (deleting) {
            FormHandlerUploadFile.deleteFile(uniqueId, filePath, action, callback);
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
        var resultData = ["table_name", "unique_id", "username", "deleteId", "isDeleted", "delete_key", "delete_value"];
        var formData = {};
        var tableName = DataHandler.getTableName("deleteTable");
        formData["deleteId"] = AppHandler.ReplaceComma(deleteId);
        formData["isDeleted"] = "true";
        formData["delete_key"] = AppHandler.ReplaceComma(delete_key);
        formData["delete_value"] = AppHandler.ReplaceComma(delete_value);
        this.saveProjectContent(formData, resultData, tableName, "Subject", "Heading", "addInDeleteTable", function(formStatus, resultStatus) {
            if (formStatus === "in_progress") {
                $S.callMethod(callback);
            } else if (resultStatus === "SUCCESS") {
                AppHandler.LazyReload(250);
            }
        });
    },
    saveProjectContent: function(formData, dataPattern, tableName, subject, heading, gaTrackingName, callback) {
        if (!$S.isStringV2(gaTrackingName)) {
            gaTrackingName = "projectContent";
        }
        var resultData = [], i;
        if ($S.isArray(dataPattern)) {
            for (i=0; i<dataPattern.length; i++) {
                if ($S.isStringV2(dataPattern[i])) {
                    resultData.push(dataPattern[i]);
                }
            }
        }
        if (resultData.length < 1) {
            return $S.callMethod(callback);
        }
        var url = CommonConfig.getApiUrl("getAddTextApiV2", null, true);
        if (!$S.isString(url)) {
            return;
        }
        formData["table_name"] = tableName;
        if (!$S.isStringV2(formData["table_name"])) {
            alert(FormHandler.GetAleartMessage("tableName.invalid"))
            return;
        }
        formData["unique_id"] = FormHandler.GetUniqueId();
        formData["username"] = AppHandler.GetUserData("username", "");
        var finalText = [];
        for(i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = subject;
        postData["heading"] = heading;
        postData["text"] = [finalText.join(",")];
        postData["filename"] = formData["table_name"] + ".csv";
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethodV1(callback, "in_progress");
        $S.sendPostRequest(CommonConfig.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            if (status === "FAILURE") {
                AppHandler.TrackApiRequest(gaTrackingName, "FAILURE");
                alert("Error in uploading data, Please Try again.");
                $S.callMethodV2(callback, "completed", "FAILURE");
            } else {
                AppHandler.TrackApiRequest(gaTrackingName, "SUCCESS");
                $S.callMethodV2(callback, "completed", "SUCCESS");
            }
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
