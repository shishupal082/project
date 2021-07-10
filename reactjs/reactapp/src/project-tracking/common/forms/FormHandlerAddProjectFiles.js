import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import TemplateHandler from "../template/TemplateHandler";
import Config from "../Config";

import AppHandler from "../../../common/app/common/AppHandler";
import TemplateHelper from "../../../common/TemplateHelper";
import FormHandler from "./FormHandler";
import FormHandlerUploadFile from "./FormHandlerUploadFile";


var FormHandlerAddProjectFiles;

(function($S){
// var DT = $S.getDT();

FormHandlerAddProjectFiles = function(arg) {
    return new FormHandlerAddProjectFiles.fn.init(arg);
};
FormHandlerAddProjectFiles.fn = FormHandlerAddProjectFiles.prototype = {
    constructor: FormHandlerAddProjectFiles,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(FormHandlerAddProjectFiles);
FormHandlerAddProjectFiles.extend({
    getFormTemplate: function(pageName, fileInfoData, allProjects) {
        var fileInfoTableName = DataHandler.getTableName("pageName:pageView:fileInfoTable");
        if (!$S.isObject(fileInfoData)) {
            fileInfoData = {};
        }
        if (!$S.isObject(fileInfoData)) {
            fileInfoData[fileInfoTableName] = {};
         }
        var template = TemplateHandler.getTemplate("addProjectFilesTemplate");
        var dropdownList = [];
        var filepath = fileInfoData[fileInfoTableName]["filepath"];
        if ($S.isArray(allProjects) && allProjects.length > 0) {
            dropdownList.push({"value": "", "text": "Select..."});
            for(var i=0; i<allProjects.length; i++) {
                dropdownList.push({"value": filepath + "::" + allProjects[i].pid, "text": allProjects[i].pName})
            }
        }
        TemplateHelper.updateTemplateText(template, {"add-project-files-form.project": dropdownList});
        return template;
    },
    save: function(formData, callback) {
        var resultData = ["table_name", "unique_id", "pid", "username", "subject", "filepath"];
        var url = Config.getApiUrl("addTextApi", null, true);
        if (!$S.isString(url)) {
            return;
        }
        formData["table_name"] = DataHandler.getTableName("fileTable");
        if (!$S.isStringV2(formData["table_name"])) {
            alert(FormHandler.GetAleartMessage("tableName.invalid"))
            return;
        }
        formData["unique_id"] = FormHandler.GetUniqueId();
        formData["username"] = AppHandler.GetUserData("username", "");
        var finalText = [];
        for(var i=0; i<resultData.length; i++) {
            finalText.push(formData[resultData[i]]);
        }
        var postData = {};
        postData["subject"] = formData[Config.fieldsKey.ProjectNameKey];
        postData["heading"] = formData["pid"];
        postData["text"] = [finalText.join(",")];
        postData["filename"] = formData["table_name"] + ".csv";
        DataHandler.setData("addentry.submitStatus", "in_progress");
        $S.callMethod(callback);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("addentry.submitStatus", "completed");
            $S.callMethod(callback);
            if (status === "FAILURE") {
                AppHandler.TrackApiRequest("addNewProject", "FAILURE");
                alert("Error in uploading data, Please Try again.");
            } else {
                AppHandler.TrackApiRequest("addNewProject", "SUCCESS");
                AppHandler.LazyReload(250);
            }
        });
    },
    submit: function(pageName, callback) {
        var requiredKeys = [Config.fieldsKey.ProjectFileKey];
        var fieldsData = DataHandler.getData("fieldsData", {});
        var i, isFormValid = true, temp, value;
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        for (i=0; i<requiredKeys.length; i++) {
            temp = fieldsData[requiredKeys[i]];
            if (!$S.isStringV2(temp)) {
                isFormValid = false;
                alert(FormHandler.GetAleartMessage(requiredKeys[i]));
                return;
            }
            value = temp;
        }
        var subject, filepath, pid;
        var fileTableName = DataHandler.getTableName("fileTable");
        var projectTableName = DataHandler.getTableName("projectTable");
        var valueArr = value.split("::");
        if (valueArr.length === 2) {
            filepath = valueArr[0];
            pid = valueArr[1];
        }
        var fileTable = DataHandlerV2.getTableDataByAttr(fileTableName, "filename", filepath);
        var projectTable = DataHandlerV2.getTableDataByAttr(projectTableName, "pid", pid);
        if (!$S.isArray(projectTable) || projectTable.length !== 1 || !$S.isObject(projectTable[0])) {
            alert("Invalid project Id");
            return;
        }
        if ($S.isArray(fileTable) && fileTable.length > 0) {
            if ($S.isObject(fileTable[fileTable.length-1])) {
                subject = fileTable[fileTable.length-1].subject;
            }
        }
        if (!$S.isStringV2(subject)) {
            subject = "File added to Project " + projectTable[0].pName;
        }
        if (isFormValid) {
            FormHandlerUploadFile.addInFileTable(filepath, subject, pid, function() {
                AppHandler.LazyReload(250);
            });
        }
    }
});
})($S);

export default FormHandlerAddProjectFiles;
