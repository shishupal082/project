import $$$ from '../interface/global';
import $S from "../interface/stack.js";
import DataHandler from "./DataHandler";


var GATracking;

(function($S){
var GaTrackingEnable = $$$.gaTrackingEnable;
var Gtag = $$$.gtag;

GATracking = function(trackingAction) {
    return new GATracking.fn.init(trackingAction);
};

GATracking.fn = GATracking.prototype = {
    constructor: GATracking,
    init: function(trackingAction) {
        this.trackingAction = trackingAction;
        return this;
    },
    send: function(eventCategory) {
        var trackingAction = this.trackingAction;
        var eventLabel = DataHandler.getUserAgentTrackingData();
        if (GaTrackingEnable) {
            $S.pushGAEvent(Gtag, trackingAction, eventCategory, eventLabel);
        }
    }
};
$S.extendObject(GATracking);

/**
redirect (do lazyRedirect on success)
    - login
    - register
    - create_password
    - change_password

redirect (do lazyRedirect on page redirect)
    - logout
    - login if required
    - dashboard if required

redirect on alert
    - forgot_password
    - upload_file
    - delete_file

click on view file or, loading dashboard data (get_files_info)
    - view_file
*/
GATracking.extend({
    // login. register, forgot_password, create_password
    trackResponse: function(event, response) {
        if (!$S.isObject(response)) {
            return;
        }
        var username = "empty-username";
        // It will fix problem of guest user login
        if ($S.isString(response.data)) {
            username = response.data;
        }
        var action = event + "_" + response.status;
        GATracking(action).send(username);
    },
    trackResponseAfterLogin: function(event, response) {
        if (!$S.isObject(response)) {
            return;
        }
        var username = DataHandler.getData("ui.username", "empty-username");
        var action = event + "_" + response.status;
        GATracking(action).send(username);
    }
});


})($S);

export default GATracking;
