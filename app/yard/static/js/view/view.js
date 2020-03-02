(function(window, $VC){
var relatedKeys = {
    "S1": ["S1-GNR", "S1-UYR1", "S1-MT-NNR", "S1-MT-NRR", "S1-LT-NNR", "S1-LT-NRR",
            "1-ASR", "1/16-TSR", "S1-UCR", "S1-HR", "S1-DR", "S1-UGR"],
    "Point-8": ["8-WNR", "8-NWKR", "8-RWKR", "8-WNKR", "8-WRKR", "8-NCR", "8-RCR",
                "8-NWLR", "8-RWLR", "8-NLR", "8-RLR", "8-ASWR"]
};
function isFunction(value) {
    return typeof value == "function" ? true : false;
}
function isObject(value) {
    return (typeof value == "object" && isNaN(value.length)) ? true : false;
}
var View = function(selector, context) {
    return new View.fn.init(selector, context);
};
View.fn = View.prototype = {
    constructor: View,
    init: function(selector, context) {
        if (typeof selector === "string") {
            this.selector = selector;
        }
        return this;
    }
};
View.fn.init.prototype = View.fn;
var Table = (function() {
    var rows=0, cols=0, content = [];
    function Table(tableItems) {
        content = [];
        rows = 0; cols = 0;
        if (tableItems && tableItems.length) {
            for (var i = 0; i < tableItems.length; i++) {
                content.push([]);
                if (tableItems[i] && tableItems[i].length > rows) {
                    rows = tableItems[i].length;
                }
            }
            for (var i = 0; i < tableItems.length; i++) {
                for (var j = 0; j < rows; j++) {
                    if (j >= tableItems[i].length) {
                        content[i].push("");
                    } else {
                        content[i].push(tableItems[i][j]);
                    }
                }
            }
            cols = content.length;
        }
    }
    Table.prototype.getHtml = function() {
        var html = '<table class="table table-striped">',
            displayContent = "",
            colClass = "";
        for (var i = 0; i < rows; i++) {
            html += '<tr>';
            for (var j = 0; j < cols; j++) {
                displayContent = "";
                if (content[j][i].key) {
                    displayContent = content[j][i].key + "=" + content[j][i].value;
                }
                if (content[j][i].value) {
                    colClass = "";
                } else {
                    colClass = "badge-danger alert-danger";
                }
                html += '<td><span class="badge ' + colClass + '">' + displayContent + '</span></td>';
            }
            html += '</tr>';
        }
        html += '</table>';
        return html;
    };
    Table.prototype.getContent = function() {
        return content;
    };
    return Table;
})();
View.extend = View.fn.extend = function(options) {
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
View.extend({
    // relatedKeysLength: function(key) {
    //  return this.getRelatedKeys(key).length;
    // },
    getRelatedKeys: function(key) {
        var result = [];
        if (relatedKeys[key] && relatedKeys[key].length) {
            result = relatedKeys[key];
        }
        return result;
    },
    getTableInfo: function(displayTableContent) {
        return new Table(displayTableContent);
    }
});
View.extend({
    getTableHtml: function(tableId) {
        return $VC.getTableHtml(tableId);
    },
    getSignalClass: function(item, aspect) {
        return $VC.getSignalClass(item, aspect);
    },
    getTprClass: function(name) {
        return $VC.getTprClass(name);
    },
    getIndicationClass: function(name) {
        return $VC.getIndicationClass(name);
    },
    getPossibleValues: function() {
        return $VC.getPossibleValues();
    },
    setValues: function(name, value) {
        return $VC.setValues(name, value);
    },
    toggleValues: function(name) {
        return $VC.toggleValues(name);
    },
    documentLoaded: function() {
        $VC.documentLoaded();
        return 0;
    },
    addSignalClass: function() {
        var signals = ["S1-RECR", "S1-HECR", "S1-DECR", "S2-RECR", "S2-HECR",
                        "S3-RECR", "S3-HECR", "S3-DECR", "S4-RECR", "S4-HECR",
                        "S13-RECR", "S13-HECR", "S13-DECR", "S14-RECR", "S14-HECR",
                        "S15-RECR", "S15-HECR", "S15-DECR", "S16-RECR", "S16-HECR"];
        for (var i=0; i <signals.length; i++) {
            $("#"+signals[i]).removeClass("active").addClass(this.getSignalClass(signals[i]));
        }
    }
});

window.View = window.$V = View;
})(window, $VC);
