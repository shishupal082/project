import React from 'react';
import $S from '../../libs/stack';
import YardTable from '../component/YardTable';

function getTableHtml(props, yardData, name) {
    var tableData = [];
    if (yardData && yardData[name]) {
        tableData = yardData[name];
    }
    var tableContent = $S.getTable(tableData, name).getContent();
    return <YardTable id={name} onClick={props.onClick} yardTableContent={tableContent} state={props.state}/>
}

const YardHelper = {
    getYardTableContent: function(props, yardComponent, requiredContent) {
        var tableContent = [];
        for (var i = 0; i < requiredContent.length; i++) {
            var curData = [];
            for (var j = 0; j < requiredContent[i].length; j++) {
                if (requiredContent[i][j] === "") {
                    curData.push("");
                } else {
                    curData.push(getTableHtml(props, yardComponent, requiredContent[i][j]));
                }
            }
            tableContent.push(curData);
        }
        return tableContent;
    },
    isUp: function(currentValues, key) {
        if ($S.isObject(currentValues) && $S.isString(key)) {
            key = key.replace("/", "_");
            if (currentValues[key] === 1) {
                return true;
            }
        }
        return false;
    }
};
export default YardHelper;