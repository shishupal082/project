import $S from "../../../../interface/stack.js";
import TemplateHelper from "../../../TemplateHelper";
import AppHandler from "../AppHandler";
import UploadFileTemplate from "./UploadFileTemplate";



var UploadFileFormHandler;

(function($S){
UploadFileFormHandler = function(arg) {
    return new UploadFileFormHandler.fn.init(arg);
};

UploadFileFormHandler.fn = UploadFileFormHandler.prototype = {
    constructor: UploadFileFormHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(UploadFileFormHandler);

UploadFileFormHandler.extend({
    updateTemplate: function(key, attr, value) {
        TemplateHelper.setTemplateAttr(UploadFileTemplate["upload_file"], key, attr, value);
    },
    getUploadFileTemplate: function(formSubmitStatus, percentComplete, subject, heading) {
        var template = AppHandler.getTemplate(UploadFileTemplate, "upload_file", []);
        var uploadFileApiVersion = AppHandler.GetStaticData("uploadFileApiVersion", "v1");
        if (uploadFileApiVersion === "v2") {
            TemplateHelper.removeClassTemplate(template, "upload_file.subject.div", "d-none");
            TemplateHelper.removeClassTemplate(template, "upload_file.heading.div", "d-none");
            TemplateHelper.setTemplateAttr(template, "upload_file.subject", "value", subject);
            TemplateHelper.setTemplateAttr(template, "upload_file.heading", "value", heading);
        }
        if (formSubmitStatus === "in_progress") {
            TemplateHelper.removeClassTemplate(template, "upload_file.submit", "btn-primary");
            TemplateHelper.addClassTemplate(template, "upload_file.submit", "btn-link disabled");
        } else {
            TemplateHelper.addClassTemplate(template, "upload_file.submit", "btn-primary");
            TemplateHelper.removeClassTemplate(template, "upload_file.submit", "btn-link disabled");
        }
        if (formSubmitStatus === "in_progress" && $S.isNumber(percentComplete) && percentComplete > 0) {
            percentComplete = "Uploaded "+percentComplete+"%";
            TemplateHelper.setTemplateAttr(template, "upload_file.complete-status", "text", percentComplete);
        } else {
            TemplateHelper.setTemplateAttr(template, "upload_file.complete-status", "text", "");
        }
        return template;
    },
    _fireCallback: function(callback, formSubmitStatus, percentComplete, ajax, response) {
        if ($S.isFunction(callback)) {
            callback(formSubmitStatus, percentComplete, ajax, response);
        }
    },
    uploadFile: function(JQ, url, callback, file, subject, heading) {
        var formData = new FormData();
        var uploadFileApiVersion = AppHandler.GetStaticData("uploadFileApiVersion", "v1");
        formData.append("file", file);
        if (uploadFileApiVersion === "v2") {
            if ($S.isString(subject) && $S.isString(heading)) {
                if (subject.length < 1) {
                    alert("Subject required");
                    return;
                }
                if (heading.length < 1) {
                    alert("Heading required");
                    return
                }
            } else {
                alert("Subject and Heading required");
                return;
            }
            formData.append("subject", subject);
            formData.append("heading", heading);
        }
        this._fireCallback(callback, "in_progress", 0);
        $S.uploadFile(JQ, url, formData, function(ajax, status, response) {
            if (status === "FAILURE" || !$S.isObject(response)) {
                AppHandler.TrackApiRequest("upload_file", "FAILURE_RESPONSE");
                alert("Error in uploading file, Please Try again.");
            } else if (response.status === "FAILURE") {
                AppHandler.TrackApiRequest("upload_file", "FAILURE");
                alert(response.error);
            } else {
                AppHandler.TrackApiRequest("upload_file", "SUCCESS");
            }
            UploadFileFormHandler._fireCallback(callback, "completed", 100, ajax, response);
        }, function(percentComplete) {
            UploadFileFormHandler._fireCallback(callback, "in_progress", percentComplete);
        });
    }
});
})($S);

export default UploadFileFormHandler;
