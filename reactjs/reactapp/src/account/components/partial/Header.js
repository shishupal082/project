import React from 'react';
import SelectUser from "./SelectUser";


import $S from "../../../interface/stack";

import Config from "../../common/Config";


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
        this.props.methods.removeTrackPage(value);
    }
    OpenTab(e) {
        var pageName = e.target.getAttribute("value");
        var pages = Config.pages;
        if (pageName !== this.props.currentPageName) {
            if ($S.isString(pages[pageName])) {
                this.props.history.push(pages[pageName]);
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
        var companyName = this.props.data.companyName;
        var configPageHeading = Config.pageHeading;
        var goBackLink = <a href={this.props.data.pages.home} onClick={this.goBack}><h2>{backIcon}Back</h2></a>;
        var pageTab = this.props.state.pageTracking.map(function(el, i, arr) {
            var closeLink = <span className="close-tab" value={el} onClick={self.CloseTab}>X</span>;
            var navLinkClass = "nav-link active";
            var tabDisplayText = configPageHeading[el] ? configPageHeading[el] : el;
            if (arr.length === 1) {
                closeLink = null;
            }
            if(el === self.props.currentPageName) {
                closeLink = null;
                navLinkClass += " current-page";
            }
            return <li key={i} className="nav-item"><a className={navLinkClass}><span value={el} onClick={self.OpenTab}>{tabDisplayText}</span>{closeLink}</a></li>;
        });
        if (pageTab.length) {
            pageTab = <ul className="nav nav-tabs">{pageTab}</ul>;
        }
        return (<div>
                    <div className="text-center">
                        <div className="position-absolute">{goBackLink}</div>
                        <div><h2>{companyName}</h2></div>
                    </div>
                    <div className="text-center"><div><h2>{this.props.heading}</h2></div></div>
                    <SelectUser data={this.props.data} methods={this.props.methods} currentPageName={this.props.currentPageName} history={this.props.history}/>
                    <div>{pageTab}</div>
            </div>);
    }
}

export default Header;

