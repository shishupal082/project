import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import Config from "../Config";

import UploadFileFormHandler from "../../../common/app/common/upload_file/UploadFileFormHandler";
import AppHandler from "../../../common/app/common/AppHandler";
import TemplateHelper from "../../../common/TemplateHelper";
import FormHandler from "./FormHandler";

var FormHandlerUploadFile;

AppHandler.SetStaticDataAttr("uploadFileApiVersion", "v2");
UploadFileFormHandler.updateTemplate("upload_file.message", "text", Config.uploadFileInstruction);

(function($S){
// var DT = $S.getDT();

FormHandlerUploadFile = function(arg) {
    return new FormHandlerUploadFile.fn.init(arg);
};
FormHandlerUploadFile.fn = FormHandlerUploadFile.prototype = {
    constructor: FormHandlerUploadFile,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(FormHandlerUploadFile);
FormHandlerUploadFile.extend({
    getUploadFileTemplate: function(pageName) {
        var formSubmitStatus = DataHandler.getData("addentry.submitStatus", "");
        var percentComplete = DataHandler.getFieldsData("upload_file.percentComplete", 0);
        var subject = DataHandler.getFieldsData("upload_file.subject", "");
        var uploadFileTemplate = UploadFileFormHandler.getUploadFileTemplate(formSubmitStatus, percentComplete, subject);
        TemplateHelper.addClassTemplate(uploadFileTemplate, "upload_file.heading.div", "d-none");
        return uploadFileTemplate;
    },
    getAddLinkTemplate: function(pageName) {
        var formSubmitStatus = DataHandler.getData("addentry.submitStatus", "");
        var subject = DataHandler.getFieldsData("upload_file_link.subject", "");
        var heading = DataHandler.getFieldsData("upload_file_link.heading", "");
        var uploadFileTemplate = UploadFileFormHandler.getUploadFileTemplate(formSubmitStatus, 0, subject, heading);
        var updateFieldParameter = [];
        updateFieldParameter.push(["upload_file.subject", "name", "upload_file_link.subject"]);
        updateFieldParameter.push(["upload_file.heading", "name", "upload_file_link.heading"]);
        updateFieldParameter.push(["upload_file.subject_label", "text", "Link Text"]);
        updateFieldParameter.push(["upload_file.heading_label", "text", "Link Url"]);
        updateFieldParameter.push(["upload_file_form", "id", "upload_file_form_link"]);
        updateFieldParameter.push(["upload_file_form", "value", "upload_file_form_link"]);
        updateFieldParameter.push(["upload_file_form", "name", "upload_file_form_link"]);
        updateFieldParameter.push(["upload_file.form_heading", "text", "Add link"]);
        TemplateHelper.addClassTemplate(uploadFileTemplate, "upload_file.file_field.div", "d-none");
        for(var i=0; i<updateFieldParameter.length; i++) {
            TemplateHelper.setTemplateAttr(uploadFileTemplate, updateFieldParameter[i][0], updateFieldParameter[i][1], updateFieldParameter[i][2]);
        }
        return uploadFileTemplate;
    },
    addInFileTable: function(filename, subject, pid, callback) {
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        var resultData = ["table_name", "unique_id", "pid", "username", "subject", "filename"];
        var formData = {};
        formData["table_name"] = DataHandler.getTableName("fileTable");
        formData["unique_id"] = FormHandler.GetUniqueId();
        formData["pid"] = pid;
        formData["username"] = AppHandler.GetUserData("username", "");
        formData["subject"] = AppHandler.ReplaceComma(subject);
        formData["filename"] = filename;
        var finalText = [];
        for(var i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = formData["subject"];
        postData["heading"] = formData["pid"];
        postData["text"] = [finalText.join(",")];
        postData["filename"] = formData["table_name"] + ".csv";
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            if (status === "FAILURE") {
                AppHandler.TrackApiRequest("addInFileTable", "FAILURE");
            } else {
                AppHandler.TrackApiRequest("addInFileTable", "SUCCESS");
            }
            $S.callMethod(callback);
        });
    },
    saveLink: function(pageName, formData, callback) {
        var resultData = ["table_name", "unique_id", "pid", "username", Config.fieldsKey.AddLinkText, Config.fieldsKey.AddLinkUrl];
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        var pid = DataHandler.getPathParamsData("pid", "");
        formData["table_name"] = DataHandler.getTableName("projectLink");
        if (!$S.isStringV2(formData["table_name"])) {
            alert(FormHandler.GetAleartMessage("tableName.invalid"))
            return;
        }
        formData["unique_id"] = FormHandler.GetUniqueId();
        formData["pid"] = pid;
        formData["username"] = AppHandler.GetUserData("username", "");
        var finalText = [];
        for(var i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = formData[Config.fieldsKey.AddLinkText];
        postData["heading"] = formData["pid"];
        postData["text"] = [finalText.join(",")];
        postData["filename"] = formData["table_name"] + ".csv";
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callback);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callback);
            if (status === "FAILURE") {
                AppHandler.TrackApiRequest("addProjectLink", "FAILURE");
                alert("Error in uploading data, Please Try again.");
            } else {
                AppHandler.TrackApiRequest("addProjectLink", "SUCCESS");
                AppHandler.LazyReload(250);
            }
        });
    },
    uploadFile: function(file, subject, heading, callback) {
        var url = Config.getApiUrl("upload_file", null, true);
        if (!$S.isString(url)) {
            return;
        }
        var pid = DataHandler.getPathParamsData("pid", "");
        UploadFileFormHandler.uploadFile(Config.JQ, url, function(formSubmitStatus, percentComplete, ajax, response) {
            if (formSubmitStatus === "in_progress") {
                DataHandler.setData("addentry.submitStatus", "in_progress");
                DataHandler.setFieldsData("upload_file.percentComplete", percentComplete);
                $S.callMethod(callback);
            } else {
                DataHandler.setData("addentry.submitStatus", "completed");
                $S.callMethod(callback);
                if ($S.isObject(response)) {
                    if (response.status === "SUCCESS") {
                        FormHandlerUploadFile.addInFileTable(response.data.path, subject, pid, function() {
                            AppHandler.LazyReload(250);
                        });
                    } else if (response.failureCode === "UNAUTHORIZED_USER") {
                        AppHandler.LazyReload(250);
                    }
                }
            }
        }, file, subject, heading);
    },
    submit: function(callback) {
        var key = Config.fieldsKey.UploadFile;
        var file = DataHandler.getData(key, false, true);
        var subject = DataHandler.getFieldsData("upload_file.subject", "");
        var heading = DataHandler.getPathParamsData("pid", "");
        if ($S.isBooleanFalse(file)) {
            alert(FormHandler.GetAleartMessage(key));
            return;
        }
        this.uploadFile(file, subject, heading, callback);
    },
    submitAddLink: function(pageName, callback) {
        var requiredKeys = [Config.fieldsKey.AddLinkText, Config.fieldsKey.AddLinkUrl];
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
            this.saveLink(pageName, formData, callback);
        }
    },
    deleteFile: function(uniqueId, filePath, callback) {
        var url = Config.getApiUrl("delete_file", "", true);
        var postData = {};
        postData["filename"] = filePath;
        var delete_key = "File Deleted";
        var delete_value = filePath;
        var message = "Error in delete file, Please Try again.";
        var fileTableName = DataHandler.getTableName("fileTable");
        var fileTable = DataHandlerV2.getTableDataByAttr(fileTableName, "filename", filePath);
        if ($S.isArray(fileTable)) {
            if (fileTable.length > 1) {
                FormHandler.addInDeleteTable(uniqueId, delete_key, delete_value, function() {
                    AppHandler.LazyReload(250);
                });
            } else {
                $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
                    if (FormHandler.IsResponseFailure(response, message)) {
                        AppHandler.TrackApiRequest("deleteFile", "FAILURE");
                    } else {
                        AppHandler.TrackApiRequest("deleteFile", "SUCCESS");
                        FormHandler.addInDeleteTable(uniqueId, delete_key, delete_value, function() {
                            AppHandler.LazyReload(250);
                        });
                    }
                });
            }
        }
    }
});
})($S);

export default FormHandlerUploadFile;
