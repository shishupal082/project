import React from 'react';
import YardTd from './YardTd'

function YardTr(props) {
	var trId = props.id;
	var tds = props.trData.map(function(tdData, index, arr) {
		var tdId = trId + "-" + index;
		return <YardTd onClick={props.onClick} key={tdId} id={tdId} tdData={tdData} index={index} state={props.state}/>
	});
    return (
        <tr className={props.className} id={trId}>{tds}</tr>
    );
}

export default YardTr;
