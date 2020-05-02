import React from 'react';

function Td(props) {
    var tdText = props.item;
    if (props.type === "url" && props.url) {
        tdText = <a href={props.url}>{props.item}</a>;
    }
    return (
        <td id={props.id}>{tdText}</td>
    );
}

export default Td;
