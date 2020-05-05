import React from 'react';
import YardTr from './YardTr'

function YardTable(props) {
    var trs = props.yardTableContent.map(function(trData, index, arr) {
        var trId = props.id + "-" + index;
        var trClass = index%2 ? "odd" : "even";
        return <YardTr onClick={props.onClick} key={trId} className={trClass} id={trId} index={index} trData={trData}/>;
    });
    return (
        <table id={props.id} className={props.className}><tbody>
            {trs}
        </tbody></table>
    )
}

export default YardTable;
