import $S from "../../interface/stack.js";

var FtpApi;

(function($S){
var Api = function(arg) {
    return new Api.fn.init(arg);
};

Api.fn = Api.prototype = {
    constructor: Api,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(Api);

FtpApi = Api;
})($S);

export default FtpApi;