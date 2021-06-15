import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

import Template from "./Template";

var Config = {requestId: $S.getRequestId()};

Config.navigator = $$$.navigator;
var baseApi = $$$.baseApi;
var basepathname = $$$.basepathname;
var appVersion = $$$.appVersion;

Config.baseApi = baseApi;
Config.basepathname = basepathname;
Config.appVersion = appVersion;
Config.forceLogin = $$$.forceLogin;
Config.gtag = $$$.gtag;
Config.JQ = $$$.JQ;
Config.appControlDataPath = $$$.appControlDataPath;
Config.validAppControl = $$$.validAppControl;


Config.tempConfig = {
    "enabledPages": $$$.enabledPages,
    "redirectPages": $$$.redirectPages,
    "addFieldReport.addTextFilenamePattern": $$$.addTextFilenamePattern,
    "linkText": $$$.linkText
};


var loginUserDetailsApi = $$$.loginUserDetailsApi;
var relatedUsersDataApi = $$$.relatedUsersDataApi;
var headingJson = $$$.headingJson;
var appControlDataApi = $$$.appControlApi;


try {
    headingJson = JSON.parse(headingJson);
    Template["heading"][1].text = headingJson;
} catch(e) {}


var pages = {
    "home": basepathname+"/",
    "projectId": basepathname+"/pid/:pid",
    "projectStatusWork": basepathname+"/pid/:pid/work",
    "projectStatusSupply": basepathname+"/pid/:pid/supply"
};

Config.pages = pages;

Config.home = "home";
Config.noMatch = "noMatch";
Config.projectId = "projectId";
Config.projectStatusWork = "projectStatusWork";
Config.projectStatusSupply = "projectStatusSupply";


Config.defaultPageFields = [];

for(var key in pages) {
    if (key !== "home") {
        Config.defaultPageFields.push({"name": key, "toText": $S.capitalize(key), "toUrl": pages[key]});
    }
}

Config.defaultDateSelect = "monthly";

Config.fieldsKey = {
    "DateKey": "new-work-status.date",
    "DistanceKey": "new-work-status.distance",
    "RemarksKey": "new-work-status.remark",
    "SectionKey": "new-work-status.section",
    "ProjectNameKey": "new-project.name",
    "SupplyEntryDate": "new-supply.date",
    "SupplyEntryApprovedBy": "new-supply.approved-by",
    "SupplyEntryRemark": "new-supply.remark"
};

var apiMapping = {};
apiMapping["getLoginUserDetails"] = loginUserDetailsApi;
apiMapping["getRelatedUsersData"] = relatedUsersDataApi;
apiMapping["appControlData"] = appControlDataApi + "?v=" + appVersion;
apiMapping["dataPathApi"] = "/api/get_files_info_by_filename_pattern?";
apiMapping["addTextApi"] = "/api/add_text_v2";
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
