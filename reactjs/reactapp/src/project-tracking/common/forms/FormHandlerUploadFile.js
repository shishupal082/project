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
        var uploadFileTemplate = TemplateHandler.getTemplate("upload_file");
        var uploadFileData = this._getUploadFileTemplate(renderData);
        TemplateHelper.addItemInTextArray(pageTemplate, "projectId.uploaded_files", uploadFileData);
        TemplateHelper.addItemInTextArray(pageTemplate, "projectId.upload_file", uploadFileTemplate);
        return pageTemplate;
    },
    saveNewSupplyItem: function(formData, callback) {
        var resultData = ["table_name", "unique_id", "pid", "username",
                        Config.fieldsKey.NewSupplyItemName, Config.fieldsKey.NewSupplyItemDetails];
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        formData["table_name"] = DataHandler.getTableName("materialSupplyItems");
        if (!$S.isStringV2(formData["table_name"])) {
            alert(FormHandler.GetAleartMessage("tableName.invalid"))
            return;
        }
        formData["unique_id"] = FormHandler.GetUniqueId();
        formData["pid"] = DataHandler.getPathParamsData("pid");
        formData["username"] = AppHandler.GetUserData("username", "");
        formData[Config.fieldsKey.NewSupplyItemDetails] = FormHandler.FormateString(formData[Config.fieldsKey.NewSupplyItemDetails]);
        var finalText = [];
        for(var i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = formData[Config.fieldsKey.NewSupplyItemName];
        postData["heading"] = formData["pid"];
        postData["text"] = [finalText.join(",")];
        postData["filename"] = formData["table_name"] + ".csv";
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callback);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callback);
            if (status === "FAILURE") {
                AppHandler.TrackApiRequest("addSupplyItem", "FAILURE");
                alert("Error in uploading data, Please Try again.");
            } else {
                AppHandler.TrackApiRequest("addSupplyItem", "SUCCESS");
                AppHandler.LazyReload(250);
            }
        });
    },
    submit: function(callback) {
        
    }
});
})($S);

export default FormHandlerAddSupplyItem;
