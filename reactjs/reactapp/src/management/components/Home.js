import React from 'react';
import {Link} from 'react-router-dom';

function Home(props) {
    var listItems = props.listItems;
    var listItemsJSX = "";
    if (listItems.length) {
        listItemsJSX = listItems.map(function(item, index, arr) {
            var itemCls = "list-group-item list-group-item-action ";
            if (item.className) {
                itemCls += item.className;
            }
            var url = props.pages.basepathname + item.url;
            return <Link key={index} to={url} className={itemCls}>{item.text}</Link>;
        });
    }

    var logo = "";
    if (props.state.isLoaded && props.logoUrl) {
        logo = <img src={props.logoUrl} alt="App Logo" className="logo"/>
    }

    return (
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <div className="text-center">
                    {logo}
                </div>
                <div className="list-group">
                    {listItemsJSX}
                    <Link to={props.pages.form}><button className="list-group-item list-group-item-action list-group-item-success text-center">Click here to get started.</button></Link>
                </div>
            </div>
        </div>
    );
}
export default Home;
