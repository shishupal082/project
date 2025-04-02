(function(window, $M, $IC, $PC) {
$M.extend({
    getTprClass: function(tprName, pointPosition) {
        if ($M(tprName).isDown()) {
            return "btn-danger";
        }
        return $IC(tprName + "-" + pointPosition).getTprClass();
    },
    isPointFree: function(pNum) {
        if (pNum == "8") {
            if ($M.isAllUp(["1-ASR", "13-ASR", "14/15-ASR"])) {
                return true;
            }
        } else if(pNum == "9") {
            if ($M.isAllUp(["1-ASR", "2/3-ASR", "13-ASR"])) {
                return true;
            }
        }
        return false;
    }
});
$M.extend({
    getNlrRlrValues: function(name) {
        var S1MT = $M.isUp("S1-MT-NRR") && $M.isDown("S1-MT-NNR");
        var S1LT = $M.isUp("S1-LT-NRR") && $M.isDown("S1-LT-NNR");
        var S2 = $M.isUp("S2-NRR") && $M.isDown("S2-NNR");
        var S3 = $M.isUp("S3-NRR") && $M.isDown("S3-NNR");
        var S4 = $M.isUp("S4-NRR") && $M.isDown("S4-NNR");
        var S13MT = $M.isUp("S13-MT-NRR") && $M.isDown("S13-MT-NNR");
        var S13LT = $M.isUp("S13-LT-NRR") && $M.isDown("S13-LT-NNR");
        var S14 = $M.isUp("S4-NRR") && $M.isDown("S4-NNR");
        var S15 = $M.isUp("S15-NRR") && $M.isDown("S15-NNR");
        var S16 = $M.isUp("S16-NRR") && $M.isDown("S16-NNR");

        NLR8 = (S1MT || S13MT || S13LT || S15) && $M.isDown("S1-LT-NRR") && $M.isDown("S14-NRR") && $M.isDown("8-NWKR") && $M.isDown("8-RLR");
        RLR8 = (S1LT || S14) && $M.isDown("S1-MT-NRR") && $M.isDown("S13-MT-NRR") && $M.isDown("S13-LT-NRR") && $M.isDown("S15-NRR") && $M.isDown("8-RWKR") && $M.isDown("8-NLR");
        NLR9 = (S1MT || S1LT || S3 || S13MT) && $M.isDown("S2-NRR") && $M.isDown("S13-LT-NRR") && $M.isDown("9-NWKR") && $M.isDown("9-RLR");
        RLR9 = (S13LT || S2) && $M.isDown("S1-MT-NRR") && $M.isDown("S1-LT-NRR") && $M.isDown("S13-MT-NRR")  && $M.isDown("S3-NRR") && $M.isDown("9-RWKR") && $M.isDown("9-NLR");

        var mappings = {"8-NLR": NLR8 ? 1 : 0, "8-RLR": RLR8 ? 1 : 0, "9-NLR": NLR9 ? 1 : 0, "9-RLR": RLR9 ? 1 : 0};

        return mappings[name];
    },
    "M-TPR": function() {
        var name = "M-TPR";
        var value = $M(name).get();
        $M.setValue(name + "-1", value);
        $M.setValue(name + "-2", value);
        $M.setValue(name + "-3", value);
        return 0;
    },
    "L-TPR": function() {
        var name = "L-TPR";
        var value = $M(name).get();
        $M.setValue(name + "-1", value);
        $M.setValue(name + "-2", value);
        $M.setValue(name + "-3", value);
        return 0;
    },
    "8-TPR": function() {
        var name = "8-TPR";
        if (this.isPointFree("8")) {
            if ($M("8-NWKR").isUp()) {
                $M.setValue("8-TPR-5", 1);
                // if ($M("8-TPR-1").isDown() || $M("8-TPR-2").isDown() || $M("8-TPR-3").isDown()) {
                //     $M.setValue("8-TPR-1", 0);
                //     $M.setValue("8-TPR-2", 0);
                //     $M.setValue("8-TPR-3", 0);
                // } else {
                //     $M.setValue("8-TPR-1", 1);
                //     $M.setValue("8-TPR-2", 1);
                //     $M.setValue("8-TPR-3", 1);
                // }
                // if ($M("8-TPR-7").isDown() || $M("8-TPR-8").isDown() || $M("8-TPR-9").isDown()) {
                //     $M.setValue("8-TPR-7", 0);
                //     $M.setValue("8-TPR-8", 0);
                //     $M.setValue("8-TPR-9", 0);
                // } else {
                //     $M.setValue("8-TPR-7", 1);
                //     $M.setValue("8-TPR-8", 1);
                //     $M.setValue("8-TPR-9", 1);
                // }
            }            
        }
        // if ($M("8-NWKR").isUp()) {
        //     $M.setValue("8-TPR-5", 1);
        //     if ($M("8-TPR-1").isDown() || $M("8-TPR-2").isDown() || $M("8-TPR-3").isDown()) {
        //         $M.setValue("8-TPR-1", 0);
        //         $M.setValue("8-TPR-2", 0);
        //         $M.setValue("8-TPR-3", 0);
        //     } else {
        //         $M.setValue("8-TPR-1", 1);
        //         $M.setValue("8-TPR-2", 1);
        //         $M.setValue("8-TPR-3", 1);
        //     }
        //     if ($M("8-TPR-7").isDown() || $M("8-TPR-8").isDown() || $M("8-TPR-9").isDown()) {
        //         $M.setValue("8-TPR-7", 0);
        //         $M.setValue("8-TPR-8", 0);
        //         $M.setValue("8-TPR-9", 0);
        //     } else {
        //         $M.setValue("8-TPR-7", 1);
        //         $M.setValue("8-TPR-8", 1);
        //         $M.setValue("8-TPR-9", 1);
        //     }
        // }
        // if ($M.isUp("8-RWKR")) {
        // }
    },
    "9A-TPR": function() {
        var name = "9A-TPR";
        // $M(name).set();
        if ($M("9-RWKR").isUp()) {
            // $M(name + "-1").set();
        }
        return 0;
    },
    "9B-TPR": function() {
        var name = "9B-TPR";
        // $M(name).set(1);
        if ($M("9-RWKR").isUp()) {
            // $M(name + "-1").set();
        }
        return 0;
    },
    "S1-MT-NNR": function() {
        var name = "S1-MT-NNR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.getValue("S1-MT-NRR") == 0) {
            if ($M(name).get() || $M.getValue("1-ASR")) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S1-LT-NNR": function() {
        var name = "S1-LT-NNR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.getValue("S1-LT-NRR") == 0) {
            if ($M(name).get() || $M.getValue("1-ASR")) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S2-NNR": function() {
        var name = "S2-NNR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.getValue("S2-NRR") == 0) {
            if ($M(name).get() || $M.getValue("2/3-ASR")) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S3-NNR": function() {
        var name = "S3-NNR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.getValue("S3-NRR") == 0) {
            if ($M(name).get() || $M.getValue("2/3-ASR")) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    }, 
    "S4-NNR": function() {
        var name = "S4-NNR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.getValue("S4-NRR") == 0) {
            if ($M(name).get() || $M.getValue("4-ASR")) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S13-MT-NNR": function() {
        var name = "S13-MT-NNR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.getValue("S13-MT-NRR") == 0) {
            if ($M(name).get() || $M.getValue("13-ASR")) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S13-LT-NNR": function() {
        var name = "S13-LT-NNR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.getValue("S13-LT-NRR") == 0) {
            if ($M(name).get() || $M.getValue("13-ASR")) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S14-NNR": function() {
        var name = "S14-NNR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.getValue("S14-NRR") == 0) {
            if ($M(name).get() || $M.getValue("14/15-ASR")) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S15-NNR": function() {
        var name = "S15-NNR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.getValue("S15-NRR") == 0) {
            if ($M(name).get() || $M.getValue("14/15-ASR")) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S16-NNR": function() {
        var name = "S16-NNR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.getValue("S16-NRR") == 0) {
            if ($M(name).get() || $M.getValue("16-ASR")) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S1-MT-NRR": function() {
        var name = "S1-MT-NRR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.isAllUp(["S13-MT-NNR", "S13-LT-NNR", "S14-NNR", "S15-NNR", "S16-NNR", "S2-NNR", "S1-LT-NNR"])) {
            if ($M.isAllUp(["S1-GNR", "MT-UNR", "1-ASR"]) || $M(name).isUp()) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S1-LT-NRR": function() {
        var name = "S1-LT-NRR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.isAllUp(["S13-MT-NNR", "S13-LT-NNR", "S14-NNR", "S15-NNR", "S16-NNR", "S1-MT-NNR"])) {
            if ($M.isAllUp(["S1-GNR", "LT-UNR", "1-ASR"]) || $M(name).isUp()) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S2-NRR": function() {
        var name = "S2-NRR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.isAllUp(["S13-MT-NNR", "S13-LT-NNR", "S14-NNR", "S3-NNR", "S1-MT-NNR"])) {
            if ($M.isAllUp(["S2-GNR", "9-UNR", "2/3-ASR"]) || $M(name).isUp()) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S3-NRR": function() {
        var name = "S3-NRR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.isAllUp(["S13-MT-NNR", "S13-LT-NNR", "S15-NNR", "S2-NNR"])) {
            if ($M.isAllUp(["S3-GNR", "9-UNR", "2/3-ASR"]) || $M(name).isUp()) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S4-NRR": function() {
        var name = "S4-NRR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.isAllUp(["S13-MT-NNR", "S13-LT-NNR"])) {
            if ($M.isAllUp(["S4-GNR", "4-UNR", "4-ASR"]) || $M(name).isUp()) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S13-MT-NRR": function() {
        var name = "S13-MT-NRR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.isAllUp(["S1-MT-NNR", "S1-LT-NNR", "S2-NNR", "S3-NNR", "S4-NNR", "S13-LT-NNR"])) {
            if ($M.isAllUp(["S13-GNR", "MT-UNR", "13-ASR"]) || $M(name).isUp()) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S13-LT-NRR": function() {
        var name = "S13-LT-NRR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.isAllUp(["S1-MT-NNR", "S1-LT-NNR", "S2-NNR", "S3-NNR", "S4-NNR", "S13-MT-NNR"])) {
            if ($M.isAllUp(["S13-GNR", "LT-UNR", "13-ASR"]) || $M(name).isUp()) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S14-NRR": function() {
        var name = "S14-NRR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.isAllUp(["S1-MT-NNR", "S1-LT-NNR", "S15-NNR", "S2-NNR", "S13-MT-NNR"])) {
            if ($M.isAllUp(["S14-GNR", "8-UNR", "14/15-ASR"]) || $M(name).isUp()) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S15-NRR": function() {
        var name = "S15-NRR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.isAllUp(["S1-MT-NNR", "S1-LT-NNR", "S14-NNR", "S3-NNR"])) {
            if ($M.isAllUp(["S15-GNR", "8-UNR", "14/15-ASR"]) || $M(name).isUp()) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "S16-NRR": function() {
        var name = "S16-NRR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.isAllUp(["S1-MT-NNR", "S1-LT-NNR"])) {
            if ($M.isAllUp(["S16-GNR", "16-UNR", "16-ASR"]) || $M(name).isUp()) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "1-ASR": function() {
        var name = "1-ASR";
    },
    "1/16-TSR": function() {
        var name = "1/16-TSR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.isAllUp(["1-TPR", "16-TPR"])) {
            if ($M(name).get() < 1) {
                if ($M.isAllUp(["S1-MT-NNR", "S1-LT-NNR", "S16-NNR"])) {
                    newValue = 1;
                }
            } else {
                newValue = oldValue;
            }
        }
        $M.setValue(name, newValue);
        return newValue;
    },
    "2/3-TSR": function() {
        var name = "2/3-TSR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.getValue("9B-TPR")) {
            if ($M.getValue("9A-TPR") || $M.getValue("9-NWKR")) {
                if ($M(name).get() < 1) {
                    if ($M.isAllUp(["S2-NNR", "S3-NNR"])) {
                        newValue = 1;
                    }
                } else {
                    newValue = oldValue;
                }
            }
        }
        $M.setValue(name, newValue);
        return newValue;
    },
    "4/13-TSR": function() {
        var name = "4/13-TSR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.isAllUp(["4-TPR", "13-TPR"])) {
            if ($M(name).get() == 0) {
                if ($M.isAllUp(["S4-NNR", "S13-MT-NNR", "S13-LT-NNR"])) {
                    newValue = 1;
                }
            } else {
                newValue = oldValue;
            }
        }
        $M.setValue(name, newValue);
        return newValue;
    },
    "14/15-TSR": function() {
        var name = "14/15-TSR";
        var oldValue = $M(name).get();
        var newValue = 0;
        if ($M.getValue("8B-TPR")) {
            if ($M.getValue("8A-TPR") || $M.getValue("8-NWKR")) {
                if ($M(name).get() == 0) {
                    if ($M.isAllUp(["S14-NNR", "S15-NNR"])) {
                        newValue = 1;
                    }
                } else {
                    newValue = oldValue;
                }
            }
        }
        $M.setValue(name, newValue);
        return newValue;
    },
    "S1-UCR": function() {
        var name = "S1-UCR";
        var newValue = 0;
        if (this.isAllUp(["16-ASR", "14/15-ASR", "13-ASR"])) {
            if (this.isAllUp(["S1-MT-NRR", "8-NWKR", "9-NWKR"])) {
                newValue = 1;
            } else if (this.isAllUp(["S1-LT-NRR", "8-RWKR", "9-NWKR"])) {
                newValue = 1;
            }
        }
        this.setValue(name, newValue);
        return newValue;
    },
    "S1-HR": function() {
        var name = "S1-HR";
        var newValue = 0;
        if (this.isAllUp(["S1-UCR", "1/16-TSR", "16-ASR", "14/15-ASR", "13-ASR"])) {
            if (this.isAllUp(["1-TPR", "16-TPR", "8-TPR", "8-TPR-C", "8-TPR-7"])) {
                if (this.isAllUp(["8-NWKR", "9-NWKR", "8-TPR-8", "8-TPR-9", "M-TPR"])) {
                    newValue = 1;
                }
                if (this.isAllUp(["8-RWKR", "9-NWKR", "8-TPR-5", "8-TPR-3", "L-TPR"])) {
                    newValue = 1;
                }
            }
        }
        this.setValue(name, newValue);
        return newValue;
    },
    "S1-DR": function() {
        var name = "S1-DR";
        var newValue = this.isAllUp(["S1-HR", "S3-DR"]) ? 1:0;
        this.setValue(name, newValue);
        return newValue;
    },
    "8-WNKR": function() {
        $PC("8").set("WNKR");
    },
    "8-WRKR": function() {
        $PC("8").set("WRKR");
    },
    "8-NWKR": function() {
        $PC("8").set("NWKR");
    },
    "8-RWKR": function() {
        $PC("8").set("RWKR");
    },
    "9-NWKR": function() {
        $PC("9").set("NWKR");
    },
    "9-RWKR": function() {
        $PC("9").set("RWKR");
    },
    "8-NWLR": function() {
        $PC("8").set("NWLR");
    },
    "8-RWLR": function() {
        $PC("8").set("RWLR");
    },
    "9-NWLR": function() {
        var name = "9-NWLR";
        var newValue = 0;
        var isPreTestPass = $M.isDown("9-NLR") && $M.isDown("9-RLR") && ($M.isUp("9-NWKR-request") || $M(name).isUp());
        if (isPreTestPass || $M.isUp("9-NLR")) {
            if ($M.isDown("9-NWKR") && $M.isDown("9-RWLR")) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "9-RWLR": function() {
        var name = "9-RWLR";
        var newValue = 0;
        var isPreTestPass = $M.isDown("9-NLR") && $M.isDown("9-RLR") && ($M.isUp("9-RWKR-request") || $M(name).isUp());
        if (isPreTestPass || $M.isUp("9-RLR")) {
            if ($M.isDown("9-RWKR") && $M.isDown("9-NWLR")) {
                newValue = 1;
            }
        }
        $M.setValue(name, newValue);
    },
    "8-NCR": function() {
        var name = "8-NCR";
        var newValue = 0;
        if ($M.isUp("8-NWKR-request") || $M.isUp("8-ASWR") || $M(name).isUp()) {
            if ($M.isDown("8-RWLR") && $M.isDown("8-RCR")) {
                if ($M.isUp("8-NWLR") || $M(name).isUp()) {
                    newValue = 1;
                }
            }
        }
        $M.setValue(name, newValue);
    },
    "8-RCR": function() {
        var name = "8-RCR";
        var newValue = 0;
        if ($M.isUp("8-RWKR-request") || $M.isUp("8-ASWR") || $M(name).isUp()) {
            if ($M.isDown("8-NWLR") && $M.isDown("8-NCR")) {
                if ($M.isUp("8-RWLR") || $M(name).isUp()) {
                    newValue = 1;
                }
            }
        }
        $M.setValue(name, newValue);
    },
    "9-NCR": function() {
        var name = "9-NCR";
        var newValue = 0;
        if ($M.isUp("9-NWKR-request") || $M.isUp("9-ASWR") || $M(name).isUp()) {
            if ($M.isDown("9-RWLR") && $M.isDown("9-RCR")) {
                if ($M.isUp("9-NWLR") || $M(name).isUp()) {
                    newValue = 1;
                }
            }
        }
        $M.setValue(name, newValue);
    },
    "9-RCR": function() {
        var name = "9-RCR";
        var newValue = 0;
        if ($M.isUp("9-RWKR-request") || $M.isUp("9-ASWR") || $M(name).isUp()) {
            if ($M.isDown("9-NWLR") && $M.isDown("9-NCR")) {
                if ($M.isUp("9-RWLR") || $M(name).isUp()) {
                    newValue = 1;
                }
            }
        }
        $M.setValue(name, newValue);
    },
    "8-NLR": function() {
        var name = "8-NLR";
        $M.setValue(name, this.getNlrRlrValues(name));
    },
    "8-RLR": function() {
        var name = "8-RLR";
        $M.setValue(name, this.getNlrRlrValues(name));
    },
    "9-NLR": function() {
        var name = "9-NLR";
        $M.setValue(name, this.getNlrRlrValues(name));
    },
    "9-RLR": function() {
        var name = "9-RLR";
        $M.setValue(name, this.getNlrRlrValues(name));
    },
    "8-ASWR": function() {
        var name = "8-ASWR";
        var newValue = 0;
        if ($M.isUp("8-NLR") && $M.isUp("8-NWLR") && $M.isDown("8-NCR")) {
            newValue = 1;
        } else if ($M.isUp("8-RLR") && $M.isUp("8-RWLR") && $M.isDown("8-RCR")) {
            newValue = 1;
        }
        $M.setValue(name, newValue);
    },
    "9-ASWR": function() {
        var name = "9-ASWR";
        var newValue = 0;
        if ($M.isUp("9-NLR") && $M.isUp("9-NWLR") && $M.isDown("9-NCR")) {
            newValue = 1;
        } else if ($M.isUp("9-RLR") && $M.isUp("9-RWLR") && $M.isDown("9-RCR")) {
            newValue = 1;
        }
        $M.setValue(name, newValue);
    }
});
})(window, $M, $IC, $PC);