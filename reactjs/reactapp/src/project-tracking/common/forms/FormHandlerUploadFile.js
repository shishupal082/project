import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import TemplateHandler from "../template/TemplateHandler";
import Config from "../Config";

import AppHandler from "../../../common/app/common/AppHandler";
import TemplateHelper from "../../../common/TemplateHelper";
import FormHandler from "./FormHandler";


var FormHandlerAddSupplyItem;

(function($S){
// var DT = $S.getDT();

FormHandlerAddSupplyItem = function(arg) {
    return new FormHandlerAddSupplyItem.fn.init(arg);
};
FormHandlerAddSupplyItem.fn = FormHandlerAddSupplyItem.prototype = {
    constructor: FormHandlerAddSupplyItem,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(FormHandlerAddSupplyItem);
FormHandlerAddSupplyItem.extend({
    _getUploadFileTemplate: function(renderData) {
        var tableEntry = TemplateHandler.getTemplate("uploaded_files");
        var uploadedFileData = [];
        var fileTemplate, temp, i, j;
        var textReplaceParam = ["s_no", "uploadedBy", "fileName"];
        if ($S.isObject(renderData) && $S.isArray(renderData.uploadedFileData) && renderData.uploadedFileData.length > 0) {
            uploadedFileData.push(TemplateHandler.getTemplate("uploaded_files.details.heading"));
            for(i=0; i<renderData.uploadedFileData.length; i++) {
                fileTemplate = TemplateHandler.getTemplate("uploaded_files.details.fileInfo");
                temp = {"s_no": i+1};
                for (j=1; j<textReplaceParam.length; j++) {
                    temp[textReplaceParam[j]] = renderData.uploadedFileData[i][textReplaceParam[j]];
                }
                TemplateHelper.updateTemplateText(fileTemplate, temp);
                uploadedFileData.push(fileTemplate);
            }
        }
        TemplateHelper.addItemInTextArray(tableEntry, "uploaded_files.entry", uploadedFileData);
        return tableEntry;
    },
    updateUploadFileTemplate: function(renderData, pageTemplate) {
        var uploadFileData = this._getUploadFileTemplate(renderData);
        var uploadFileTemplate = TemplateHandler.getTemplate("upload_file");
        var formSubmitStatus = DataHandler.getData("addentry.submitStatus", "");
        var percentComplete = DataHandler.getFieldsData("upload_file.percentComplete", 0);
        if (formSubmitStatus === "in_progress" && $S.isNumber(percentComplete) && percentComplete > 0) {
            percentComplete = "Uploaded "+percentComplete+"%";
            TemplateHelper.setTemplateAttr(uploadFileTemplate, "upload_file.complete-status", "text", percentComplete);
        } else {
            TemplateHelper.setTemplateAttr(uploadFileTemplate, "upload_file.complete-status", "text", "");
        }
        TemplateHelper.addItemInTextArray(pageTemplate, "projectId.uploaded_files", uploadFileData);
        TemplateHelper.addItemInTextArray(pageTemplate, "projectId.upload_file", uploadFileTemplate);
        return pageTemplate;
    },
    uploadFile: function(formData, callback) {
        var url = Config.getApiUrl("upload_file", null, true);
        if (!$S.isString(url)) {
            return;
        }
        DataHandler.setData("addentry.submitStatus", "in_progress");
        DataHandler.setFieldsData("upload_file.percentComplete", 0);
        $S.callMethod(callback);
        $S.uploadFile(Config.JQ, url, formData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callback);
            if (status === "FAILURE" || !$S.isObject(response)) {
                AppHandler.TrackApiRequest("upload_file", "FAILURE");
                alert("Error in uploading file, Please Try again.");
            } else if (response.status === "FAILURE") {
                AppHandler.TrackApiRequest("upload_file", "FAILURE");
                alert(response.error);
            } else {
                AppHandler.TrackApiRequest("upload_file", "SUCCESS");
                AppHandler.LazyReload(250);
            }
        }, function(percentComplete) {
            DataHandler.setFieldsData("upload_file.percentComplete", percentComplete);
            $S.callMethod(callback);
        });
    },
    submit: function(callback) {
        var key = Config.fieldsKey.UploadFile;
        var file = DataHandler.getData(key, false, true);
        if ($S.isBooleanFalse(file)) {
            alert(FormHandler.GetAleartMessage(key));
            return;
        }
        var formData = new FormData();
        formData.append("file", file);
        this.uploadFile(formData, callback);
    }
});
})($S);

export default FormHandlerAddSupplyItem;
