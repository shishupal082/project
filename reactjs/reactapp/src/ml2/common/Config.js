import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

var Config = {};

Config.basepathname = $$$.basepathname;
Config.appVersion = $$$.appVersion;
Config.gtag = $$$.gtag;
Config.JQ = $$$.JQ;

var appControlDataApi = $$$.appControlDataApi;

var apiMapping = {};
apiMapping["app-control-data"] = appControlDataApi;
Config.getApiUrl = function(key, defaultValue, addBaseUrl) {
    if ($S.isString(apiMapping[key])) {
        if ($S.isBooleanTrue(addBaseUrl)) {
            return apiMapping[key];
        } else {
            return apiMapping[key];
        }
    }
    return defaultValue;
};

export default Config;
