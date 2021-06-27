import $S from "../../interface/stack.js";

// import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";
import UploadFileFormHandler from "../../common/app/common/upload_file/UploadFileFormHandler";


import Config from "../common/Config";
// import GATracking from "../common/GATracking";
// import Template from "../common/Template";
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
        var formSubmitStatus = DataHandler.getData("formSubmitStatus", "");
        var percentComplete = DataHandler.getData("upload_file.percentComplete", 0);
        var subject = DataHandler.getData("upload_file.subject", "");
        var heading = DataHandler.getData("upload_file.heading", "");
        var template = UploadFileFormHandler.getUploadFileTemplate(formSubmitStatus, percentComplete, subject, heading);
        return template;
    },
    handleApiResponse: function(callback, ajax, response) {
        if (response.status === "FAILURE") {
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
        var url = Config.getApiUrl("upload_file", false, true);
        var subject = DataHandler.getData("upload_file.subject", "");
        var heading = DataHandler.getData("upload_file.heading", "");
        UploadFileFormHandler.uploadFile(Config.JQ, url, function(formSubmitStatus, percentComplete, ajax, response) {
            if (formSubmitStatus === "in_progress") {
                DataHandler.setData("formSubmitStatus", "in_progress");
                DataHandler.setData("upload_file.percentComplete", percentComplete);
            } else {
                DataHandler.setData("formSubmitStatus", "completed");
                if ($S.isObject(response)) {
                    UploadFile.handleApiResponse(callback, ajax, response);
                }
            }
            $S.callMethod(callback);
        }, file, subject, heading);
    }
});
})($S);

export default UploadFile;
