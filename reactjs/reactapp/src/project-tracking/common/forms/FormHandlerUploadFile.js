import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import TemplateHandler from "../template/TemplateHandler";
import Config from "../Config";

import UploadFileFormHandler from "../../../common/app/common/upload_file/UploadFileFormHandler";
import AppHandler from "../../../common/app/common/AppHandler";
import TemplateHelper from "../../../common/TemplateHelper";
import FormHandler from "./FormHandler";
import DisplayUploadedFiles from "../pages/DisplayUploadedFiles";

var FormHandlerUploadFile;

AppHandler.SetStaticDataAttr("uploadFileApiVersion", "v2");
UploadFileFormHandler.updateTemplate("upload_file.message", "text", "(Only pdf less than 10MB)");

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
    _getUploadFileTemplate: function(renderData) {
        var tableEntry = TemplateHandler.getTemplate("uploaded_files");
        var uploadedFileData = [];
        var fileTemplate, temp, i, j;
        var textReplaceParam = ["s_no", "uploadedBy", "subject"];
        var loginUsername = AppHandler.GetUserData("username", "");
        if ($S.isObject(renderData) && $S.isArray(renderData.uploadedFileData) && renderData.uploadedFileData.length > 0) {
            uploadedFileData.push(TemplateHandler.getTemplate("uploaded_files.details.heading"));
            for(i=0; i<renderData.uploadedFileData.length; i++) {
                fileTemplate = TemplateHandler.getTemplate("uploaded_files.details.fileInfo");
                temp = {"s_no": i+1};
                for (j=1; j<textReplaceParam.length; j++) {
                    temp[textReplaceParam[j]] = renderData.uploadedFileData[i][textReplaceParam[j]];
                }
                temp["file_details"] = DisplayUploadedFiles.getFileDisplayTemplate(renderData.uploadedFileData[i], loginUsername);
                TemplateHelper.updateTemplateText(fileTemplate, temp);
                uploadedFileData.push(fileTemplate);
            }
        }
        TemplateHelper.addItemInTextArray(tableEntry, "uploaded_files.entry", uploadedFileData);
        return tableEntry;
    },
    updateUploadFileTemplate: function(renderData, pageTemplate) {
        var uploadFileData = this._getUploadFileTemplate(renderData);
        var formSubmitStatus = DataHandler.getData("addentry.submitStatus", "");
        var percentComplete = DataHandler.getFieldsData("upload_file.percentComplete", 0);
        var subject = DataHandler.getFieldsData("upload_file.subject", "");
        var uploadFileTemplate = UploadFileFormHandler.getUploadFileTemplate(formSubmitStatus, percentComplete, subject);
        TemplateHelper.addItemInTextArray(pageTemplate, "projectId.uploaded_files", uploadFileData);
        TemplateHelper.addItemInTextArray(pageTemplate, "projectId.upload_file", uploadFileTemplate);
        return pageTemplate;
    },
    addInFileTable: function(filename, subject, callback) {
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        var resultData = ["table_name", "unique_id", "pid", "username", "subject", "filename"];
        var formData = {};
        formData["table_name"] = DataHandler.getTableName("fileTable");
        formData["unique_id"] = FormHandler.GetUniqueId();
        formData["pid"] = DataHandler.getPathParamsData("pid", "");
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
    uploadFile: function(file, subject, heading, callback) {
        var url = Config.getApiUrl("upload_file", null, true);
        if (!$S.isString(url)) {
            return;
        }
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
                        FormHandlerUploadFile.addInFileTable(response.data.path, subject, function() {
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
    deleteFile: function(uniqueId, filePath, callback) {
        var url = Config.getApiUrl("delete_file", "", true);
        var postData = {};
        postData["filename"] = filePath;
        var delete_key = "File Deleted";
        var delete_value = filePath;
        var message = "Error in delete file, Please Try again.";
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
});
})($S);

export default FormHandlerUploadFile;
