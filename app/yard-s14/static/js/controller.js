(function(window, $S, $M, $YM) {


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
Controller.extend({
    getPossibleValues: function() {
        return $M.getPossibleValues();
    },
    toggleValues: function(name) {
        $M.toggleValue(name);
        return 0;
    },
    documentLoaded: function(callBack) {
        var url = ["/app/yard-s14/static/json/items.json?"+$S.getUniqueNumber()];
        $YM.loadJsonData(url, function(response) {
            if (response && response.tpr) {
                if ($M.isArray(response.tpr)) {
                    for (var i = 0; i < response.tpr.length; i++) {
                        if (possibleValues.indexOf(response.tpr[i]) >= 0) {
                            throw "Duplicate entry possibleValues: " + response.tpr[i];
                        } else {
                            possibleValues.push(response.tpr[i]);
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
})(window, $S, $M, $YM);
