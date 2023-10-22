import $S from "../interface/stack.js";
var P2;
(function($S) {
var DT = $S.getDT();
// var Hour = 0;
// var TimeRef00 = "00:00";
// var TimeRef24 = "24:00";
// var TimeRef = "00:00";
var DateFormate = "YYYY/-/MM/-/DD";
// var Rate = 900;
var Print;
P2 = function(print) {
    Print = print;
    return new P2.fn.init();
};
P2.fn = P2.prototype = {
    constructor: P2,
    init: function() {
        return this;
    },
    formTemplate: function(useCase, formValueIndex) {
        var prev = null, current = null, next = null;
        if (Print.formValues.length > formValueIndex) {
            current = $S.clone(Print.formValues[formValueIndex]);
            if (formValueIndex > 0) {
                prev = $S.clone(Print.formValues[formValueIndex-1]);
            }
        }
        if (Print.formValues.length > formValueIndex+1) {
            next = $S.clone(Print.formValues[formValueIndex+1]);
        }
        if (current.templateName === "formTemplate1") {
            return P2.formTemplate1(useCase, formValueIndex, prev, current, next);
        } else if (current.templateName === "formTemplate2") {
            return P2.formTemplate2(useCase, formValueIndex, prev, current, next);
        }
        return true;
    }
};
$S.extendObject(P2);
P2.extend({
    getRate: function(timeDiff) {
        if ($S.isNumeric(timeDiff)) {
            timeDiff = timeDiff*1;
        } else {
            return 0;
        }
        if (timeDiff < 3) {
            return 0;
        } else if (timeDiff <= 6) {
            return 0.3;
        } else if (timeDiff > 6 && timeDiff <= 12) {
            return 0.7;
        } else {
            return 1;
        }
    },
    getDateDiff: function(d1, d2) {
        d1 = DT.getDateObj(d1);
        d2 = DT.getDateObj(d2);
        if (d1 && d2) {
            return (d2.getTime()-d1.getTime()) / (86400*1000);
        }
        return 0;
    },
    getDayBetweenDate: function(d1, d2) {
        var d1Obj = DT.getDateObj(d1);
        var d2Obj = DT.getDateObj(d2);
        if (d1Obj && d2Obj) {
            return this.getDateDiff(d1, d2) + 1;
        }
        return 0;
    },
    incrementDate: function(dateStr) {
        var dateObj = DT.getDateObj(dateStr);
        if (dateObj) {
            dateObj.setDate(dateObj.getDate() + 1);
            return DT.formateDateTime(DateFormate, "/", dateObj);
        }
        return dateStr;
    },
    decrementDate: function(dateStr) {
        var dateObj = DT.getDateObj(dateStr);
        if (dateObj) {
            dateObj.setDate(dateObj.getDate() - 1);
            return DT.formateDateTime(DateFormate, "/", dateObj);
        }
        return dateStr;
    },
    _timeToInt: function(t) {
        var result = 0, tArr = [];
        if ($S.isString(t) && t.length === 5) {
            tArr = t.split(":");
            if (tArr.length === 2 && $S.isNumeric(tArr[0]) && $S.isNumeric(tArr[0])) {
                result = (tArr[0]*60 + tArr[1]*1) / 60;
            }
        }
        return result.toFixed(2)*1;
    },
    getHours: function(t, ref) {
        return this._timeToInt(ref) - this._timeToInt(t);
    }
});
P2.extend({
    getTemplate2FullRow: function(current, isMid) {
        // current = currentFormValue
        var printRowData = {};
        if ($S.isBooleanTrue(isMid)) {
            printRowData.formRowId = current.formRowId;
            printRowData.templateName = current.templateName;
            printRowData.date = current.startDate;
            printRowData.trainNumber = current.trainNumber;
            printRowData.objectiveOfJourney = current.objectiveOfJourney;
            printRowData.day = "-";
        } else {
            printRowData = current;
            printRowData.date = current.startDate;
            printRowData.day = this.getRate(this.getHours(current.departureTime, current.arrivalTime));
        }
        return printRowData;
    },
    getTemplate2HalfRow: function(current, position) {
        // current = currentFormValue
        var printRowData = {};
        printRowData.formRowId = current.formRowId;
        printRowData.templateName = current.templateName;
        if (position === 0) {
            printRowData.date = current.startDate;
            printRowData.departureTime = current["departureTime"];
            printRowData.arrivalTime = "-";
            printRowData.sourceStation = current["sourceStation"];
            printRowData.destinationStation = "-";
            printRowData.distance = "-";
            printRowData.day = this.getRate(this.getHours(printRowData.departureTime, "24:00"));
        } else {
            printRowData.date = current.endDate;
            printRowData.departureTime = "-";
            printRowData.arrivalTime = current["arrivalTime"];
            printRowData.sourceStation = "-";
            printRowData.destinationStation = current["destinationStation"];
            printRowData.distance = current["distance"];
            printRowData.day = this.getRate(this.getHours("00:00", printRowData.arrivalTime));
        }
        printRowData.trainNumber = current["trainNumber"];
        printRowData.objectiveOfJourney = current["objectiveOfJourney"];
        return printRowData;
    },
    getTransit: function(current, next, templateName) {
        var printRowData = {};
        printRowData.formRowId = "row-0";
        printRowData.templateName = "printTemplate1";
        if (current.endDate === next.startDate) {
            printRowData.date = current.startDate;
            if (current.arrivalTime !== next.departureTime) {
                printRowData.date += current.arrivalTime + " to " + next.departureTime;
            }
        } else {
            printRowData.date = current.endDate + "T" + current.arrivalTime +
                                " to " + next.startDate + "T" + next.departureTime;
        }
        printRowData.objectiveOfStay = "Transit";
        return printRowData;
    },
    handleMid: function(prev, current, next) {
        // return P2.getTransit(current, next);
        return true;
    }
});
P2.extend({
    getTemplate1RowData: function(current) {
        var printRowData = $S.clone(current);
        printRowData.objectiveOfJourney = "-";
        if (current.startDate === current.endDate) {
            printRowData.date = current.startDate;
        } else {
            printRowData.date = current.startDate + " to " + current.endDate;
        }
        printRowData.day = P2.getDayBetweenDate(current.startDate, current.endDate);
        return printRowData;
    },
});
P2.extend({
    formTemplate2: function(useCase, formValueIndex, prev, current, next) {
        var rowData = {};
        if (current.startDate === current.endDate) {
            rowData = P2.getTemplate2FullRow(current);
            Print.pushPrintRowData(rowData);
        } else {
            rowData = P2.getTemplate2HalfRow(current, 0);
            Print.pushPrintRowData(rowData);
            P2.handleMid(prev, current, next);
            rowData = P2.getTemplate2HalfRow(current, 1);
            Print.pushPrintRowData(rowData);
        }
        return rowData;
    },
    formTemplate1: function(useCase, formValueIndex, prev, current, next) {
        var rowData = {};
        rowData = P2.getTemplate1RowData(current);
        Print.pushPrintRowData(rowData);
        return rowData;
    }
});
})($S);
export default P2;
