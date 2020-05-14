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
        var status = false;
        if (!$S.isString(fieldName) || !$S.isString(value)) {
            console.log("Invalid fieldName or value: " + fieldName + ", " + value);
            return false;
        }
        if ($S.isArray(this.template)) {
            this.template.map(function(el, index, arr) {
                status = Template(el).updateField(fieldName, value);
            });
        } else if ($S.isObject(this.template)) {
            // name will be unique in each template
            if (this.template["name"] === fieldName) {
                this.template["value"] = value;
            } else {
                Template(this.template["text"]).updateField(fieldName, value);
            }
            return true;
        }
        return status;
    }
};
$S.extendObject(Template);

TemplateHelper = Template;
})($S);
export default TemplateHelper;
