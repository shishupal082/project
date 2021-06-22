import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import Config from "../Config";

import TemplateHelper from "../../../common/TemplateHelper";

import FormHandlerAddSupplyStatus from "./FormHandlerAddSupplyStatus";
import FormHandlerAddSupplyItem from "./FormHandlerAddSupplyItem";
import FormHandlerCreateNewProject from "./FormHandlerCreateNewProject";
import FormHandlerAddWorkStatus from "./FormHandlerAddWorkStatus";


var FormHandler;

(function($S){
var DT = $S.getDT();

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
        var messageMapping = Config.messageMapping;
        if ($S.isObject(messageMapping) && $S.isString(messageMapping[key])) {
            return messageMapping[key];
        }
        return "Invalid " + key;
    },
    FormateString: function(str) {
        if (!$S.isStringV2(str)) {
            return str;
        }
        var temp = str.split("\n"), finalText = [];
        for (var i = 0; i < temp.length; i++) {
            if (temp[i].trim() !== "") {
                finalText.push(temp[i]);
            }
        }
        return finalText.join("; ");
    },
    GetUniqueId: function() {
        return DT.getDateTime("YYYY/MM/DD/hh/mm/ss/./ms","/");
    }
});
FormHandler.extend({
    submitNewProject: function(callback) {
        FormHandlerCreateNewProject.submit(callback);
    },
    submitNewSupplyItem: function(callback) {
        FormHandlerAddSupplyItem.submit(callback);
    },
    submitAddSupplyStatus: function(callback) {
        FormHandlerAddSupplyStatus.submit(callback);
    },
    submitNewWorkStatus: function(callback) {
        FormHandlerAddWorkStatus.submit(callback);
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
    getAddNewProjectTemplate: function() {
        var formTemplate = FormHandlerCreateNewProject.getFormTemplate();
        this.updateBtnStatus(formTemplate);
        return formTemplate;
    },
    getAddNewSupplyItemTemplate: function() {
        var formTemplate = FormHandlerAddSupplyItem.getFormTemplate();
        this.updateBtnStatus(formTemplate);
        return formTemplate;
    },
    getAddNewWorkTemplate: function() {
        var formTemplate = FormHandlerAddWorkStatus.getFormTemplate();
        this.updateBtnStatus(formTemplate);
        return formTemplate;
    },
    getAddNewSupplyTemplate: function() {
        var formTemplate = FormHandlerAddSupplyStatus.getFormTemplate();
        this.updateBtnStatus(formTemplate);
        return formTemplate;
    }
});
})($S);

export default FormHandler;
