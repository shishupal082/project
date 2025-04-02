var SETVALUESMTHODS = {
            "LT-UNR": function(value) {
                this.name = "LT-UNR";
                if (self._isValidValue(this.name, value)) {
                    self.currentValues[this.name] = value * 1;
                }
                var setValuesMethods = this;
                var name = this.name;
                setTimeout(function(){
                    self.setValues(name, 0);
                }, 5000);
            },
            "MT-UNR": function(value) {
                this.name = "MT-UNR";
                if (self._isValidValue(this.name, value)) {
                    self.currentValues[this.name] = value * 1;
                }
                var setValuesMethods = this;
                var name = this.name;
                setTimeout(function(){
                    self.setValues(name, 0);
                }, 5000);
            },
            "8-UNR": function(value) {
                this.name = "8-UNR";
                if (self._isValidValue(this.name, value)) {
                    self.currentValues[this.name] = value * 1;
                }
                var name = this.name;
                setTimeout(function(){
                    self.setValues(name, 0);
                }, 5000);
            },
            "9-UNR": function(value) {
                this.name = "9-UNR";
                if (self._isValidValue(this.name, value)) {
                    self.currentValues[this.name] = value * 1;
                }
                var name = this.name;
                setTimeout(function(){
                    self.setValues(name, 0);
                }, 5000);
            },
            "4-UNR": function(value) {
                this.name = "4-UNR";
                if (self._isValidValue(this.name, value)) {
                    self.currentValues[this.name] = value * 1;
                }
                var name = this.name;
                setTimeout(function(){
                    self.setValues(name, 0);
                }, 5000);
            },
            "16-UNR": function(value) {
                this.name = "16-UNR";
                if (self._isValidValue(this.name, value)) {
                    self.currentValues[this.name] = value * 1;
                }
                var setValuesMethods = this;
                var name = this.name;
                setTimeout(function(){
                    self.setValues(name, 0);
                }, 5000);
            },
            "1-TPR": function(value) {
                this.name = "1-TPR";
                if ([0,1].indexOf(value) >= 0) {
                    self.currentValues[this.name] = value;
                }
            },
            "16-TPR": function(value) {
                this.name = "16-TPR";
                if ([0,1].indexOf(value) >= 0) {
                    self.currentValues[this.name] = value;
                }
            },
            "8B-TPR": function(value) {
                this.name = "8B-TPR";
                if ([0,1].indexOf(value) >= 0) {
                    self.currentValues[this.name] = value;
                }
            },
            "8A-TPR": function(value) {
                this.name = "8A-TPR";
                if ([0,1].indexOf(value) >= 0) {
                    self.currentValues[this.name] = value;
                }
            },
            "M-TPR": function(value) {
                this.name = "M-TPR";
                if ([0,1].indexOf(value) >= 0) {
                    self.currentValues[this.name] = value;
                }
            },
            "L-TPR": function(value) {
                this.name = "L-TPR";
                if ([0,1].indexOf(value) >= 0) {
                    self.currentValues[this.name] = value;
                }
            },
            "9A-TPR": function(value) {
                this.name = "19A-TPR";
                if ([0,1].indexOf(value) >= 0) {
                    self.currentValues[this.name] = value;
                }
            },
            "9B-TPR": function(value) {
                this.name = "19B-TPR";
                if ([0,1].indexOf(value) >= 0) {
                    self.currentValues[this.name] = value;
                }
            },
            "4-TPR": function(value) {
                this.name = "4-TPR";
                if ([0,1].indexOf(value) >= 0) {
                    self.currentValues[this.name] = value;
                }
            },
            "13-TPR": function(value) {
                this.name = "13-TPR";
                if ([0,1].indexOf(value) >= 0) {
                    self.currentValues[this.name] = value;
                }
            },
            "1-ASR": function() {
                this.name = "1-ASR";
            },
            "1/16-TSR": function() {
                this.name = "1/16-TSR";
                var oldValue = self.getStatus(this.name);
                var currentValue = oldValue;
                if (self._getValues(["1-TPR", "16-TPR"])) {
                    if (self.getStatus(this.name) < 1) {
                        if (self._getValues(["S1-MT-NNR", "S1-LT-NNR", "S16-NNR"])) {
                            currentValue = 1;
                        }
                    }
                }
                self.currentValues[this.name] = currentValue;
                return currentValue;
            },
            "2/3-TSR": function() {
                this.name = "2/3-TSR";
                var oldValue = self.getStatus(this.name);
                var currentValue = oldValue;
                if (self.getValues("9B-TPR")) {
                    if (self.getStatus("9A-TPR") || self.getStatus("9-NWKR")) {
                        if (self.getStatus(this.name) < 1)
                        if (self._getValues(["S2-NNR", "S3-NNR"])) {
                            currentValue = 1;
                        }
                    }
                }
                self.currentValues[this.name] = currentValue;
                return currentValue;
            }
        };