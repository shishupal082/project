import React from 'react';
import SelectUser from "./SelectUser";


import $S from "../../../interface/stack";

import Config from "../../common/Config";
import DataHandler from "../../common/DataHandler";


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.goBack = this.goBack.bind(this);
        this.CloseTab = this.CloseTab.bind(this);
        this.OpenTab = this.OpenTab.bind(this);
    }
    CloseTab(e) {
        var value = e.target.getAttribute("value");
        this.props.methods.removeTab(value);
    }
    OpenTab(e) {
        this.props.methods.appDataCallback("renderFieldRow", []);

        var pageName = e.target.getAttribute("value");
        var pages = Config.pages;
        if (pageName !== this.props.currentPageName) {
            if ($S.isString(pages[pageName])) {
                this.props.history.push(pages[pageName]);
            } else {
                alert("Page '" + pageName + "' not found");
            }
        }
    }
    componentDidMount() {
    }
    goBack(e) {
        e.preventDefault();
        this.props.history.push(this.props.data.pages.home);
    }
    render() {
        var self = this;
        var backIcon = <img className="back-img" src={this.props.data.backIconUrl} alt="back"/>;
        var goBackLink = <a href={this.props.data.pages.home} onClick={this.goBack}><h2>{backIcon}Back</h2></a>;
        var pageTab = this.props.data.pageTab.map(function(el, i, arr) {
            var closeLink = <span className="close-tab" value={el} onClick={self.CloseTab}>X</span>;
            var navLinkClass = "nav-link active";
            var tabDisplayText = DataHandler.getMetaDataPageHeading(el);
            if (arr.length === 1) {
                closeLink = null;
            }
            if(el === self.props.currentPageName) {
                closeLink = null;
                navLinkClass += " current-page";
            }
            return <li key={i} className="nav-item"><button className={navLinkClass}><span value={el} onClick={self.OpenTab}>{tabDisplayText}</span>{closeLink}</button></li>;
        });
        if (pageTab.length) {
            pageTab = <ul className="nav nav-tabs">{pageTab}</ul>;
        }
        var selectFilter = <SelectUser data={this.props.data} methods={this.props.methods} currentPageName={this.props.currentPageName} history={this.props.history}/>;
        if (this.props.currentPageName === "home") {
            goBackLink = null;
            selectFilter = null;
            pageTab = null;
        }
        if (this.props.data.firstTimeDataLoadStatus !== "completed") {
            goBackLink = null;
            pageTab = null;
        }
        return (<div className="HEADER">
                    <div className="container">
                        <div className="position-absolute">{goBackLink}</div>
                        <center><h2>{this.props.data.companyName}</h2></center>
                    </div>
                    <div className="container"><center><h2>{this.props.data.pageHeading}</h2></center></div>
                    {selectFilter}
                    <div>{pageTab}</div>
            </div>);
    }
}

export default Header;

