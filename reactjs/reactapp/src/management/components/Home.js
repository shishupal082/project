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

    var logo = "";
    if (props.state.isLoaded && props.logoUrl) {
        logo = <img src={props.logoUrl} alt="App Logo" className="logo"/>
    }

    return (
        <div>
            <div className="text-center">
                {logo}
            </div>
            <div>
                <div className="list-group">
                    {listItemsJSX}
                    <a href="/"><button className="list-group-item list-group-item-action list-group-item-success text-center">Click here to get started.</button></a>
                </div>
            </div>
        </div>
    );
}
export default Home;
