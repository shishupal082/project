import $S from '../interface/stack.js';
var TemplateHelper;
var TextFilter = $S.getTextFilter();
(function($S) {
var Template = function(template) {
    return new Template.fn.init(template);
};
Template.fn = Template.prototype = {
    constructor: Template,
    init: function(template) {
        this.template = template;
        return this;
    },
    searchField: function (fieldName) {
        if (!$S.isString(fieldName)) {
            return {};
        }
        var field = {};
        if ($S.isArray(this.template)) {
            for (var i = 0; i<this.template.length; i++) {
                field = Template(this.template[i]).searchField(fieldName);
                if (field.name === fieldName) {
                    return field;
                }
            }
        } else if ($S.isObject(this.template)) {
            if (this.template["name"] === fieldName) {
                return this.template;
            }
            return Template(this.template["text"]).searchField(fieldName);
        }
        return {};
    },
    generateFormValues: function(formValue) {
        var i;
        if ($S.isObject(this.template)) {
            if ($S.isString(this.template.name)) {
                formValue[this.template.name] = this.template.value;
            }
            if ($S.isArray(this.template.text)) {
                for (i = 0; i<this.template.text.length; i++) {
                    Template(this.template.text[i]).generateFormValues(formValue);
                }
            } else if ($S.isObject(this.template.text)) {
                Template(this.template.text).generateFormValues(formValue);
            }
        } else if ($S.isArray(this.template)) {
            for (i = 0; i<this.template.length; i++) {
                Template(this.template[i]).generateFormValues(formValue);
            }
        }
        return formValue;
    }
};
$S.extendObject(Template);
function updateField(field, attr) {
    if ($S.isObject(field) && $S.isObject(attr)) {
        for (var key in attr) {
            switch(key) {
                case "addClass":
                    field.className = TextFilter(field.className).addClass(attr[key]).getClassName();
                break;
                case "removeClass":
                    field.className = TextFilter(field.className).removeClass(attr[key]).getClassName();
                break;
                case "setValue":
                    field.value = attr[key];
                break;
                case "setText":
                    field.text = attr[key];
                break;
                default:
                break;
            }
        }
    }
}
Template.extend({
    setTemplateTextByFormValues: function(template, formValues) {
        var field = {};
        if ($S.isObject(formValues)) {
            for (var fieldName in formValues) {
                field = TemplateHelper(template).searchField(fieldName);
                if (field.name === fieldName) {
                    updateField(field, {"setText": formValues[fieldName]});
                }
            }
        }
        return template;
    },
    updateFieldByAttr: function (formRowFields, formRowId, fieldName, attr) {
        if (!$S.isArray(formRowFields) || !$S.isString(formRowId) || !$S.isString(fieldName)) {
            return formRowFields;
        }
        var field = {};
        for (var i = 0; i < formRowFields.length; i++) {
            if (formRowFields[i].formRowId === formRowId) {
                field = TemplateHelper(formRowFields[i].templateData).searchField(fieldName);
                break;
            }
        }
        if (field.name === fieldName) {
            updateField(field, attr);
        }
        // console.log(field);
        return formRowFields;
    },
    updateTemplateValue: function(template, values) {
        var field = {};
        if ($S.isObject(values)) {
            for (var fieldName in values) {
                field = TemplateHelper(template).searchField(fieldName);
                if (field.name === fieldName) {
                    updateField(field, {"setValue": values[fieldName]});
                }
            }
        }
        return template;
    }
});
Template.extend({
    validateData: function(formValues) {
        var response = {"status": "SUCCESS", "alertMessage": "Data saved: Click on Print Display."};
        var formRowId, fieldName;
        if ($S.isArray(formValues) && formValues.length > 1) {
            var lastDateTime = 0, keys =[], sd, ed, dt, at, sdO, edO;
            for (var i = 1; i < formValues.length; i++) {
                formRowId = formValues[i]["formRowId"];
                if (!$S.isObject(formValues[i])) {
                    continue;
                }
                keys = Object.keys(formValues[i]);
                sd = formValues[i]["startDate"];
                ed = formValues[i]["endDate"];
                dt = "";
                at = "";
                sdO = new Date(sd);
                edO = new Date(ed);
                if (!$S.isNumber(sdO.getTime()) || !$S.isNumber(edO.getTime())) {
                    fieldName = $S.isNumber(sdO.getTime()) ? "endDate" : "startDate";
                    response["status"] = "FAILURE";
                    response["reason"] = "InvalidDate";
                    response["alertMessage"] = "Invalid start date or end date";
                    break;
                }
                if (sdO.getTime() > edO.getTime()) {
                    fieldName = "endDate";
                    response["status"] = "FAILURE";
                    response["reason"] = "InvalidStartDate";
                    response["alertMessage"] = "End Date should not be before Start Date";
                    break;
                }
                if (keys.length > 6) {
                    dt = formValues[i]["departureTime"];
                    at = formValues[i]["arrivalTime"];
                    if (sdO.getTime() === edO.getTime()) {
                        if (at < dt) {
                            fieldName = "arrivalTime";
                            response["status"] = "FAILURE";
                            response["reason"] = "InvalidDepartureTime";
                            response["alertMessage"] = "Departure time cannot be after arrival time";
                            break;
                        }
                    }
                }
                sdO = new Date(sd + " " + dt);
                if ($S.isNumber(lastDateTime) && lastDateTime > sdO.getTime()) {
                    fieldName = "startDate";
                    response["status"] = "FAILURE";
                    response["reason"] = "InvalidDepartureTime";
                    response["alertMessage"] = "Start date of next journey cannot be before end date of previous journey";
                    break;
                }
                lastDateTime = new Date(ed + " " + at).getTime();
            }
        } else {
            response["status"] = "FAILURE";
            response["reason"] = "AtLeastOneEntry";
            response["alertMessage"] = "At least one entry required";
        }
        response["formRowId"] = formRowId;
        response["fieldName"] = fieldName;
        return response;
    }
});
TemplateHelper = Template;
})($S);
export default TemplateHelper;
