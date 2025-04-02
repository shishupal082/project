(function(window, $M) {

var Controller = function(pointNumber, position) {
    return new Controller.fn.init(pointNumber, position);
};
/*
Direct access by id: $C("id").get()
*/

function isFunction(value) {
    return typeof value == "function" ? true : false;
}
function isObject(value) {
    return (typeof value == "object" && isNaN(value.length)) ? true : false;
}
var pointMethod, pointMethods;
Controller.fn = Controller.prototype = {
    constructor: Controller,
    init: function(pointNumber, position) {
        if (!isNaN(pointNumber)) {
            this.pointNumber = pointNumber;
        }
        pointMethod = new pointMethods(this.pointNumber);
        return this;
    },
    //It will calculate value based on point position in site WNKR/WRKR
    set: function(position) {
        if (!isNaN(this.pointNumber)) {
            switch(position) {
                case "WNKR":
                case "WRKR":
                    pointMethod.setLocationPointPosition(position);
                break;
                case "NWKR":
                    pointMethod.setNWKR();
                break;
                case "RWKR":
                    pointMethod.setRWKR();
                break;
                case "NWLR":
                    pointMethod.setNWLR();
                break;
                case "RWLR":
                    pointMethod.setRWLR();
                break;
                default:
                break;
            }
        }
    }
};
Controller.fn.init.prototype = Controller.fn;
/*
End of direct access of ID
*/
/*Direct access of methods: $C.methodName*/
Controller.extend = Controller.fn.extend = function(options) {
    if (isObject(options)) {
        for (var key in options) {
            if (isFunction(options[key])) {
                /*If method already exist then it will be overwritten*/
                if (isFunction(this[key])) {
                    console.log("Method " + key + " is overwritten.");
                }
                this[key] = options[key];
            }
        }
    }
    return this;
};
Controller.extend({
    isMethodDefined: function(name) {
        return this.isFunction(this[name]);
    }
});

pointMethods = (function() {
    function Point(pNum) {
        this.pNum = pNum;
    }
    Point.prototype.setLocationPointPosition = function(pPos) {
        var pNum = this.pNum;
        var newValue = 0;
        if(pPos == "WNKR") {
            newValue = $M.isAllDown([pNum+"-RCR", pNum+"-WRKR"]) ? 1:0;
        } else if(pPos == "WRKR") {
            newValue = $M.isAllDown([pNum+"-NCR", pNum+"-WNKR"]) ? 1:0;
        }
        $M.setValue(pNum+"-"+pPos, newValue);
    };
    Point.prototype.setNWKR = function() {
        var pNum = this.pNum;
        var pPos = "NWKR";
        var newValue = 0;
        if ($M.isUp(pNum + "-WNKR") && $M.isDown(pNum + "-RWKR")) {
            if (($M.isDown(pNum + "-NWLR") && $M.isDown(pNum + "-RWLR")) || $M.isUp(pNum + "-NCR")) {
                newValue = 1;
            }
        }
        $M.setValue(pNum+"-"+pPos, newValue);
    };
    Point.prototype.setRWKR = function() {
        var pNum = this.pNum;
        var pPos = "RWKR";
        var newValue = 0;
        if ($M.isUp(pNum + "-WRKR") && $M.isDown(pNum + "-NWKR")) {
            if (($M.isAllDown([pNum+"-NWLR",pNum+"-RWLR"])) || $M.isUp(pNum + "-RCR")) {
                newValue = 1;
            }
        }
        $M.setValue(pNum+"-"+pPos, newValue);
    };
    Point.prototype.setNWLR = function(){
        var newValue = 0;
        var isPreTestPass = ($M.isDown(this.pNum+"-NLR") && 
                            $M.isDown("8-RLR") && ($M.isUp(this.pNum+"-NWKR-request")) ||
                            $M(this.pNum+"NWLR").isUp());
        if (isPreTestPass || $M.isUp("8-NLR")) {
            if ($M.isDown("8-NWKR") && $M.isDown("8-RWLR")) {
                newValue = 1;
            }
        }
        $M.setValue(this.pNum+"-NWLR", newValue);
    };
    Point.prototype.setRWLR = function(){
        var newValue = 0;
        var isPreTestPass = ($M.isDown(this.pNum+"-NLR") && 
                            $M.isDown("8-RLR") && ($M.isUp(this.pNum+"-RWKR-request")) ||
                            $M(this.pNum+"RWLR").isUp());
        if (isPreTestPass || $M.isUp("8-RLR")) {
            if ($M.isDown("8-RWKR") && $M.isDown("8-NWLR")) {
                newValue = 1;
            }
        }
        $M.setValue(this.pNum+"-RWLR", newValue);
    };
    return Point;
})();
/*End of direct access of methods*/
window.Controller = window.$PC = Controller;
})(window, $M);
