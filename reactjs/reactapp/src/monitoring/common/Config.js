import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

var Config = {};

var basepathname = $$$.basepathname;

Config.baseapi = $$$.baseapi;
var appControlApi = $$$.appControlApi;

if (!$S.isArray(appControlApi)) {
    appControlApi = [];
}
Config.appControlApi = appControlApi.map(function(el, i, arr) {
    return Config.baseapi + el;
});


var pages = {
    "home": basepathname+"/",
    "entry": basepathname+"/entry",
    "entrybydate": basepathname+"/entrybydate",
    "entrybytype": basepathname+"/entrybytype",
    "entrybystation": basepathname+"/entrybystation",
    "entrybydevice": basepathname+"/entrybydevice",
    "summary": basepathname+"/summary"
};

Config.pages = pages;


export default Config;
