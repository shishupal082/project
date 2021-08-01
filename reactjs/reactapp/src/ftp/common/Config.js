import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

var RequestId = $S.getRequestId();

var Config = {"name": "Config", "imgExt": ["jpg", "jpeg", "png"]};

var baseApi = $$$.baseApi;
var basepathname = $$$.basepathname;

Config.baseApi = baseApi;
Config.basepathname = basepathname;
Config.forceLogin = $$$.forceLogin;
Config.appVersion = $$$.appVersion;
Config.gtag = $$$.gtag;
Config.JQ = $$$.JQ;
Config.disabledPages = $$$.disabledPages;
Config.navigator = $$$.navigator;
Config.permissionMonitoringList = $$$.permissionMonitoringList;
Config.userControlPattern = [
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
        "name": "methodRequestCount",
        "heading": "Count",
        "isSortable": true
    },
    {
        "tableName": "table1",
        "name": "method",
        "heading": "Method",
        "isSortable": true
    }
];



var staticDataApi = $$$.staticDataApi;
var loginUserDetailsApi = $$$.loginUserDetailsApi;
var relatedUsersDataApi = $$$.relatedUsersDataApi;
var rolesConfigDataApi = $$$.rolesConfigDataApi;

var pages = {
    "dashboard": basepathname+"/dashboard",
    "upload_file": basepathname+"/upload_file",
    "users_control": basepathname+"/users_control",
    "permission_control": basepathname+"/permission_control"
};

Config.pages = pages;

Config.dashboard = "dashboard";
Config.upload_file = "upload_file";
Config.users_control = "users_control";
Config.permission_control = "permission_control";
Config.noMatch = "noMatch";

Config.dateSelectionRequired = [];

Config.defaultPageFields = [];

var apiMapping = {};
apiMapping["getStaticDataApi"] = staticDataApi;
apiMapping["getLoginUserDetails"] = loginUserDetailsApi;
apiMapping["getRelatedUsersData"] = relatedUsersDataApi;
apiMapping["getRolesConfig"] = rolesConfigDataApi;
apiMapping["upload_file"] = "/api/upload_file";
apiMapping["delete_file"] = "/api/delete_file";
apiMapping["track_event"] = "/api/track_event";
apiMapping["get_files"] = "/api/get_files_info?v=" + RequestId;
apiMapping["loginRedirectUrl"] = "/login";

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
export default Config;
