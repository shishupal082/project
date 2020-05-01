import React from 'react';
import Tr from './Tr';

function Table(props) {
    var tId = "", cName = "", tData = [];
    tId = props.tId ? props.tId: "tid";
    cName = props.cName ? props.cName : "cname";
    tData = props.tData ? props.tData : [];
    var trs = tData.map(function(item, index, arr) {
        var trId = tId+"-"+index;
        return <Tr id={trId} key={trId} item={item}/>
    });
    return (
        <table id={tId} className={cName}><tbody>
            {trs}
        </tbody></table>
    );
}

export default Table;
