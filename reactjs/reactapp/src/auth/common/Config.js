import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";
import TemplateHelper from "../../common/TemplateHelper.js";
import Template from "./Template";


var Config = {"name": "Config", "imgExt": ["jpg", "jpeg", "png"]};

Config.RequestId = $S.getRequestId();

var PageData = {};
var UserData = {};

var baseApi = $$$.baseApi;
var basepathname = $$$.basepathname;
var headingJson = $$$.headingJson;
var afterLoginLinkJson = $$$.afterLoginLinkJson;
var footerLinkJson = $$$.footerLinkJson;
var footerLinkJsonAfterLogin = $$$.footerLinkJsonAfterLogin;
var loginUserDetails = $$$.loginUserDetails;
var createPasswordOtpInstruction = $$$.createPasswordOtpInstruction;
var loginRedirectUrl = $$$.loginRedirectUrl;

Config.gtag = $$$.gtag;
Config.navigator = $$$.navigator;
Config.JQ = $$$.JQ;
Config.location = $$$.location;


Config.baseApi = baseApi;
Config.basepathname = basepathname;


if (!$S.isString(loginRedirectUrl) || loginRedirectUrl.length < 1) {
    loginRedirectUrl = "/view/resource";
}

Config.loginRedirectUrl = loginRedirectUrl;
Config.googleLoginClientId = $$$.googleLoginClientId;

try {
    headingJson = JSON.parse(headingJson);
    Template["heading"] = headingJson;
} catch(e) {}

try {
    afterLoginLinkJson = JSON.parse(afterLoginLinkJson);
    Template["link"] = afterLoginLinkJson;
} catch(e) {}

try {
    footerLinkJson = JSON.parse(footerLinkJson);
    Template["footerLinkJson"] = footerLinkJson;
} catch(e) {}

try {
    footerLinkJsonAfterLogin = JSON.parse(footerLinkJsonAfterLogin);
    Template["footerLinkJsonAfterLogin"] = footerLinkJsonAfterLogin;
} catch(e) {}

try {
    UserData = JSON.parse(loginUserDetails);
} catch(e) {}

var pages = {
    "login": basepathname+"/login",
    "logout": basepathname+"/logout",
    "register": basepathname+"/register",
    "change_password": basepathname+"/change_password",
    "forgot_password": basepathname+"/forgot_password",
    "create_password": basepathname+"/create_password",
    "login_other_user": basepathname+"/login_other_user",
    "users_control": basepathname+"/users_control",
    "permission_control": basepathname+"/permission_control",
    "compare_control": basepathname+"/compare_control",
    "api_role_mapping": basepathname+"/api_role_mapping",
    "database_files": basepathname+"/database_files"
};

Config.pages = pages;

Config.login_other_user = "login_other_user";
Config.users_control = "users_control";
Config.compare_control = "compare_control";
Config.permission_control = "permission_control";
Config.login = "login";
Config.logout = "logout";
Config.register = "register";
Config.change_password = "change_password";
Config.forgot_password = "forgot_password";
Config.create_password = "create_password";
Config.api_role_mapping = "api_role_mapping";
Config.database_files = "database_files";
Config.noMatch = "noMatch";
Config.authPages = [Config.login, Config.register, Config.forgot_password, Config.create_password];

var template;

if ($S.isString(createPasswordOtpInstruction) && createPasswordOtpInstruction.length > 0) {
    template = Template["create_password"];
    TemplateHelper.setTemplateAttr(template, "create_password.otp-instruction", "text", createPasswordOtpInstruction);
}

var tempPageData = $$$.pageData;
if ($S.isString(tempPageData)) {
    var i, dataArr;
    var strArr = tempPageData.split(",");
    for(i=0; i<strArr.length; i++) {
        dataArr = strArr[i].split("=");
        if (dataArr.length === 2) {
            PageData[dataArr[0]] = dataArr[1];
        }
    }
}
Config.UserData = UserData;
Config.PageData = PageData;

