import $$$ from '../../../interface/global';
import $S from "../../../interface/stack.js";

var CommonConfig = {requestId: $S.getRequestId()};

CommonConfig.navigator = $$$.navigator;
CommonConfig.gtag = $$$.gtag;
CommonConfig.JQ = $$$.JQ;
CommonConfig.forceLogin = $$$.forceLogin;
CommonConfig.appControlDataPath = $$$.appControlDataPath;
CommonConfig.validAppControl = $$$.validAppControl;
CommonConfig.addBasepathLinkName = $$$.addBasepathLinkName;



var baseApi = $$$.baseApi;
var basepathname = $$$.basepathname;
var appVersion = $$$.appVersion;



CommonConfig.baseApi = baseApi;
CommonConfig.basepathname = basepathname;
CommonConfig.appVersion = appVersion;


var appControlApi = $$$.appControlApi;




CommonConfig.dateSelection = [
    {"name": "Daily", "value": "daily"},
    {"name": "Monthly", "value": "monthly"},
    {"name": "Yearly", "value": "yearly"},
    {"name": "All", "value": "all"}
];
CommonConfig.defaultDateSelect = "monthly";
CommonConfig.dateSelectionRequiredPages = [];

CommonConfig.IN_PROGRESS = "in_progress";
CommonConfig.COMPLETED = "completed";

var apiMapping = {};
apiMapping["getAppControlApi"] = appControlApi + "?v=" + appVersion;
apiMapping["getStaticDataApi"] = "/api/get_static_data";
apiMapping["getLoginUserDetailsApi"] = "/api/get_login_user_details";
apiMapping["getRelatedUsersDataApi"] = "/api/get_related_users_data";
apiMapping["getRelatedUsersDataV2Api"] = "/api/get_related_users_data_v2";
apiMapping["getFilesInfoApi"] = "/api/get_files_info";
apiMapping["getAddTextApi"] = "/api/add_text";
apiMapping["getAddTextApiV2"] = "/api/add_text_v2";
apiMapping["getTableData"] = "/api/get_table_data";
apiMapping["upload_file"] = "/api/upload_file";
apiMapping["delete_file"] = "/api/delete_file";
apiMapping["deleteText"] = "/api/delete_text";
apiMapping["loginRedirectUrl"] = "/login";
CommonConfig.getApiUrl = function(key, defaultValue, addBaseUrl) {
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

export default CommonConfig;
