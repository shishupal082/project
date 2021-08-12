import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
// import DataHandlerV2 from "../DataHandlerV2";
import TemplateHandler from "../template/TemplateHandler";
import Config from "../Config";

// import AppHandler from "../../../common/app/common/AppHandler";
import TemplateHelper from "../../../common/TemplateHelper";
// import FormHandler from "./FormHandler";
// import DBViewDataHandler from "../../../common/app/common/DBViewDataHandler";


var DisplayUploadedFiles;

(function($S){
// var DT = $S.getDT();

DisplayUploadedFiles = function(arg) {
    return new DisplayUploadedFiles.fn.init(arg);
};
DisplayUploadedFiles.fn = DisplayUploadedFiles.prototype = {
    constructor: DisplayUploadedFiles,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(DisplayUploadedFiles);
DisplayUploadedFiles.extend({
    getFileDisplayAsComment: function(pageName, data, loginUsername, subject, heading) {
        var fileTemplate = TemplateHandler.getTemplate("file_details_as_comment");
        var buttonName = "delete_file.form.button";
        var textReplaceParam = {"subject": subject, "heading": heading};
        var fileUsername = "";
        if ([Config.projectId].indexOf(pageName) >= 0) {
            if (loginUsername === fileUsername) {
                TemplateHelper.removeClassTemplate(fileTemplate, buttonName, "disabled");
                TemplateHelper.addClassTemplate(fileTemplate, buttonName, "text-danger");
            }
        }
        TemplateHelper.updateTemplateText(fileTemplate, textReplaceParam);
        return fileTemplate;
    },
    getFileDisplayAsLink: function(pageName, data, loginUsername, linkText, linkUrl) {
        var fileTemplate = TemplateHandler.getTemplate("file_details_as_link");
        var buttonName = "delete_file.form.button";
        var fileUsername = "";
        var hrefReplaceParam = {};
        hrefReplaceParam["open_in_new_tab.href"] = linkUrl;
        var textReplaceParam = {"subject": linkText};
        if ([Config.projectId].indexOf(pageName) >= 0) {
            if (loginUsername === fileUsername) {
                TemplateHelper.removeClassTemplate(fileTemplate, buttonName, "disabled");
                TemplateHelper.addClassTemplate(fileTemplate, buttonName, "text-danger");
            }
        }
        TemplateHelper.updateTemplateText(fileTemplate, textReplaceParam);
        for(var key in hrefReplaceParam) {
            TemplateHelper.setTemplateAttr(fileTemplate, key, "href", hrefReplaceParam[key]);
        }
        return fileTemplate;
    },
    getFileDisplayTemplate: function(pageName, data, loginUsername) {
        if (!$S.isObject(data)) {
            data = {};
        }
        var fileTemplate = null;
        var fileTableName = DataHandler.getTableName("fileTable");
        var linkTableName = DataHandler.getTableName("projectLink");
        var commentTableName = DataHandler.getTableName("projectComment");
        var subject = data["subject"];
        var filename = data["filename"];
        var valueReplaceParam = {"view_file.unique_id": data.unique_id, "delete_file.form": data.unique_id};
        if (data["table_name"] === fileTableName) {
            fileTemplate = this.getFileDisplayTemplateV2(pageName, filename, loginUsername, subject);
            TemplateHelper.updateTemplateValue(fileTemplate, valueReplaceParam);
        } else if (data["table_name"] === linkTableName) {
            fileTemplate = this.getFileDisplayAsLink(pageName, data, loginUsername, subject, filename);
            TemplateHelper.updateTemplateValue(fileTemplate, valueReplaceParam);
        } else if (data["table_name"] === commentTableName) {
            fileTemplate = this.getFileDisplayAsComment(pageName, data, loginUsername, subject, filename);
            TemplateHelper.updateTemplateValue(fileTemplate, valueReplaceParam);
        }
        return fileTemplate;
    },
    getFileDisplayTemplateV2: function(pageName, filePath, loginUsername, subject) {
        var fileTemplate = TemplateHandler.getTemplate("file_details");
        var fileName = "";
        var temp, key, fileUsername;
        var isValidFileData = false;
        if ($S.isStringV2(filePath)) {
            temp = filePath.split("/");
            if (temp.length === 2) {
                isValidFileData = true;
                fileUsername = temp[0];
                fileName = temp[1];
            }
        }
        var textReplaceParam = {"heading": fileName};
        var hrefReplaceParam = {};
        var buttonName = "delete_file.form.button";
        if ([Config.projectId].indexOf(pageName) >= 0) {
            if ($S.isStringV2(subject)) {
                textReplaceParam["subject"] = subject;
            }
            if (loginUsername === fileUsername) {
                TemplateHelper.removeClassTemplate(fileTemplate, buttonName, "disabled");
                TemplateHelper.addClassTemplate(fileTemplate, buttonName, "text-danger");
            }
        }
        hrefReplaceParam["open_in_new_tab.href"] = Config.baseApi + "/view/file/" + filePath + "?u=" + loginUsername;
        hrefReplaceParam["download.href"] = Config.baseApi + "/download/file/" + filePath + "?u=" + loginUsername;
        TemplateHelper.updateTemplateText(fileTemplate, textReplaceParam);
        if (isValidFileData) {
            for(key in hrefReplaceParam) {
                TemplateHelper.setTemplateAttr(fileTemplate, key, "href", hrefReplaceParam[key]);
            }
        } else {
            TemplateHelper.addClassTemplate(fileTemplate, "file-action-field", "d-none");
        }
        return fileTemplate;
    }
});
})($S);

export default DisplayUploadedFiles;
