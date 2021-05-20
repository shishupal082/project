import $S from "../../interface/stack.js";

import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";

import Config from "../common/Config";
import GATracking from "../common/GATracking";
import Template from "../common/Template";
import DataHandler from "../common/DataHandler";


var UploadFile;

(function($S){
UploadFile = function(arg) {
    return new UploadFile.fn.init(arg);
};

UploadFile.fn = UploadFile.prototype = {
    constructor: UploadFile,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(UploadFile);

UploadFile.extend({
    getRenderFieldRow: function(file) {
        var template = AppHandler.getTemplate(Template, "upload_file", []);
        var uploadFileApiVersion = AppHandler.GetStaticData("uploadFileApiVersion", "v1");
        var subject = DataHandler.getData("upload_file.subject", "");
        var heading = DataHandler.getData("upload_file.heading", "");
        if (uploadFileApiVersion === "v2") {
            TemplateHelper.removeClassTemplate(template, "upload_file.subject.div", "d-none");
            TemplateHelper.removeClassTemplate(template, "upload_file.heading.div", "d-none");
            TemplateHelper.setTemplateAttr(template, "upload_file.subject", "value", subject);
            TemplateHelper.setTemplateAttr(template, "upload_file.heading", "value", heading);
        }
        var formSubmitStatus = DataHandler.getData("formSubmitStatus", "");
        if (formSubmitStatus === "in_progress") {
            TemplateHelper.removeClassTemplate(template, "upload_file.submit", "btn-primary");
            TemplateHelper.addClassTemplate(template, "upload_file.submit", "btn-link disabled");
        } else {
            TemplateHelper.addClassTemplate(template, "upload_file.submit", "btn-primary");
            TemplateHelper.removeClassTemplate(template, "upload_file.submit", "btn-link disabled");
        }
        var percentComplete = DataHandler.getData("upload_file.percentComplete", 0);
        if (formSubmitStatus === "in_progress" && $S.isNumber(percentComplete) && percentComplete > 0) {
            percentComplete = "Uploaded "+percentComplete+"%";
            TemplateHelper.setTemplateAttr(template, "upload_file.complete-status", "text", percentComplete);
        } else {
            TemplateHelper.setTemplateAttr(template, "upload_file.complete-status", "text", "");
        }
        return template;
    },
    handleApiResponse: function(callback, ajax, response) {
        if (response.status === "FAILURE") {
            alert(DataHandler.getAleartMessage(response));
            if (response.failureCode === "UNAUTHORIZED_USER") {
                AppHandler.LazyReload();
            }
            return false;
        } else {
            alert("File saved as: " + response.data.fileName);
        }
        var jsonFileData = AppHandler.GetStaticData("jsonFileData", {});
        var redirectUrl = "";
        if ($S.isObject(jsonFileData) && $S.isObject(jsonFileData.config)) {
            if ($S.isString(jsonFileData.config.uploadFileRedirectUrl)) {
                redirectUrl = jsonFileData.config.uploadFileRedirectUrl;
            }
        }
        if (redirectUrl.length > 0) {
            AppHandler.LazyRedirect(redirectUrl, 250);
        }
        return true;
    },
    upload: function(file, callback) {
        var formData = new FormData();
        var uploadFileApiVersion = AppHandler.GetStaticData("uploadFileApiVersion", "v1");
        var url = Config.getApiUrl("upload_file", false, true);
        if (uploadFileApiVersion === "v2") {
            var subject = DataHandler.getData("upload_file.subject", "");
            var heading = DataHandler.getData("upload_file.heading", "");
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
        DataHandler.setData("formSubmitStatus", "in_progress");
        DataHandler.setData("upload_file.percentComplete", 0);
        formData.append("file", file);
        $S.callMethod(callback);
        $S.uploadFile(Config.JQ, url, formData, function(ajax, status, response) {
            DataHandler.setData("formSubmitStatus", "completed");
            $S.callMethod(callback);
            console.log(response);
            if (status === "FAILURE" || !$S.isObject(response)) {
                GATracking.trackResponseAfterLogin("upload_file", {"status": "FAILURE_RESPONSE"});
                alert("Error in uploading file, Please Try again.");
            } else {
                GATracking.trackResponseAfterLogin("upload_file", response);
                UploadFile.handleApiResponse(callback, ajax, response);
            }
        }, function(percentComplete) {
            DataHandler.setData("upload_file.percentComplete", percentComplete);
            $S.callMethod(callback);
        });
    }
});
})($S);

export default UploadFile;
