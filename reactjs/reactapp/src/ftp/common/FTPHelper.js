import $S from "../../interface/stack.js";
import TemplateHelper from "../../common/TemplateHelper";
import Config from "./Config";

var FTPHelper = {};

(function($S){
// var DT = $S.getDT();
var TextFilter = $S.getTextFilter();
var FTP = function(arg) {
    return new FTP.fn.init(arg);
};

FTP.fn = FTP.prototype = {
    constructor: FTP,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(FTP);

//setLinkTemplate
FTP.extend({
    setLinkTemplate: function(Data) {
        var linkTemplate = Data.getTemplate("link", {});
        var field = TemplateHelper(linkTemplate).searchField("link.loginAs");
        field.text = Data.getUserData("username", "");

        // field = TemplateHelper(linkTemplate).searchField("link.logout");
        // field.className = TextFilter(field.className).addClass("d-none").className;

        field = TemplateHelper(linkTemplate).searchField("link.change_password");
        field.className = TextFilter(field.className).addClass("d-none").className;

        field = TemplateHelper(linkTemplate).searchField("link.forgot_password");
        field.className = TextFilter(field.className).addClass("d-none").className;

        Data.setData("linkTemplate", linkTemplate);
        return linkTemplate;
    }
});

// checkForRedirect
FTP.extend({
    checkForRedirect: function(Data) {
        var pageName = Data.getUserData("page", "");
        var isLogin = Data.getUserData("is_login", false);
        var redirectStatus = false;
        if (["logout"].indexOf(pageName) >= 0) {
            Config.location.href = Config.basepathname + "/dashboard";
            redirectStatus = true;
        } else if (["dashboard", "upload_file", "change_password"].indexOf(pageName) >= 0) {
            if (!isLogin) {
                Config.location.href = Config.basepathname + "/login";
                redirectStatus = true;
            }
        } else if (["forgot_password", "login"].indexOf(pageName) >= 0) {
            if (isLogin) {
                Config.location.href = Config.basepathname + "/dashboard";
                redirectStatus = true;
            }
        }
        return redirectStatus;
    }
});

//getFieldTemplateByPageName
FTP.extend({
    getFieldTemplateByPageName: function(Data, pageName) {
        var pageTemplate = [], temp;
        if (pageName === "upload_file") {
            temp = Data.getData("uploadFileTemplate", null);
            if (temp !== null) {
                pageTemplate.push(temp);
            } else {
                pageTemplate.push(Data.getTemplate(pageName, {}));
            }
        } else {
            pageTemplate.push(Data.getTemplate(pageName, {}));
        }
        return pageTemplate;
    }
});
FTPHelper = FTP;
})($S);

export default FTPHelper;
