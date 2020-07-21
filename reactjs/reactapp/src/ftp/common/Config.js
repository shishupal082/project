import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

var Config = {"name": "Config"};
var PageData = {};
var baseapi = $$$.baseapi;
var basepathname = $$$.basepathname;


Config.JQ = $$$.JQ;
Config.location = $$$.location;
Config.baseapi = baseapi;
Config.basepathname = basepathname;

var currentPageData = $$$.currentPageData;
if ($S.isString(currentPageData)) {
    var i, dataArr;
    var strArr = currentPageData.split(",");
    for(i=0; i<strArr.length; i++) {
        dataArr = strArr[i].split("=");
        if (dataArr.length === 2) {
            PageData[dataArr[0]] = dataArr[1];
        }
    }
}

if ($S.isBooleanTrue($$$.isReactEnv)) {
    var hrefPath = $S.getUrlAttribute(Config.location.href, "hrefPath", "");
    var hrefPathMapping = {};
    hrefPathMapping[basepathname + "/dashboard"] = "dashboard";
    hrefPathMapping[basepathname + "/login"] = "login";
    hrefPathMapping[basepathname + "/logout"] = "logout";
    hrefPathMapping[basepathname + "/forgot_password"] = "forgot_password";
    hrefPathMapping[basepathname + "/upload_file"] = "upload_file";
    hrefPathMapping[basepathname + "/change_password"] = "change_password";

    var origin = Config.location.origin;
    var hrefPathArr = hrefPath.split(origin);

    if (hrefPathArr.length === 2) {
        hrefPath = hrefPathArr[1];
    }
    if ($S.isString(hrefPathMapping[hrefPath])) {
        PageData["page"] = hrefPathMapping[hrefPath];
    }
}

Config.getPageData = function(key, defaultValue) {
    if ($S.isString(PageData[key])) {
        return PageData[key];
    }
    return defaultValue;
};

var RequestId = $S.getRequestId();
Config.apiMapping = {};
Config.apiMapping["login"] = baseapi + "/api/login_user";
Config.apiMapping["change_password"] = baseapi + "/api/change_password";
Config.apiMapping["upload_file"] = baseapi + "/api/upload_file";
Config.apiMapping["get_files"] = baseapi + "/api/get_files_info?" + RequestId;
Config.apiMapping["static_file"] = baseapi + "/api/get_static_file?" + RequestId;

Config.getAleartMessage = function(messageCode) {
    var messageMap = {};
    messageMap["UNSUPPORTED_FILE_TYPE"] = "Uploaded file type not supported.";
    messageMap["FILE_SIZE_EXCEEDED"] = "Uploaded file size exceed 2MB.";
    if ($S.isString(messageMap[messageCode])) {
        return messageMap[messageCode];
    }
    return messageCode;
};


export default Config;
