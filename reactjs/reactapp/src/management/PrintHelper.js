import $S from "../interface/stack.js";
import P2 from "./PrintHelper2.js";
var PrintHelper;
(function($S) {
var DT = $S.getDT();
// var AddHour = 0;
// var TimeRef = "00:00";
var DateFormate = "YYYY/-/MM/-/DD";
var UserData = {};
var PrintRowData = [];
var Rate = 900;
var P21;
var Print = function(formValues) {
    return new Print.fn.init(formValues);
};
Print.fn = Print.prototype = {
    constructor: Print,
    init: function(formValues) {
        UserData = {"formRowId": "row-0", "templateName": "userDetails"};
        PrintRowData = [];
        P21 = P2(this);
        this.formValues = formValues;
        return this;
    },
    setUserData: function() {
        if ($S.isArray(this.formValues) && this.formValues.length) {
            UserData = this.formValues[0];
        }
        return true;
    },
    pushPrintRowData: function(rowData) {
        PrintRowData.push(rowData);
        return true;
    }
};
$S.extendObject(Print);
Print.extend({
    getSpaces: function(num) {
        var space = "";
        if ($S.isNumber(num)) {
            for(var i=0; i<num; i++) {
                space += "\u00a0";
            }
        }
        return space;
    },
    getDotted: function(num) {
        var dot = "";
        if ($S.isNumber(num)) {
            for(var i=0; i<num; i++) {
                dot += ".";
            }
        }
        return dot;
    }
});
var methods = {
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
    },
    _verifyDayAndAmount: function(printRowData) {
        if (printRowData.day === 0) {
            printRowData.day = "-";
        }
        if ($S.isNumber(printRowData.day) && printRowData.day > 0) {
            printRowData.rateAmount = Rate +" x "+ printRowData.day +" = "+ Rate*printRowData.day;
        } else {
            printRowData.rateAmount = "-";
        }
        return printRowData;
    },
    calculateDay: function(startDate, endDate, startTime, endTime) {
        var day = (new Date(endDate) - new Date(startDate)) / 86400000;
        return day + 1;
    },
    getTotalRow: function(print) {
        var totalRow = {}, i;
        totalRow.formRowId = "row-0";
        totalRow.templateName = "totalRow";
        var totalDay = 0, amount = 0;
        if ($S.isArray(PrintRowData) && PrintRowData.length > 1) {
            for(i=0; i<PrintRowData.length; i++) {
                if ($S.isNumeric(PrintRowData[i].day)) {
                    totalDay += PrintRowData[i].day*1;
                }
            }
        }
        amount = Math.round(Rate * totalDay);
        totalRow.totalDay = totalDay > 0 ? totalDay : "";
        totalRow.totalAmount = amount > 0 ? (amount).toString() + "/-" : "";
        totalRow.totalAmountText = amount>0 ? $S.numberToWord(amount) : "";
        return totalRow;
    },
    getTemplate2RowDataFull: function(formValue, isMid) {
        var printRowData = {};
        if ($S.isBooleanTrue(isMid)) {
            printRowData.formRowId = formValue.formRowId;
            printRowData.templateName = formValue.templateName;
            printRowData.date = formValue.startDate;
            printRowData.trainNumber = formValue.trainNumber;
            printRowData.objectiveOfJourney = formValue.objectiveOfJourney;
            printRowData.day = "-";
        } else {
            printRowData = formValue;
            printRowData.date = formValue.startDate;
            printRowData.day = this.getRate(this.getHours(formValue.departureTime, formValue.arrivalTime));
        }
        return printRowData;
    },
    getTemplate2RowDataHalf: function(formValue, position) {
        var printRowData = {};
        printRowData.formRowId = formValue.formRowId;
        printRowData.templateName = formValue.templateName;
        if (position === 0) {
            printRowData.date = formValue.startDate;
            printRowData.departureTime = formValue["departureTime"];
            printRowData.arrivalTime = "-";
            printRowData.sourceStation = formValue["sourceStation"];
            printRowData.destinationStation = "-";
            printRowData.distance = "-";
            printRowData.day = this.getRate(this.getHours(printRowData.departureTime, "24:00"));
        } else {
            printRowData.date = formValue.endDate;
            printRowData.departureTime = "-";
            printRowData.arrivalTime = formValue["arrivalTime"];
            printRowData.sourceStation = "-";
            printRowData.destinationStation = formValue["destinationStation"];
            printRowData.distance = formValue["distance"];
            printRowData.day = this.getRate(this.getHours("00:00", printRowData.arrivalTime));
        }
        printRowData.trainNumber = formValue["trainNumber"];
        printRowData.objectiveOfJourney = formValue["objectiveOfJourney"];
        this._verifyDayAndAmount(printRowData);
        return printRowData;
    },
    getTemplate2RowDataMid: function(formValue) {
        var printRowData = $S.clone(formValue), startDate, rowData;
        var dateDiff = this.getDateDiff(formValue.startDate, formValue.endDate);
        if (dateDiff > 1) {
            startDate = printRowData.startDate;
            printRowData = this.getTemplate2RowDataFull(printRowData, true);
            for(var i=0; i<dateDiff; i++) {
                rowData = $S.clone(printRowData);
                rowData.date = this.incrementDate(startDate);
                rowData.day = 1;
                PrintRowData.push(rowData);
            }
        }
        return printRowData;
    },
    getTemplate1RowData: function(formValue) {
        var printRowData = $S.clone(formValue);
        printRowData.objectiveOfJourney = "-";
        if (formValue.startDate === formValue.endDate) {
            printRowData.date = formValue.startDate;
        } else {
            printRowData.date = formValue.startDate + " to " + formValue.endDate;
        }
        return printRowData;
    },
    isSingleEntry: function(print) {
        var formValues = $S.isDefined(print) ? print.formValues : [];
        if ($S.isArray(formValues) && formValues.length === 2) {
            return true;
        }
        return false;
    }
};
/*
function handleCase(caseName, print, rowIndex) {
    var current = {}, next = {}, rowData = {};
    if (print.formValues.length > rowIndex) {
        current = $S.clone(print.formValues[rowIndex]);
    }
    if (print.formValues.length > rowIndex+1) {
        next = $S.clone(print.formValues[rowIndex+1]);
    }
    switch(caseName) {
        case "template2.firstRow.onlyRow":
            if (current.startDate === current.endDate) {
                rowData = methods.getTemplate2RowDataFull(current);
                PrintRowData.push(rowData);
            } else {
                rowData = methods.getTemplate2RowDataHalf(current, 0);
                PrintRowData.push(rowData);
                methods.getTemplate2RowDataMid(current);
                rowData = methods.getTemplate2RowDataHalf(current, 1);
                PrintRowData.push(rowData);
            }
        break;
        case "template2.firstRow.notOnlyRow.nextTemplate2":
            if (current.endDate === next.startDate) {
                if (current.startDate === current.endDate) {
                    rowData = methods.getTemplate2RowDataFull(current);
                    PrintRowData.push(rowData);
                    AddHour += methods.getHours(current.departureTime, current.arrivalTime);
                    if (current.arrivalTime === next.departureTime) {
                        TimeRef = next.departureTime;
                    } else {
                        AddHour += methods.getHours(current.arrivalTime, next.departureTime);
                    }
                } else {
                    rowData = methods.getTemplate2RowDataHalf(current, 0);
                    PrintRowData.push(rowData);
                    rowData = methods.getTemplate2RowDataHalf(current, 1);
                    PrintRowData.push(rowData);
                    TimeRef = "00:00";
                }
            } else {
                if (current.startDate === current.endDate) {
                    rowData = methods.getTemplate2RowDataFull(current);
                    // Over writting day
                    rowData.day = methods.getRate(methods.getHours(current.departureTime, "24:00"));
                    PrintRowData.push(rowData);
                    this.handleCase("setContinuousRow", print, rowIndex);
                    TimeRef = "00:00";
                } else {
                    rowData = methods.getTemplate2RowDataHalf(current, 0);
                    PrintRowData.push(rowData);
                    methods.getTemplate2RowDataMid(current);
                    rowData = methods.getTemplate2RowDataHalf(current, 1);
                    this.handleCase("setContinuousRow", print, rowIndex);
                    TimeRef = "00:00";
                }
            }
        break;
        case "template2.midRow.next.template2":
            
        break;
        case "template2.midRow.next.template1":
            
        break;
        case "template2.lastRow":
            
        break;
        case "template1.firstRow.onlyRow": //Less data
            rowData = methods.getTemplate1RowData(current);
            // PrintRowData.push(rowData);
        break;
        case "template1.firstRow.notOnlyRow":
            rowData = methods.getTemplate1RowData(current);
            // PrintRowData.push(rowData);
        break;
        case "template1.firstRow.notOnlyRow.nextTemplate1":
            // var startDate = current.startDate;
            // var endDate = current.endDate;
            // var nextStartDate = next.startDate;
            // TimeRef = "00:00";
            // if (startDate === endDate) {
            //     if (endDate === nextStartDate) {
            //         rowData = methods.getTemplate1RowData(current);
            //         PrintRowData.push(rowData);
            //     } else {
            //         AddHour += 24;
            //         rowData = methods.getTemplate1RowData(current);
            //         rowData.day = methods.getRate(AddHour);
            //         PrintRowData.push(rowData);
            //         AddHour = 0;
            //         // rowData
            //         // $this->setContiRows($details, $i, $end);
            //     }
            // }
        break;
        case "setContinuousRow":
            var currentEndDate = current.endDate;
            var nextStartDate = next.startDate;
            var dateDiff = methods.getDateDiff(currentEndDate, nextStartDate);
            if (dateDiff > 1) {
                current.startDate = methods.incrementDate(currentEndDate);
                current.endDate = methods.decrementDate(nextStartDate);
                current.objectiveOfStay = "Transit.";
                rowData = methods.getTemplate1RowData(current);
                rowData.day = methods.calculateDay(current.startDate, current.endDate);
                PrintRowData.push(rowData);
            }
        break;
        case "template1.midRow.next.template1":
            
        break;
        case "template1.midRow.next.template2":
            
        break;
        case "template1.lastRow":
            
        break;
        default:
        break;
    }
    return rowData;
}
function handleSSS(current, next, prev, print, index) {
    var rowData = {};
    rowData = methods.getTemplate1RowData(current);
    if (current.startDate === current.endDate) {
        if (current.endDate !== next.startDate) {
            AddHour += methods.getHours(TimeRef, "24:00");
            rowData.day = methods.getRate(AddHour);
            PrintRowData.push(rowData);
            handleCase("setContinuousRow", print, index);
        }
    } else {
        AddHour += methods.getHours(TimeRef, "24:00");
        if (current.endDate === next.startDate) {
            rowData.day = methods.getDayBetweenDate(methods.incrementDate(current.startDate),
                methods.decrementDate(current.endDate)) + methods.getRate(AddHour);
            PrintRowData.push(rowData);
        } else {
            rowData.day = methods.getDayBetweenDate(methods.incrementDate(current.startDate),
                current.endDate) + methods.getRate(AddHour);
            PrintRowData.push(rowData);
            handleCase("setContinuousRow", print, index);
        }
    }
    TimeRef = "00:00";
    AddHour = 0;
    return rowData;
}
*/
Print.extend({
    getDetails: function(print) {
        print.setUserData();
        PrintRowData.push(UserData);
        console.log(print.formValues);
        var current, rowCount, i;
        if ($S.isArray(print.formValues) && print.formValues.length > 1) {
            rowCount = print.formValues.length;
            //skipping first row
            for(i=1; i<rowCount; i++) {
                current = print.formValues[i];
                P21.formTemplate(current.templateName, i);
                // if (current.templateName === "formTemplate2") {// More data row
                    
                // } else if (current.templateName === "formTemplate1") {// Less data row
                //     P21.formTemplate1(current.templateName, i);
                // }
            }
            for(i=1; i<PrintRowData.length; i++) {
                if (PrintRowData[i].day === 0 || !$S.isNumber(PrintRowData[i].day)) {
                    PrintRowData[i].day = "-";
                }
                if ($S.isNumber(PrintRowData[i].day) && PrintRowData[i].day > 0) {
                    PrintRowData[i].rateAmount = Rate +" x "+ PrintRowData[i].day +" = "+ Rate*PrintRowData[i].day;
                } else {
                    PrintRowData[i].rateAmount = "-";
                }
            }
            PrintRowData.push(methods.getTotalRow(print));
        } else {
            PrintRowData.push(methods.getTotalRow(print));
        }
        return PrintRowData;
    },/*
    getDetails2: function(print) {
        AddHour = 0;
        TimeRef = "00:00";
        print.setUserData();
        PrintRowData.push(UserData);
        console.log(print.formValues);
        var rowCount, current, next, prev, rowData, dateDiff;
        var startDate, endDate, startTime, endTime, i;
        var nextStartDate, nextEndDate, nextStartTime, nextEndTime;
        var prevStartDate, prevEndDate, prevStartTime, prevEndTime;
        if ($S.isArray(print.formValues) && print.formValues.length > 1) {
            rowCount = print.formValues.length;
            //skipping first row
            for(i=1; i<rowCount; i++) {
                current = print.formValues[i];
                startDate = current["startDate"];
                endDate = current["endDate"];
                startTime = current["departureTime"];
                endTime = current["arrivalTime"];
                if (i+1 < rowCount) { //Not last row
                    next = print.formValues[i+1];
                    nextStartDate = print.formValues[i+1]["startDate"];
                    nextEndDate = print.formValues[i+1]["endDate"];
                    nextStartTime = print.formValues[i+1]["departureTime"];
                    nextEndTime = print.formValues[i+1]["arrivalTime"];
                }
                if (i>1) {
                    prev = print.formValues[i-1];
                    prevStartDate = print.formValues[i-1]["startDate"];
                    prevEndDate = print.formValues[i-1]["endDate"];
                    prevStartTime = print.formValues[i-1]["departureTime"];
                    prevEndTime = print.formValues[i-1]["arrivalTime"];
                }
                if (current.templateName === "formTemplate2") {// More data row
                    P21.formTemplate2(current.templateName, i);
                    if (i === 1) { // isFirstRow
                        if (methods.isSingleEntry(print)) {
                            // handleCase("template2.firstRow.onlyRow", print, i);
                            continue;
                        } else if (next.templateName === "formTemplate2") {
                            // handleCase("template2.firstRow.notOnlyRow.nextTemplate2", print, i);
                            continue;
                        //     rowData = handleCase("template2.firstRow.notOnlyRow", print, i);
                        //     if (startDate === endDate) {
                        //         if (endDate === nextStartDate) {
                        //             PrintRowData.push(rowData);
                        //         } else {
                        //             AddHour += 24;
                        //             rowData.day = methods.getRate(AddHour);
                        //             PrintRowData.push(rowData);
                        //             handleCase("setContinuousRow", print, i);
                        //         }
                        //     } else {
                        //         if (endDate === nextStartDate) {
                        //             rowData.day = methods.getDayBetweenDate(startDate, methods.decrementDate(endDate));
                        //             PrintRowData.push(rowData);
                        //         } else {
                        //             rowData.day = methods.getDayBetweenDate(startDate, endDate);
                        //             PrintRowData.push(rowData);
                        //             handleCase("setContinuousRow", print, i);
                        //         }
                        //     }
                        //     TimeRef = "00:00";
                        //     AddHour = 0;
                        //     continue;
                        }
                    }
                    // if ($S.isString(startDate) && startDate.length > 1 && $S.isString(endDate) && endDate.length > 1) {
                    //     if (startDate === endDate) {
                    //         rowData = methods.getTemplate2RowDataFull(current);
                    //         PrintRowData.push(rowData);
                    //     } else {
                    //         rowData = methods.getTemplate2RowDataHalf(current, 0);
                    //         PrintRowData.push(rowData);
                    //         methods.getTemplate2RowDataMid(current);
                    //         rowData = methods.getTemplate2RowDataHalf(current, 1);
                    //         PrintRowData.push(rowData);
                    //     }
                    // }
                } else if (current.templateName === "formTemplate1") {// Less data row
                    if (i === 1) { // isFirstRow
                        if (methods.isSingleEntry(print)) {
                            rowData = handleCase("template1.firstRow.onlyRow", print, i);
                            rowData.day = methods.calculateDay(current.startDate, current.endDate);
                            PrintRowData.push(rowData);
                            continue;
                        } else if (next.templateName === "formTemplate1") {
                            rowData = handleCase("template1.firstRow.notOnlyRow", print, i);
                            if (startDate === endDate) {
                                if (endDate === nextStartDate) {
                                    PrintRowData.push(rowData);
                                } else {
                                    AddHour += 24;
                                    rowData.day = methods.getRate(AddHour);
                                    PrintRowData.push(rowData);
                                    handleCase("setContinuousRow", print, i);
                                }
                            } else {
                                if (endDate === nextStartDate) {
                                    rowData.day = methods.getDayBetweenDate(startDate, methods.decrementDate(endDate));
                                    PrintRowData.push(rowData);
                                } else {
                                    rowData.day = methods.getDayBetweenDate(startDate, endDate);
                                    PrintRowData.push(rowData);
                                    handleCase("setContinuousRow", print, i);
                                }
                            }
                            TimeRef = "00:00";
                            AddHour = 0;
                            continue;
                        }
                    } else if (i === rowCount-1) { // isLastEntry
                        rowData = handleCase("template1.firstRow.notOnlyRow", print, i);
                        if (prevEndDate === startDate) {
                            AddHour += methods.getHours(TimeRef, "24:00");
                            if (startDate === endDate) {
                                rowData.day = methods.getRate(AddHour);
                            } else {
                                rowData.day = methods.getDayBetweenDate(methods.incrementDate(startDate), endDate) + methods.getRate(AddHour);
                            }
                        } else {
                            rowData.day = methods.getDayBetweenDate(startDate, endDate);
                        }
                        PrintRowData.push(rowData);
                        continue;
                    } else { //midRow
                        if (prev.templateName === "formTemplate1" && next.templateName === "formTemplate1") {
                            handleSSS(current, next, prev, print, i);
                            continue;
                        }
                    }
                }
            }
            for(i=1; i<PrintRowData.length; i++) {
                if (PrintRowData[i].day === 0 || !$S.isNumber(PrintRowData[i].day)) {
                    PrintRowData[i].day = "-";
                }
                if ($S.isNumber(PrintRowData[i].day) && PrintRowData[i].day > 0) {
                    PrintRowData[i].rateAmount = Rate +" x "+ PrintRowData[i].day +" = "+ Rate*PrintRowData[i].day;
                } else {
                    PrintRowData[i].rateAmount = "-";
                }
            }
            PrintRowData.push(methods.getTotalRow(print));
        } else {
            PrintRowData.push(methods.getTotalRow(print));
        }
        return PrintRowData;
    }*/
});
PrintHelper = Print;
})($S);
export default PrintHelper;
