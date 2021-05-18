import $S from "../interface/stack.js";
import TemplateHelper from "../common/TemplateHelper";
import Config from "./Config";

var TemplateHandler

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
    checkUserDependentFooterLink: function(template) {
        var userData = Config.getAllUserData();
        if ($S.isObject(userData)) {
            for(var linkName in userData) {
                if (userData[linkName] === "true") {
                    TemplateHelper.removeClassTemplate(template, linkName, "d-none");
                }
            }
        }
        return template;
    }
});

})($S);

export default TemplateHandler;
