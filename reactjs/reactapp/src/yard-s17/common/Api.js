import $S from '../../interface/stack.js';
var Api;
(function() {
Api = function(config) {
    return new Api.fn.init(config);
};
Api.fn = Api.prototype = {
    constructor: Api,
    init: function(config) {
        this.config = config;
        return this;
    }
};

$S.extendObject(Api);
var ajaxApiCall = function(ajax, callBack) {
        fetch(ajax.url)
            .then(res => res.json())
            .then(
                (result) => {
                    // console.log(result);
                    if ($S.isFunction(callBack)) {
                        callBack(ajax, "SUCCESS", result);
                    }
                },
                (error) => {
                    // console.log(error);
                    if ($S.isFunction(callBack)) {
                        callBack(ajax, "FAILURE", null);
                    }
                }
            );
};
Api.extend({
    getAjaxApiCallMethod: function() {
        return ajaxApiCall;
    }
});

})();
export default Api;
