import React from 'react';
import Td from './Td';

function Tr(props) {
    var tDs = props.item.map(function(item, index, arr) {
        var tdId = props.id+"-"+index;
        return <Td id={tdId} key={tdId} item={item}/>
    });
    return (
        <tr id={props.id}>{tDs}</tr>
    );
}

export default Tr;
