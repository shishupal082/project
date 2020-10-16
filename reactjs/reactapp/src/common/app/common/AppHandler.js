import $S from '../../interface/stack.js';

var AppHandler;

(function($S){
AppHandler = function(arg) {
    return new AppHandler.fn.init(arg);
};

AppHandler.fn = AppHandler.prototype = {
    constructor: AppHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(AppHandler);
AppHandler.extend({
    getPageUrl: function(pageName) {
        return window.location.pathname;
    },
    send: function(trackingAction, eventCategory, eventLabel) {
        if (Config.gtag) {
            $S.pushGAEvent(Config.gtag, trackingAction, eventCategory, eventLabel);
        }
    }
});

})($S);

export default AppHandler;
