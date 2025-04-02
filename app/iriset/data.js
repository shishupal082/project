var Data = (function() {
    function Data() {
        this.possibleValues = $M.getPossibleValues();
        this.currentValues = $M.getCurrentValues();;
        this.availableGNRs = $M.getParameters("availableGNRs");
        this.availableUNRs = $M.getParameters("availableUNRs");
        this.availableNNRs = $M.getParameters("availableNNRs");
        this.availableNRRs = $M.getParameters("availableNRRs");
        this.availableASRs = $M.getParameters("availableASRs");
        this.availableTSRs = $M.getParameters("availableTSRs");
        this.availableTPRs = $M.getParameters("availableTPRs");
        this.point8Info = $M.getParameters("point8Info");
        this.point9Info = $M.getParameters("point9Info");
        this.miscs = $M.getParameters("miscs");
        this.count = 0;
        this.logLineCount = 0;
        var self = this;
        $M.reCheckAllValues();
    };
    Data.prototype.setValues = function(name, value) {
        $M.setValue(name, value);
        return $M(name).get();
    };
    Data.prototype.auditValuesPoint8 = function() {
        var point8Info = this.point8Info;
        var response = {};
        for (var i = 0; i < point8Info.length; i++) {
            response[point8Info[i]] = $M(point8Info[i]).get();
        }
        return response;
    };
    Data.prototype.getLogLineCount = function () {
        return this.logLineCount++;
    };
    Data.prototype.isPointFree = function (pNum) {
        //Temprory: If any NRR is up, manual point operation not permitted
        //Finally it should be controlled by ASR, If TSR up 
        return $M.isPointFree(pNum);
    };
    Data.prototype.isTPRLocked = function(key) {
        if (key == "16-TPR") {
            return true;
        }
        return false;
    };
    Data.prototype.getTprClass = function(name) {
        var modelNode = $M(name);
        var tprClass = "";
        var pointNumber = $M.getPointNumberForTpr(name);
        var pointPosition = "";
        if ($M.isValidKey(pointNumber + "-NWKR")) {
            if($M(pointNumber + "-NWKR").isUp()) {
                pointPosition = pointNumber + "-NWKR";
            } else if ($M(pointNumber + "-RWKR").isUp()) {
                pointPosition = pointNumber + "-RWKR";
            }
        } else if($M(name).isDown()) {//For tpr
            return "btn-danger";
        } else {
            return "";
        }
        return $M.getTprClass(name, pointPosition);
    };
    return Data;
})();