Config.defaultMetaData = {
    "apiRoleMapping.pattern": [
        {
            "tableName": "table1",
            "name": "api_name",
            "heading": "Api Name",
            "isSortable": true
        },
        {
            "tableName": "table1",
            "name": "role",
            "heading": "Role",
            "isSortable": true
        },
        {
            "tableName": "table1",
            "name": "source",
            "heading": "Source",
            "isSortable": true
        }
    ],
    "pageName:api_role_mapping.list1Data": [
        {
            "name": "Show All"
        },
        {
            "name": "Order by Role",
            "value": [{"key": "role"}]
        },
        {
            "name": "Order by Source",
            "value": [{"key": "source"}]
        },
        {
            "name": "Order by Api name",
            "value": [{"key": "api_name"}]
        },
        {
            "name": "Order by Role -- Source",
            "value": [{"key": "role"}, {"key": "source"}]
        },
        {
            "name": "Order by Source -- Role",
            "value": [{"key": "source"}, {"key": "role"}]
        }
    ],

    "pageName:api_role_mapping.filterKeyMapping": {
        "pageName:api_role_mapping.filterKeys": "filterKeys"
    },
    "pageName:api_role_mapping.filterKeys": ["api_name", "role", "source", "reset"],
    "userControlPattern": [
        {
            "tableName": "table1",
            "name": "username",
            "heading": "Username",
            "isSortable": true
        },
        {
            "tableName": "table1",
            "name": "valid",
            "heading": "Valid?",
            "isSortable": true
        },
        {
            "tableName": "table1",
            "name": "name",
            "heading": "Name",
            "isSortable": true
        },
        {
            "tableName": "table1",
            "name": "email",
            "heading": "Email",
            "isSortable": true
        },
        {
            "tableName": "table1",
            "name": "mobile",
            "heading": "Mobile",
            "isSortable": true
        },
        {
            "tableName": "table1",
            "name": "createPasswordOtp",
            "heading": "OTP",
            "isSortable": true
        },
        {
            "tableName": "table1",
            "heading": "Count",
            "name": "methodRequestCount",
            "fieldName": "methodRequestCount.value",
            "text": {
                "tag": "button",
                "name": "user_control.reset_count_button",
                "value": "table1.reset.button",
                "className": "btn btn-primary",
                "text": [
                    {
                        "tag": "span",
                        "name": "methodRequestCount.value",
                        "text": ""
                    },
                    {
                        "tag": "span",
                        "text": " "
                    },
                    {
                        "tag": "span",
                        "text": "Reset"
                    }
                ]
            },
            "isSortable": true
        },
        {
            "tableName": "table1",
            "name": "method",
            "heading": "Method",
            "isSortable": true
        }
    ],
    "pageName:database_files.list1Data": [
        {
            "name": "Show All"
        },
        {
            "name": "Order by File Username",
            "value": [{"key": "fileUsername"}]
        },
        {
            "name": "Order by Filename",
            "value": [{"key": "filename"}]
        },
        {
            "name": "Order by File Username -- Filename",
            "value": [{"key": "fileUsername"}, {"key": "filename"}]
        },
        {
            "name": "Order by Filename -- File Username",
            "value": [{"key": "filename"}, {"key": "fileUsername"}]
        }
    ],

    "pageName:database_files.filterKeyMapping": {
        "pageName:database_files.filterKeys": "filterKeys"
    },
    "pageName:database_files.filterKeys": ["fileUsername", "filename", "reset"],
    "database_files_info.pattern": [
        {
            "tableName": "table1",
            "name": "fileUsername",
            "heading": "File Username",
            "isSortable": true
        },
        {
            "tableName": "table1",
            "name": "filename",
            "heading": "Filename",
            "isSortable": true
        },
        {
            "tableName": "table1",
            "name": "filepath",
            "heading": "Filepath",
            "isSortable": true
        }
    ]
};

var apiMapping = {};

apiMapping["login"] = "/api/login_user";
apiMapping["login_other_user"] = "/api/login_other_user";
apiMapping["login_social"] = "/api/login_social";
apiMapping["register"] = "/api/register_user";
apiMapping["forgot_password"] = "/api/forgot_password";
apiMapping["create_password"] = "/api/create_password";
apiMapping["change_password"] = "/api/change_password";
apiMapping["reset_count"] = "/api/reset_count";
apiMapping["track_event"] = "/api/track_event";
apiMapping["getDatabaseFilesInfoApi"] = "/api/get_database_files_info";
apiMapping["getRolesConfig"] = "/api/get_roles_config";
apiMapping["api_role_mapping"] = "/api/get_api_role_mapping";


Config.setApiUrl = function(key, value) {
    if ($S.isStringV2(key) && $S.isStringV2(value)) {
        if (!$S.isStringV2(apiMapping[key])) {
            apiMapping[key] = value;
        }
    }
};

Config.getApiUrl = function(key, defaultValue, addBaseUrl) {
    if ($S.isString(apiMapping[key])) {
        if ($S.isBooleanTrue(addBaseUrl)) {
            return baseApi + apiMapping[key];
        } else {
            // used for redirect
            return apiMapping[key];
        }
    }
    return defaultValue;
};
Config.getPageData = function(key, defaultValue) {
    if ($S.isStringV2(key) && PageData[key]) {
        return PageData[key];
    }
    return defaultValue;
};
export default Config;
