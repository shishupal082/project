import React from 'react';
import $S from '../../libs/stack';
import YardTable from '../component/YardTable';

function getTableHtml(yardData, name) {
    var tableData = [];
    if (yardData && yardData[name]) {
        tableData = yardData[name];
    }
    var table = $S.getTable(tableData, name);
    // return table.getHtml();
    return <YardTable id={name} yardTableContent={table.getContent()}/>
}

const YardHelper = {
    getYardTableContent: function(yardComponent, requiredContent) {
    var tableContent = [];
    for (var i = 0; i < requiredContent.length; i++) {
        var curData = [];
        for (var j = 0; j < requiredContent[i].length; j++) {
            if (requiredContent[i][j] == "") {
                curData.push("");
            } else {
                curData.push(getTableHtml(yardComponent, requiredContent[i][j]));
            }
        }
        tableContent.push(curData);
    }
    return tableContent;
}
};
export default YardHelper;