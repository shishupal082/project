import $S from '../interface/stack.js';
var TemplateHelper
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
    updateField: function(fieldName, value) {
        if (!$S.isString(fieldName) || !$S.isString(value)) {
            console.log("Invalid fieldName or value: " + fieldName + ", " + value);
            return false;
        }
        if ($S.isArray(this.template)) {
            for (var i = this.template.length - 1; i >= 0; i--) {
                Template(this.template[i]).updateField(fieldName, value);
            }
        } else if ($S.isObject(this.template)) {
            // name will be unique in each template
            if (this.template["name"] === fieldName) {
                this.template["value"] = value;
                // console.log(fieldName + ":::" + value);
            } else {
                Template(this.template["text"]).updateField(fieldName, value);
            }
            return true;
        }
        return false;
    },
    getFieldData: function(res) {
        var i;
        if ($S.isObject(this.template)) {
            if ($S.isString(this.template.name)) {
                res[this.template.name] = this.template.value;
            }
            if ($S.isArray(this.template.text)) {
                for (i = 0; i<this.template.text.length; i++) {
                    Template(this.template.text[i]).getFieldData(res);
                }
            } else if ($S.isObject(this.template.text)) {
                Template(this.template.text).getFieldData(res);
            }
        } else if ($S.isArray(this.template)) {
            for (i = 0; i<this.template.length; i++) {
                Template(this.template[i]).getFieldData(res);
            }
        }
        return res;
    }
};
$S.extendObject(Template);

TemplateHelper = Template;
})($S);
export default TemplateHelper;
