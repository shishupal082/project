import $S from "../../interface/stack.js";
// import Config from "./Config";
// import DataHandler from "./DataHandler";

import Template from "./Template";
import TemplateHelper from "../../common/TemplateHelper";

var TemplateHandler;
(function($S){

TemplateHandler = function(arg) {
    return new TemplateHandler.fn.init(arg);
};
TemplateHandler.fn = TemplateHandler.prototype = {
    constructor: TemplateHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(TemplateHandler);

TemplateHandler.extend({
    getTemplate: function(pageName) {
        if (Template[pageName]) {
            return $S.clone(Template[pageName]);
        }
        return $S.clone(Template["noDataFound"]);
    }
});

TemplateHandler.extend({
    "entry": function(template, data, pageName) {
        if (!$S.isArray(data)) {
            return TemplateHandler.getTemplate("noDataFound");
        }
        var renderField = template;
        for(var i=0; i<data.length; i++) {
            data[i]["s.no."] = i+1;
            var rowTemplate = TemplateHandler.getTemplate("entry.data");
            TemplateHelper.updateTemplateText(rowTemplate, data[i]);
            TemplateHelper.addItemInTextArray(template, "entry.data", rowTemplate);
        }
        return renderField;
    },
    "home": function() {
        return TemplateHandler.getTemplate("noDataFound");
    }
});

})($S);

export default TemplateHandler;
