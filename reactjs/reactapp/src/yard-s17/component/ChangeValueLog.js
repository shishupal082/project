import React from 'react';
import YardTable from './YardTable';
import $S from '../../interface/stack';
import $M from '../../interface/model';
import $YApiModel from "../../interface/yardApiModel.js";

function getTableContent(changeValueData) {
    var zeroTo1 = changeValueData["0to1WithIndex"];
    var oneTo0 = changeValueData["1to0WithIndex"];
    var all = changeValueData["all"];
    if (zeroTo1.length !== oneTo0.length) {
        $M.log("Invalid data.");
        console.log(changeValueData);
        return [];
    }
    var tableData = [];
    var tempData = [];
    var dataAddedStatus;
    for (var j = 0; j < zeroTo1.length; j++) {
        dataAddedStatus = false;
        if (all.indexOf(zeroTo1[j]) >= 0) {
            dataAddedStatus = true;
            tableData.push({"text": zeroTo1[j], "tag": "span", "tdClassName": "alert-success"});
        }
        if (all.indexOf(oneTo0[j]) >= 0) {
            dataAddedStatus = true;
            tableData.push({"text": oneTo0[j], "tag": "span", "tdClassName": "alert-warning"});
        }
        if (!dataAddedStatus) {
            tempData.push(zeroTo1[j]);
            tempData.push(oneTo0[j]);
        }
    }
    if (tempData.length) {
        $M.log("Keys not found in all.");
        console.log(tempData);
    }
    var table = $M.getTable([tableData], "display-log");
    table.addColIndex(1);
    return table.getContent();
}

class ChangeValueLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    render() {
        var logData = this.props.logData;
        var changeValueData = this.props.changeValueData;
        var displayTableData = [];
        displayTableData.push(getTableContent(changeValueData));
        for (var i = logData.length-1; i >= 0 ; i--) {
            displayTableData.push(getTableContent(logData[i]));
        }
        var displayTableDataContent = displayTableData.map(function(item, index, arr) {
            var tId = "display-log-" + index;
            return <YardTable key={tId} id={tId} yardTableContent={item} className="table table-bordered"/>
        });
        // console.log(displayTableData);
        return (
            <div id="changeValueData">
                {displayTableDataContent}
            </div>
        );
    }
}
export default ChangeValueLog;
