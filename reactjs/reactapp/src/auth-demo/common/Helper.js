import $S from '../../interface/stack.js';

var Helper;

(function($S) {
Helper = function(config) {
    return new Helper.fn.init(config);
};
Helper.fn = Helper.prototype = {
    constructor: Helper,
    init: function(config) {
        this.config = config;
        return this;
    }
};

$S.extendObject(Helper);

Helper.extend({
    isLogin: function(loginSuccessCallback, callback) {
        setTimeout(function() {
            loginSuccessCallback(null, callback);
        }, 100);
    }
});
})($S);
export default Helper;
