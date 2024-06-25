import React from 'react';
import {Link} from 'react-router-dom';

function Instruction(props) {
    var listItems = props.listItems;
    var listItemsJSX = "";
    if (listItems.length) {
        listItemsJSX = listItems.map(function(item, index, arr) {
            return <li href={item.url} className="list-group-item" key={index}>{item.text}</li>
        });
    }
    return (
        <div className="row"><div className="col-md-6 offset-md-3">
            <div className="list-group">
                <Link to={props.pages.main} className="list-group-item list-group-item-primary text-center">Instructions</Link>
            </div>
            <div className="list-group">
                {listItemsJSX}
            </div>
        </div></div>
    );
}
export default Instruction;
