import React from 'react';

function Instruction(props) {
    var listItems = props.listItems;
    var listItemsJSX = "";
    if (listItems.length) {
        listItemsJSX = listItems.map(function(item, index, arr) {
            return <li href={item.url} className="list-group-item" key={index}>{item.text}</li>
        });
    }
    return (
        <div>
            <div className="list-group">
                <a href="/" className="list-group-item list-group-item-primary text-center">Instructions</a>
            </div>
            <div className="list-group">
                {listItemsJSX}
            </div>
        </div>
    );
}
export default Instruction;
