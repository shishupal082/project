import React from 'react';
import Td from './Td';

function Tr(props) {
    var tDs = props.item.map(function(item, index, arr) {
        var tdId = props.id+"-"+index;
        var td = <Td id={tdId} key={tdId} item={item}/>;
        if (index === 2 && props.index > 0 && arr.length > 3) {
            var url = arr[3];
            td = <Td id={tdId} key={tdId} item={item} type="url" url={url}/>;
        }
        return td;
    });
    return (
        <tr id={props.id}>{tDs}</tr>
    );
}

export default Tr;
