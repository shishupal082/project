import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

var Config = {};

Config.baseapi = $$$.baseapi;
Config.basepathname = $$$.basepathname;
Config.appVersion = $$$.appVersion;
Config.gtag = $$$.gtag;
Config.JQ = $$$.JQ;
Config.patternMatching = $$$.patternMatching;

var appControlDataApi = $$$.appControlDataApi;

if (!$S.isObject(Config.patternMatching)) {
	Config.patternMatching = {};
}

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
