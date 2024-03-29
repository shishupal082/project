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
Config.uploadApiVersion = $$$.uploadApiVersion;

Config.defaultMetaData = {};

var pages = {
    "dashboard": basepathname+"/dashboard",
    "upload_file": basepathname+"/upload_file",
    "manage_text": basepathname+"/manage_text"
};

Config.pages = pages;

Config.dashboard = "dashboard";
Config.upload_file = "upload_file";
Config.manage_text = "manage_text";
Config.noMatch = "noMatch";

Config.dateSelectionRequired = [];

Config.defaultPageFields = [];

var apiMapping = {};
apiMapping["getStaticDataApi"] = "/api/get_static_data";
apiMapping["getLoginUserDetails"] = "/api/get_login_user_details";
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
