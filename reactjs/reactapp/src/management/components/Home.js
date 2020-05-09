import React from 'react';

function Home(props) {
    var listItems = props.listItems;
    var listItemsJSX = "";
    if (listItems.length) {
        listItemsJSX = listItems.map(function(item, index, arr) {
            var itemCls = "list-group-item list-group-item-action ";
            if (item.className) {
                itemCls += item.className;
            }
            return <a href={item.url} key={index} className={itemCls}>{item.text}</a>
        });
    }
    return (
        <div>
            <div className="text-center">
                <img src={props.logoUrl} alt="Logo" className="logo"/>
            </div>
            <div>
                <div className="list-group">
                    {listItemsJSX}
                    <button className="list-group-item list-group-item-action list-group-item-success text-center">Click here to get started.</button>
                </div>
            </div>
        </div>
    );
}
export default Home;
