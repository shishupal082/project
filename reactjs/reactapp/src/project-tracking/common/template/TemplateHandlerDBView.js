import $S from "../../../interface/stack.js";
// import Config from "../Config";
import DataHandler from "../DataHandler";
// import FormHandler from "../forms/FormHandler";

import TemplateHandler from "./TemplateHandler";

// import TemplateHelper from "../../../common/TemplateHelper";
// import AppHandler from "../../../common/app/common/AppHandler";
// import DBViewDataHandler from "../../../common/app/common/DBViewDataHandler";
import DBViewTemplateHandler from "../../../common/app/common/DBViewTemplateHandler";

var TemplateHandlerDBView;
(function($S){
// var DT = $S.getDT();
// var loadingCount = 0;
TemplateHandlerDBView = function(arg) {
    return new TemplateHandlerDBView.fn.init(arg);
};
TemplateHandlerDBView.fn = TemplateHandlerDBView.prototype = {
    constructor: TemplateHandlerDBView,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(TemplateHandlerDBView);
TemplateHandlerDBView.extend({
    getDbViewFieldsV2: function(renderData) {
        var template;
        var currentList3Data = DataHandler.getCurrentList3Data();
        var sortingFields = DataHandler.getData("sortingFields", []);
        if (!$S.isArray(renderData) || renderData.length === 0) {
            template = TemplateHandler.getTemplate("noDataFound");
        } else {
            template = DBViewTemplateHandler.GenerateDbViewRenderField(renderData, currentList3Data, sortingFields);
        }
        return template;
    }
});

})($S);

export default TemplateHandlerDBView;
