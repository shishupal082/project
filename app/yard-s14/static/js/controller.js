(function(window, $M, $YM) {

var Controller = function(selector, context) {
    return new Controller.fn.init(selector, context);
};
/*
Direct access by id: $C("id").get()
*/

Controller.fn = Controller.prototype = {
    constructor: Controller,
    init: function(selector, context) {
        if (typeof selector === "string") {
            this.signalNum = selector;
        }
        if (selector === "string" && context === "signal") {
            this.signalNum = selector;
        }
        return this;
    }
};

ExtendObject(Controller);

var possibleValues = [];
var requestId = $M.getRequestId();

Controller.extend({
    getPossibleValues: function() {
        return $M.getPossibleValues();
    },
    toggleValues: function(name) {
        $M.toggleValue(name);
        return 0;
    },
    documentLoaded: function(callBack) {
        var url = ["/app/yard-s14/static/json/items.json?"+requestId];
        $YM.loadJsonData(url, function(response) {
            if ($M.isObject(response)) {
                for (var key in response) {
                    if ($M.isArray(response[key])) {
                        for (var i = 0; i < response[key].length; i++) {
                            if ($M.isString(response[key][i])) {
                                if (possibleValues.indexOf(response[key][i]) >= 0) {
                                    throw "Duplicate entry possibleValues: " + response[key][i];
                                } else {
                                    possibleValues.push(response.tpr[i]);
                                }
                            }
                        }
                    }
                }
            }
        }, function() {
            $M().setPossibleValues(possibleValues);
            callBack();
        });
    }
});
Controller.extend({
    getTableHtml: function() {
    },
    getTprClass: function(tprName) {
    }
});

/*End of direct access of methods*/
window.Controller = window.$C = Controller;
})(window, $M, $YM);
