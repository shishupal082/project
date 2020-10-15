import React from 'react';

import $S from "../../../interface/stack";

import Config from "../../common/Config";
import DataHandler from "../../common/DataHandler";

class SelectUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.onDateOptionClick = this.onDateOptionClick.bind(this);
        this.onReloadClick = this.onReloadClick.bind(this);
        this.onUserChange = this.onUserChange.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.CloseTab = this.CloseTab.bind(this);
        this.OpenTab = this.OpenTab.bind(this);
    }
    componentDidMount() {
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
    onUserChange(e) {
        DataHandler.UserChange(this.props.methods.appStateCallback,
                this.props.methods.appDataCallback, e.currentTarget.value);
    }
    onPageChange(e) {
        // This can be put under PageComponentDidMount but render fire first then componentDidMount fire on page change
        this.props.methods.appDataCallback("renderFieldRow", []);

        var pageName = e.target.value;
        var pages = Config.pages;
        if ($S.isString(pages[pageName])) {
            this.props.history.push(pages[pageName]);
        }
    }
    onDateOptionClick(e) {
        // this.props.methods.onDateSelectionTypeChange(e.target.value);
        var value = e.currentTarget.value;
        if (this.props.data.selectedDateType !== value) {
            DataHandler.DateSelectionChange(this.props.methods.appStateCallback,
                this.props.methods.appDataCallback, value);
        }
    }
    onReloadClick(e) {
        DataHandler.UserChange(this.props.methods.appStateCallback,
                this.props.methods.appDataCallback, this.props.data.currentUserName);
    }
    render() {
        var self = this;
        var isCurrentPageNotFound = true;
        var reload = <td><button className="btn btn-primary" onClick={this.onReloadClick}>Reload</button></td>;
        var selectOptions = this.props.data.userControlData.map(function(el, i, arr) {
            return <option key={i} value={el.username}>{el.displayName}</option>
        });
        var pageOptions = this.props.data.dropdownFields.map(function(el, i, arr) {
            if (el.name === self.props.currentPageName) {
                isCurrentPageNotFound = false;
            }
            return <option key={i} value={el.name}>{el.toText}</option>
        });
        var pageOptionsDropDown = null;
        if (pageOptions.length >= 1) {
            if (isCurrentPageNotFound) {
                $S.addElAt(pageOptions, 0, <option key={pageOptions.length}>Select page...</option>);
            }
            pageOptionsDropDown = <td><div className="form-group row m-0">
                    <div>
                        <select className="form-control" onChange={this.onPageChange} value={this.props.currentPageName}>
                            {pageOptions}
                        </select>
                    </div>
                </div></td>;
        }
        var dateSelection = this.props.data.dateSelectionFields.map(function(el, i, arr) {
            var className = "btn ";
            if (el.value === self.props.data.selectedDateType) {
                className += "btn-secondary";
            } else {
                className += "btn-primary";
            }
            return <button key={i+1} type="button" className={className} onClick={self.onDateOptionClick} value={el.value}>{el.name}</button>;
        });
        if (dateSelection.length > 0) {
            dateSelection = <td><div className="btn-group" role="group" aria-label="Basic example">
                            {dateSelection}
                        </div></td>;
        }
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
        if (pageTab.length >= 1) {
            pageTab = <ul className="nav nav-tabs">{pageTab}</ul>;
        }
        var dateSelectionRequired = $S.isArray(Config.dateSelectionRequired) ? Config.dateSelectionRequired : [];
        if (dateSelectionRequired.indexOf(this.props.currentPageName) < 0 && dateSelectionRequired.length > 0) {
            dateSelection = null;
        }
        var seleUserOptionsDropDown = null;
        var selectUserText = null;
        if (this.props.data.userControlData.length >= 1) {
            selectUserText = <td className="pr-5px">Select user</td>;
            seleUserOptionsDropDown = <td>
                        <select className="form-control" onChange={this.onUserChange} value={this.props.data.currentUserName}>
                            {selectOptions}
                        </select></td>;
        }

        if (this.props.data.firstTimeDataLoadStatus !== "completed" || this.props.currentPageName === "home" || this.props.data.userControlData.length < 1) {
            selectUserText = null;
            seleUserOptionsDropDown = null;
            pageOptionsDropDown = null;
            dateSelection = null;
            reload = null;
            pageTab = null;
        }
        var seleUserOptions = <div className="SELECT-USER">
                    <div className=""><table><tbody><tr>
                        {selectUserText}
                        {seleUserOptionsDropDown}
                        {pageOptionsDropDown}
                        {dateSelection}
                        {reload}
                    </tr></tbody></table></div>
                    <div>{pageTab}</div>
            </div>;
        return (seleUserOptions);
    }
}

export default SelectUser;

