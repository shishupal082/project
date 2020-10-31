import $S from '../../../interface/stack.js';

var AppHandler;

(function($S){
var DT = $S.getDT();

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
});
AppHandler.extend({
    getTagName: function(e) {
        return e.currentTarget.tagName.toLocaleLowerCase();
    },
    getFieldName: function(e) {
        var tagName = this.getTagName(e);
        if ($S.isString(tagName) && tagName === "span") {
            return e.currentTarget.getAttribute("name");
        }
        return e.currentTarget.name;
    },
    getFieldValue: function(e) {
        var tagName = this.getTagName(e);
        if ($S.isString(tagName) && tagName === "span") {
            return e.currentTarget.getAttribute("value");
        }
        return e.currentTarget.value;
    }
});
AppHandler.extend({
    isValidDateStr: function(dateStr) {
        var p1Formate = "YYYY/-/MM/-/DD";
        var p2Formate = "YYYY/-/MM/-/DD/ /hh/:/mm";
        //2020-05-31
        var p1 = /[1-9]{1}[0-9]{3}-[0-1][0-9]-[0-3][0-9]/i;
        //2020-05-31 00:00
        var p2 = /[1-9]{1}[0-9]{3}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]/i;
        var dateObj;
        if ($S.isString(dateStr) && (dateStr.length === 16 || dateStr.length === 10)) {
            dateObj = DT.getDateObj(dateStr);
            if (dateObj !== null) {
                if (dateStr.search(p2) >= 0 && dateStr === DT.formateDateTime(p2Formate, "/", dateObj)) {
                    return true;
                } else if (dateStr.search(p1) >= 0 && dateStr === DT.formateDateTime(p1Formate, "/", dateObj)) {
                    return true;
                }
            }
        }
        return false;
    },
    isDateLiesInRange: function(startDate, endDate, fieldDate) {
        startDate = DT.getDateObj(startDate);
        endDate = DT.getDateObj(endDate);
        fieldDate = DT.getDateObj(fieldDate);
        if (startDate === null || endDate === null || fieldDate === null) {
            return false;
        }
        if (startDate.getTime() <= fieldDate.getTime() && endDate.getTime() >= fieldDate.getTime()) {
            return true;
        }
        return false;
    },
    generateDateSelectionParameter: function(allDateStr) {
        var dailyDateSelection = [];
        var monthlyDateSelection = [];
        var yearlyDateSelection = [];
        var allDateSelection = [];
        var allDate = [];
        if ($S.isArray(allDateStr)) {
            allDate = allDateStr;
        }
        var i, temp, heading, startDate, endDate;
        /*Daily Date Selection*/
        for (i=0; i<allDate.length; i++) {
            temp = allDate[i];
            dailyDateSelection.push({"dateRange": [temp+" 00:00", temp+" 23:59"], "dateHeading": temp});
        }
        /*Monthly Date Selection*/
        temp = [];
        var dObj;
        for (i=0; i<allDate.length; i++) {
            dObj = DT.getDateObj(allDate[i]);
            if (dObj !== null) {
                dObj.setDate(1);
                heading = DT.formateDateTime("MMM/ /YYYY", "/", dObj);
                startDate = DT.formateDateTime("YYYY/-/MM/-/DD/ 00:00", "/", dObj);
                dObj.setMonth(dObj.getMonth()+1);
                dObj.setDate(0);
                endDate = DT.formateDateTime("YYYY/-/MM/-/DD/ 23:59", "/", dObj);
            } else {
                continue;
            }
            if (temp.indexOf(heading) < 0) {
                monthlyDateSelection.push({"dateRange": [startDate, endDate], "dateHeading": heading});
                temp.push(heading);
            }
        }
        /*Yearly Date Selection*/
        temp = [];
        for (i=0; i<allDate.length; i++) {
            dObj = DT.getDateObj(allDate[i]);
            if (dObj !== null) {
                dObj.setDate(1);
                heading = DT.formateDateTime("YYYY", "/", dObj);
                startDate = heading +"-01-01 00:00";
                endDate = heading +"-12-31 23:59";
            } else {
                continue;
            }
            if (temp.indexOf(heading) < 0) {
                yearlyDateSelection.push({"dateRange": [startDate, endDate], "dateHeading": heading});
                temp.push(heading);
            }
        }
        /*All Date Selection*/
        if (allDate.length > 0) {
            allDateSelection.push({"dateRange": [allDate[0] + " 00:00", allDate[allDate.length-1] + " 23:59"], "dateHeading": "All"});
        }
        var combinedDateSelectionParameter = {};
        combinedDateSelectionParameter["daily"] = dailyDateSelection;
        combinedDateSelectionParameter["monthly"] = monthlyDateSelection;
        combinedDateSelectionParameter["yearly"] = yearlyDateSelection;
        combinedDateSelectionParameter["all"] = allDateSelection;
        return combinedDateSelectionParameter;
    }
});

AppHandler.extend({
    // single select filter data
    getFilterData: function(selectionOptions) {
        var filterData = [];
        var i, j;
        if ($S.isArray(selectionOptions)) {
            for (i = 0; i < selectionOptions.length; i++) {
                if ($S.isArray(selectionOptions[i].options)) {
                    if ($S.isString(selectionOptions[i].selectedValue)) {
                        for (j = 0; j < selectionOptions[i].options.length; j++) {
                            if ($S.isObject(selectionOptions[i].options[j])) {
                                if (selectionOptions[i].selectedValue === selectionOptions[i].options[j].value) {
                                    selectionOptions[i].options[j]["selected"] = true;
                                } else {
                                    selectionOptions[i].options[j]["selected"] = false;
                                }
                            }
                        }
                    }
                    filterData.push({"type": selectionOptions[i].type, "options": selectionOptions[i].options, "selectName": selectionOptions[i].selectName});
                } else if ($S.isArray(selectionOptions[i].buttons)) {
                    if ($S.isString(selectionOptions[i].selectedValue)) {
                        for (j = 0; j < selectionOptions[i].buttons.length; j++) {
                            if ($S.isObject(selectionOptions[i].buttons[j])) {
                                if (selectionOptions[i].selectedValue === selectionOptions[i].buttons[j].value) {
                                    selectionOptions[i].buttons[j]["selected"] = true;
                                } else {
                                    selectionOptions[i].buttons[j]["selected"] = false;
                                }
                            }
                        }
                    }
                    filterData.push({"type": selectionOptions[i].type, "buttons": selectionOptions[i].buttons});
                }
            }
        }
        return filterData;
    }
});
})($S);

export default AppHandler;
