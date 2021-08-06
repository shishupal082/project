import $S from "../../interface/stack.js";
import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";
import DataHandler from "./DataHandler";
import Template from "./Template";
// import Config from "./Config";

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
    checkUserDependentLink: function(template) {
        var userData = AppHandler.GetUserDetails();
        if ($S.isObject(userData) && $S.isObject(userData.roles)) {
            for(var linkName in userData.roles) {
                if ($S.isBooleanTrue(userData.roles[linkName])) {
                    TemplateHelper.removeClassTemplate(template, linkName, "d-none");
                }
            }
        }
        return template;
    },
    getLinkTemplate: function() {
        var linkTemplate = AppHandler.getTemplate(Template, "link", {});
        var field = TemplateHelper(linkTemplate).searchField("link.loginAs");
        field.text = AppHandler.GetUserData("username", "");
        linkTemplate = this.checkUserDependentLink(linkTemplate);
        return linkTemplate;
    }
});
TemplateHandler.extend({
    getLoginOtherUserTemplate: function() {
        var template = AppHandler.getTemplate(Template, "login_other_user", "Page Not Found");
        var relatedUsersData = DataHandler.getData("relatedUsersData", []);
        var dropDownOption = [{"value": "", "text": "Select User..."}];
        var currentUsername = AppHandler.GetUserData("username", "");
        var otherUsername, count = 1;
        if ($S.isArray(relatedUsersData)) {
            relatedUsersData = $S.sortResult(relatedUsersData, "ascending", "username");
            for(var i=0; i<relatedUsersData.length; i++) {
                if (!$S.isObject(relatedUsersData[i])) {
                    continue;
                }
                otherUsername = relatedUsersData[i].username;
                if ($S.isStringV2(currentUsername) && currentUsername !== otherUsername) {
                    dropDownOption.push({"value": otherUsername, "text": count + ": " + otherUsername});
                    count++;
                }
            }
            TemplateHelper.updateTemplateText(template, {"login_other_user.username": dropDownOption});
        }
        return template;
    }
});
TemplateHandler.extend({
    getRenderField: function(pageName, renderData) {
        if (!$S.isObject(renderData)) {
            renderData = {};
        }
        var renderFieldRow;
        var fieldsValue = renderData.fieldsValue;
        var submitBtnName = renderData.submitBtnName;
        var formSubmitStatus = renderData.formSubmitStatus;
        var displayCreatePasswordLinkEnable;
        if (!$S.isObject(fieldsValue)) {
            fieldsValue = {};
        }
        switch(pageName) {
            case "login":
            case "register":
            case "change_password":
            case "create_password":
                renderFieldRow = AppHandler.getTemplate(Template, pageName, "Page Not Found");
            break;
            case "forgot_password":
                renderFieldRow = AppHandler.getTemplate(Template, pageName, "Page Not Found");
                displayCreatePasswordLinkEnable = AppHandler.GetStaticData("displayCreatePasswordLinkEnable");
                if (displayCreatePasswordLinkEnable === "true") {
                    TemplateHelper.removeClassTemplate(renderFieldRow, "displayCreatePasswordLinkEnable", "d-none");
                }
            break;
            case "logout":
            case "login_other_user":
                renderFieldRow = this.getLoginOtherUserTemplate();
            break;
            case "noMatch":
            default:
                renderFieldRow = AppHandler.getTemplate(Template, "noPageFound", "Page Not Found");
            break;
        }
        if ($S.isBooleanTrue(renderData.isGuestLoginEnable)) {
            TemplateHelper.removeClassTemplate(renderFieldRow, "login.guest-login-link", "d-none");
        }
        TemplateHelper.updateTemplateValue(renderFieldRow, fieldsValue);
        if ($S.isStringV2(submitBtnName)) {
            if (formSubmitStatus === "in_progress") {
                TemplateHelper.removeClassTemplate(renderFieldRow, submitBtnName, "btn-primary");
                TemplateHelper.addClassTemplate(renderFieldRow, submitBtnName, "btn-link disabled");
            } else {
                TemplateHelper.addClassTemplate(renderFieldRow, submitBtnName, "btn-primary");
                TemplateHelper.removeClassTemplate(renderFieldRow, submitBtnName, "btn-link disabled");
            }
        }
        var footerTemplate = AppHandler.getTemplate(Template, "footerLinkJson", {});
        var footerTemplateAfterLogin = AppHandler.getTemplate(Template, "footerLinkJsonAfterLogin", {});
        var isLogin = AppHandler.GetUserData("login", false);
        if (isLogin) {
            footerTemplate = footerTemplateAfterLogin;
        }
        footerTemplate = TemplateHandler.checkUserDependentLink(footerTemplate);
        var renderField = [];
        if ($S.isBooleanTrue(isLogin)) {
            renderField.push(this.getLinkTemplate());
        }
        renderField.push(renderFieldRow);
        renderField.push(footerTemplate);
        return renderField;
    }
});
})($S);

export default TemplateHandler;
