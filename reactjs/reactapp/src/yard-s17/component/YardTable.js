import React from 'react';
import YardTr from './YardTr'
import $S from '../../interface/stack';

function YardTable(props) {
    // console.log("YardTable Render");
    // console.log(props.yardTableContent);
    var trs, defaultTrData = [];
    var tId = props.id;
    if ($S.isArray(props.yardTableContent)) {
        trs = props.yardTableContent.map(function(trData, index, arr) {
            var trId = tId + "-" + index;
            var trClass = index%2 ? "odd" : "even";
            return <YardTr onClick={props.onClick} key={trId} className={trClass} id={trId} index={index}
                    trData={trData} state={props.state}/>;
        });
    } else {
        trs = <YardTr onClick={props.onClick} id={$S.getUniqueNumber()} index="0"
                    trData={defaultTrData} state={props.state}/>;
    }
    return (
        <table id={tId} className={props.className}><tbody>
            {trs}
        </tbody></table>
    )
}

export default YardTable;
