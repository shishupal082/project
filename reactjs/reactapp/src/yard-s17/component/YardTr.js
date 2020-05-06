import React from 'react';
import YardTd from './YardTd'
import $S from '../../interface/stack';

function YardTr(props) {
    // console.log("YardTr Render");
    // console.log(props.trData);
    var trId = props.id, defaultTdData = "emptyTd";
    var tdId = trId + "-0";
    var tds;
    if ($S.isArray(props.trData)) {
        tds = props.trData.map(function(tdData, index, arr) {
            tdId = trId + "-" + index;
            return <YardTd onClick={props.onClick} key={tdId} id={tdId} tdData={tdData} index={index} state={props.state}/>
        });
    } else {
        tds = <YardTd onClick={props.onClick} id={$S.getUniqueNumber()}
                tdData={defaultTdData} state={props.state}/>
    }
    return (
        <tr className={props.className} id={trId}>{tds}</tr>
    );
}

export default YardTr;
