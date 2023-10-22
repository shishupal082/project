import React from 'react';
import YardTable from './YardTable';

function YardContainer(props) {
    var YardTableComponent = <center>Loading...</center>;
    var tableHtmlDivClass = "table-html";
    tableHtmlDivClass += props.state.dominoDisplayEnable ? " display-domino" : "";
    if (props.state.yardTableContent) {
        YardTableComponent = <YardTable onClick={props.onClick} yardTableContent={props.state.yardTableContent}
                            id="yard" state={props.state}/>;
    }
    return (
        <div className="yard"><div id="tableHtml" className={tableHtmlDivClass}>
            {YardTableComponent}
        </div></div>
    );
}
export default YardContainer;
