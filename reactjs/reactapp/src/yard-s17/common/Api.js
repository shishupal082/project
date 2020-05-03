import $S from '../../libs/stack.js';
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

Api.extend({
    loadJsonData: function(urls, eachApiCallback, callBack, apiName, ajaxApiCall) {
        if (!$S.isFunction(ajaxApiCall)) {
            ajaxApiCall = function(ajax, callBack) {
                fetch(ajax.url)
                    .then(res => res.json())
                    .then(
                        (result) => {
                            console.log(result);
                            callBack(ajax, "SUCCESS", result);
                        },
                        (error) => {
                            console.log(error);
                            callBack(ajax, "FAILURE", null);
                        }
                    );
            }
        }
        if ($S.isArray(urls) === false || urls.length < 1 || $S.isFunction(ajaxApiCall) === false) {
            if ($S.isFunction(eachApiCallback)) {
                eachApiCallback(null, apiName);
            }
            $S.callMethod(callBack);
            return false;
        }
        var apiSendCount = urls.length, apiReceiveCount = 0;
        for (var i = 0; i < urls.length; i++) {
            var ajax = {};
            ajax.type = "json";
            ajax.dataType = "json";
            ajax.url = urls[i];
            ajax.apiName = apiName;
            ajaxApiCall(ajax, function(ajaxDetails, status, response) {
                apiReceiveCount++;
                if (status === "FAILURE") {
                    $S.log("Error in api: " + ajaxDetails.url);
                }
                if ($S.isFunction(eachApiCallback)) {
                    eachApiCallback(response, ajax.apiName);
                }
                if (apiSendCount === apiReceiveCount) {
                    $S.callMethod(callBack);
                }
            });
        }
        return true;
    }
});

})();
export default Api;
