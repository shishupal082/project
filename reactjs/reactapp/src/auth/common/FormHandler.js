import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandler from "./DataHandler";
import AppHandler from "../../common/app/common/AppHandler";

var FormHandler;

(function($S){

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
    parseUsername: function(str) {
        try {
            var data = JSON.parse(str);
            return data["username"];
        } catch(e) {}
        return "";
    },
    getAleartMessage: function(response) {
        var messageMap = {};
        if (!$S.isObject(response)) {
            return response;
        }
        var messageCode = response.failureCode;
        var error = response.error;
        if ($S.isString(messageMap[messageCode])) {
            return messageMap[messageCode];
        }
        return error;
    },
    getSuccessMessage: function(response) {
        if ($S.isString(response.data)) {
            return response.data;
        }
        return "SUCCESS";
    },
    handleApiResponse: function(callback, apiName, ajax, response) {
        function getLoginRedirectUrl(response) {
            if ($S.isObject(response) && response.status === "SUCCESS") {
                if ($S.isObject(response.data) && $S.isString(response.data.loginRedirectUrl)) {
                    if (response.data.loginRedirectUrl.length > 0) {
                        return response.data.loginRedirectUrl;
                    }
                }
            }
            return Config.loginRedirectUrl;
        }
        if (["login", "register", "login_other_user_form"].indexOf(apiName) >= 0) {
            if (response.status === "FAILURE") {
                $S.callMethod(callback);
                alert(this.getAleartMessage(response));
                if (response.failureCode === "USER_ALREADY_LOGIN") {
                    AppHandler.LazyReload();
                }
            } else {
                AppHandler.LazyRedirect(getLoginRedirectUrl(response), 250);
            }
        } else if (["create_password"].indexOf(apiName) >= 0) {
            if (response.status === "FAILURE") {
                $S.callMethod(callback);
                alert(this.getAleartMessage(response));
                if (response.failureCode === "USER_ALREADY_LOGIN") {
                    AppHandler.LazyReload();
                } else if (response.failureCode === "CREATE_PASSWORD_OTP_EXPIRED") {
                    Config.location.href = "/forgot_password";
                }
            } else {
                AppHandler.LazyRedirect(getLoginRedirectUrl(response), 250);
            }
        } else if (["forgot_password"].indexOf(apiName) >= 0) {
            if (response.status === "FAILURE") {
                alert(this.getAleartMessage(response));
                if (response.failureCode === "USER_ALREADY_LOGIN") {
                    AppHandler.LazyReload();
                } else if (response.failureCode === "FORGOT_PASSWORD_REPEAT_REQUEST") {
                    Config.location.href = "/create_password";
                }
            } else {
                alert(this.getSuccessMessage(response));
                Config.location.href = "/create_password";
            }
        } else if (apiName === "change_password") {
            if (response.status === "FAILURE") {
                $S.callMethod(callback);
                alert(this.getAleartMessage(response));
                if (response.failureCode === "UNAUTHORIZED_USER") {
                    AppHandler.LazyReload();
                }
            } else {
                AppHandler.LazyRedirect(getLoginRedirectUrl(response), 250);
            }
        } else if (apiName === "reset_count") {
            if (response.status === "FAILURE") {
                $S.callMethod(callback);
                alert(this.getAleartMessage(response));
                if (response.failureCode === "UNAUTHORIZED_USER") {
                    AppHandler.LazyReload();
                }
            } else {
                AppHandler.LazyReload();
            }
        }
    },
    trackResponse: function(username, userAgent, pageName, response) {
        var status = pageName;
        if ($S.isObject(response)) {
            status += ":"+response.status;
            if ($S.isStringV2(response.failureCode)) {
                status += ":"+response.failureCode;
            }
        }
        AppHandler.Track(username, status, userAgent);
    },
    trackResponseAfterLogin: function(apiName, response) {
        var status = "";
        if ($S.isObject(response) && $S.isStringV2(response.status)) {
            status = response.status;
            if ($S.isStringV2(response.failureCode)) {
                status += ":"+response.failureCode;
            }
        }
        AppHandler.TrackApiRequest(apiName, status);
    },
    handleRegisterForm: function(pageName, callback) {
        var url = Config.getApiUrl(pageName, null, true);
        var postData = {};
        DataHandler.setData("formSubmitStatus", "in_progress");
        $S.callMethod(callback);
        postData["username"] = DataHandler.getData("register.username", "");
        postData["passcode"] = DataHandler.getData("register.passcode", "");
        postData["password"] = DataHandler.getData("register.password", "");
        postData["display_name"] = DataHandler.getData("register.displayName", "");
        postData["mobile"] = DataHandler.getData("register.mobile", "");
        postData["email"] = DataHandler.getData("register.email", "");
        postData["user_agent"] = $S.getUserAgentTrackingData(Config.navigator);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("formSubmitStatus", "completed");
            DataHandler.isAndroid(postData["username"]);
            if (status === "FAILURE") {
                $S.callMethod(callback);
                response = {"status": "FAILURE_RESPONSE"};
                response["data"] = FormHandler.parseUsername(ajax.data);
                FormHandler.trackResponse(postData["username"], postData["user_agent"], pageName, response);
                alert("Error in register user, Please Try again.");
            } else {
                FormHandler.trackResponse(postData["username"], postData["user_agent"], pageName, response);
                FormHandler.handleApiResponse(callback, pageName, ajax, response);
            }
        });
    },
    handleLoginForm: function(pageName, callback) {
        var url = Config.getApiUrl(pageName, null, true);
        var postData = {};
        DataHandler.setData("formSubmitStatus", "in_progress");
        $S.callMethod(callback);
        var guestLoginStatus = DataHandler.getData("guest-login-status", false);
        var username = DataHandler.getData("login.username", "");
        var password = DataHandler.getData("login.password", "");
        if ($S.isBooleanTrue(guestLoginStatus)) {
            username = "Guest";
            password = "Guest";
            DataHandler.setData("guest-login-status", "false");
        }
        postData["username"] = username;
        postData["password"] = password;
        postData["user_agent"] = $S.getUserAgentTrackingData(Config.navigator);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("formSubmitStatus", "completed");
            DataHandler.isAndroid(postData["username"]);
            if (status === "FAILURE") {
                $S.callMethod(callback);
                response = {"status": "FAILURE_RESPONSE"};
                response["data"] = FormHandler.parseUsername(ajax.data);
                FormHandler.trackResponse(postData["username"], postData["user_agent"], pageName, response);
                alert("Error in login, Please Try again.");
            } else {
                FormHandler.trackResponse(postData["username"], postData["user_agent"], pageName, response);
                FormHandler.handleApiResponse(callback, pageName, ajax, response);
            }
        });
    },
    handleSocialLoginForm: function(pageName, callback) {
        var url = Config.getApiUrl("login_social", null, true);
        var postData = {};
        DataHandler.setData("formSubmitStatus", "in_progress");
        $S.callMethod(callback);
        var tokenId = DataHandler.getData("social_login_token_id", "");
        postData["id_token"] = tokenId;
        postData["type"] = "LOGIN_WITH_GOOGLE";
        postData["username"] = DataHandler.getData("social_login_email", "");
        postData["user_agent"] = $S.getUserAgentTrackingData(Config.navigator);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("formSubmitStatus", "completed");
            DataHandler.isAndroid(postData["username"]);
            if (status === "FAILURE") {
                $S.callMethod(callback);
                response = {"status": "FAILURE_RESPONSE"};
                response["data"] = FormHandler.parseUsername(ajax.data);
                FormHandler.trackResponse(postData["username"], postData["user_agent"], "login_social", response);
                alert("Error in login, Please Try again.");
            } else {
                FormHandler.trackResponse(postData["username"], postData["user_agent"], "login_social", response);
                FormHandler.handleApiResponse(callback, pageName, ajax, response);
            }
        });
    },
    handleChangePasswordForm: function(pageName, callback) {
        var username = AppHandler.GetUserData("username", "");
        var url = Config.getApiUrl(pageName, null, true) + "?u=" + username;
        var postData = {};
        DataHandler.setData("formSubmitStatus", "in_progress");
        $S.callMethod(callback);
        postData["old_password"] = DataHandler.getData("change_password.old_password", "");
        postData["new_password"] = DataHandler.getData("change_password.new_password", "");
        postData["confirm_password"] = DataHandler.getData("change_password.confirm_password", "");
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("formSubmitStatus", "completed");
            DataHandler.isAndroid(AppHandler.GetTrackUsername());
            if (status === "FAILURE") {
                $S.callMethod(callback);
                FormHandler.trackResponseAfterLogin(pageName, {"status": "FAILURE_RESPONSE"});
                alert("Error in change password, Please Try again.");
            } else {
                FormHandler.trackResponseAfterLogin(pageName, response);
                FormHandler.handleApiResponse(callback, pageName, ajax, response);
            }
        });
    },
    handleForgotPasswordForm: function(pageName, callback) {
        var url = Config.getApiUrl(pageName, null, true);
        var postData = {};
        DataHandler.setData("formSubmitStatus", "in_progress");
        $S.callMethod(callback);
        postData["username"] = DataHandler.getData("forgot_password.username", "");
        postData["mobile"] = DataHandler.getData("forgot_password.mobile", "");
        postData["email"] = DataHandler.getData("forgot_password.email", "");
        postData["user_agent"] = $S.getUserAgentTrackingData(Config.navigator);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("formSubmitStatus", "completed");
            $S.callMethod(callback);
            DataHandler.isAndroid(postData["username"]);
            if (status === "FAILURE") {
                response = {"status": "FAILURE_RESPONSE"};
                response["data"] = FormHandler.parseUsername(ajax.data);
                FormHandler.trackResponse(postData["username"], postData["user_agent"], pageName, response);
                alert("Error in forgot password, Please Try again.");
            } else {
                FormHandler.trackResponse(postData["username"], postData["user_agent"], pageName, response);
                FormHandler.handleApiResponse(callback, pageName, ajax, response);
            }
        });
    },
    handleCreatePasswordForm: function(pageName, callback) {
        var url = Config.getApiUrl(pageName, null, true);
        var postData = {};
        DataHandler.setData("formSubmitStatus", "in_progress");
        $S.callMethod(callback);
        postData["username"] = DataHandler.getData("create_password.username", "");
        postData["create_password_otp"] = DataHandler.getData("create_password.create_password_otp", "");
        postData["new_password"] = DataHandler.getData("create_password.new_password", "");
        postData["confirm_password"] = DataHandler.getData("create_password.confirm_password", "");
        postData["user_agent"] = $S.getUserAgentTrackingData(Config.navigator);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("formSubmitStatus", "completed");
            DataHandler.isAndroid(postData["username"]);
            if (status === "FAILURE") {
                $S.callMethod(callback);
                response = {"status": "FAILURE_RESPONSE"};
                response["data"] = FormHandler.parseUsername(ajax.data);
                FormHandler.trackResponse(postData["username"], postData["user_agent"], pageName, response);
                alert("Error in create password, Please Try again.");
            } else {
                FormHandler.trackResponse(postData["username"], postData["user_agent"], pageName, response);
                FormHandler.handleApiResponse(callback, pageName, ajax, response);
            }
        });
    },
    handleLoginOtherUser: function(pageName, callback, formName) {
        var url = Config.getApiUrl("login_other_user", null, true);
        var orgUsername = AppHandler.GetUserData("orgUsername", "");
        var postData = {};
        if (!$S.isStringV2(orgUsername)) {
            orgUsername = "";
        }
        DataHandler.setData("formSubmitStatus", "in_progress");
        $S.callMethod(callback);
        var username = DataHandler.getData("login_other_user.username", "");
        postData["username"] = username;
        postData["user_agent"] = $S.getUserAgentTrackingData(Config.navigator);
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("formSubmitStatus", "completed");
            if (status === "FAILURE") {
                $S.callMethod(callback);
                response = {"status": "FAILURE_RESPONSE"};
                response["data"] = FormHandler.parseUsername(ajax.data);
                FormHandler.trackResponse(orgUsername + ":" + postData["username"], postData["user_agent"], "login_other_user", response);
                alert("Error in login, Please Try again.");
            } else {
                FormHandler.trackResponse(orgUsername + ":" + postData["username"], postData["user_agent"], "login_other_user", response);
                FormHandler.handleApiResponse(callback, "login_other_user_form", ajax, response);
            }
        });
    },
    handleResetCountClick: function(pageName, callback) {
        var apiName = "reset_count";
        var url = Config.getApiUrl(apiName, null, true);
        var postData = {};
        DataHandler.setData("formSubmitStatus", "in_progress");
        $S.callMethod(callback);
        postData["username"] = DataHandler.getData("user_control.reset_count_username", "");
        $S.sendPostRequest(Config.JQ, url, postData, function(ajax, status, response) {
            DataHandler.setData("formSubmitStatus", "completed");
            DataHandler.isAndroid(postData["username"]);
            if (status === "FAILURE") {
                $S.callMethod(callback);
                response = {"status": "FAILURE_RESPONSE"};
                response["data"] = FormHandler.parseUsername(ajax.data);
                FormHandler.trackResponseAfterLogin(apiName, response);
                alert("Error in reset count, Please Try again.");
            } else {
                FormHandler.trackResponseAfterLogin(apiName, response);
                FormHandler.handleApiResponse(callback, apiName, ajax, response);
            }
        });
    }
});
})($S);

export default FormHandler;
