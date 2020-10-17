import React from 'react';
import $S from "../../../interface/stack.js";

class PageTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.OpenTab = this.OpenTab.bind(this);
        this.CloseTab = this.CloseTab.bind(this);
    }
    OpenTab(e) {
        this.props.methods.OpenTab(e);
    }
    CloseTab(e) {
        this.props.methods.CloseTab(e);
    }
    componentDidMount() {
        $S.log("PageTab:componentDidMount");
    }
    render() {
        var self = this;
        var pageTab = this.props.data.pageTab.map(function(el, i, arr) {
            var closeLink = <span className="close-tab" value={el} onClick={self.CloseTab}>X</span>;
            var navLinkClass = "nav-link active";
            var tabDisplayText = self.props.methods.getTabDisplayText(el);
            if (arr.length === 1) {
                closeLink = null;
            }
            if(el === self.props.currentPageName) {
                closeLink = null;
                navLinkClass += " current-page";
            }
            return <li key={i} className="nav-item"><button className={navLinkClass}><span className="pr-5px" value={el} onClick={self.OpenTab}>{tabDisplayText}</span>{closeLink}</button></li>;
        });
        if (pageTab.length > 0) {
            pageTab = <ul className="nav nav-tabs">{pageTab}</ul>;
        }
        if (this.props.data.firstTimeDataLoadStatus !== "completed" || this.props.data.list1Data.length < 1) {
            pageTab = null;
        }
        return (<div className="PAGE-TAB">{pageTab}</div>);
    }
}

export default PageTab;
