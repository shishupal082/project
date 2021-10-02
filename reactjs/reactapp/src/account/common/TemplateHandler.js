import $S from '../../interface/stack.js';
// import TemplateHelper from '../../common/TemplateHelper';
import Config from './Config';
import DataHandler from './DataHandler';

var TemplateHandler;

(function($S){
// var DT = $S.getDT();
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
    getAppHeading: function(currentPageName) {
        var goBackLinkData = Config.goBackLinkData;
        if (currentPageName === "home") {
            goBackLinkData = [];
        }
        var headingText = DataHandler.getData("companyName", "");
        var pageHeading = DataHandler.GetMetaDataPageHeading(currentPageName);
        var appHeading = {
            "tag": "div",
            "className": "container",
            "text": [goBackLinkData, {"tag": "div.center.h2", "text": headingText},{"tag": "div.center.h2", "text": pageHeading}]
        };
        return [appHeading];
    }
});

})($S);

export default TemplateHandler;

