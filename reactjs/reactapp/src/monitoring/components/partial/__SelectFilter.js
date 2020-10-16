import React from 'react';
import $S from "../../../interface/stack.js";
import DataHandler from "../../common/DataHandler";
import Config from "../../common/Config";


class SelectFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.onSectionSelect = this.onSectionSelect.bind(this);
        this.onPageSelect = this.onPageSelect.bind(this);
        this.onDateSelect = this.onDateSelect.bind(this);
        this.onReloadClick = this.onReloadClick.bind(this);
        this.OpenTab = this.OpenTab.bind(this);
        this.CloseTab = this.CloseTab.bind(this);
    }
    onReloadClick(e) {
        var appDataCallback = this.props.methods.appDataCallback;
        var appStateCallback = this.props.methods.appStateCallback;
        var sectionId = DataHandler.getData("currentSectionId", "");
        DataHandler.OnSectionChange(appStateCallback, appDataCallback, sectionId);
    }
    onSectionSelect(e) {
        var appStateCallback = this.props.methods.appStateCallback;
        var appDataCallback = this.props.methods.appDataCallback;
        var sectionId = e.currentTarget.value;
        DataHandler.OnSectionChange(appStateCallback, appDataCallback, sectionId);
    }
    gotoPage(pageName) {
        this.props.methods.appDataCallback("renderFieldRow", []);
        var pages = Config.pages;
        if ($S.isString(pages[pageName])) {
            this.props.history.push(pages[pageName]);
        } else {
            alert("page '" + pageName + "' not found");
        }
    }
    onPageSelect(e) {
        this.gotoPage(e.currentTarget.value);
    }
    CloseTab(e) {
        var pageName = e.currentTarget.getAttribute("value");
        this.props.methods.removeTab(pageName);
        this.props.methods.appStateCallback();
    }
    OpenTab(e) {
        var pageName = e.currentTarget.getAttribute("value");
        if (pageName !== this.props.currentPageName) {
            this.gotoPage(pageName);
        }
    }
    onDateSelect(e) {
        var appDataCallback = this.props.methods.appDataCallback;
        var appStateCallback = this.props.methods.appStateCallback;
        DataHandler.OnDateSelection(appStateCallback, appDataCallback, e.currentTarget.value);
    }
    componentDidMount() {
        $S.log("SelectFilter:componentDidMount");
    }
    render() {
        var self = this;
        var currentPageNotFound = true;
        var pageDropdownFields = this.props.data.dropdownFields.map(function(el, i, arr) {
            if (el.name === self.props.currentPageName) {
                currentPageNotFound = false;
            }
            return <option key={i} value={el.name}>{el.toText}</option>
        });
        var sectionFields = this.props.data.sectionsData.map(function(el, i, arr) {
            return <option key={i} value={el.id}>{el.name}</option>
        });
        var pageTab = this.props.data.pageTab.map(function(el, i, arr) {
            var closeLink = <span className="close-tab" value={el} onClick={self.CloseTab}>X</span>;
            var navLinkClass = "nav-link active";
            var tabDisplayText = DataHandler.GetTabDisplayText(el);
            if (arr.length === 1) {
                closeLink = null;
            }
            if(el === self.props.currentPageName) {
                closeLink = null;
                navLinkClass += " current-page";
            }
            return <li key={i} className="nav-item"><button className={navLinkClass}><span className="pr-5px" value={el} onClick={self.OpenTab}>{tabDisplayText}</span>{closeLink}</button></li>;
        });
        var dateSelection = this.props.data.dateSelection.map(function(el, i, arr) {
            var className = "btn ";
            if (el.value === self.props.data.selectedDateType) {
                className += "btn-secondary";
            } else {
                className += "btn-primary";
            }
            return <button key={i} type="button" className={className} onClick={self.onDateSelect} value={el.value}>{el.name}</button>;
        });
        if (dateSelection.length > 0) {
            dateSelection = <td><div className="btn-group" role="group" aria-label="Basic example">
                            {dateSelection}
                        </div></td>;
        }
        var dateSelectionRequired = $S.isArray(Config.dateSelectionRequired) ? Config.dateSelectionRequired : [];
        if (dateSelectionRequired.indexOf(this.props.currentPageName) < 0) {
            dateSelection = null;
        }
        if (pageDropdownFields.length > 0) {
            if (currentPageNotFound) {
                $S.addElAt(pageDropdownFields, 0, <option key={pageDropdownFields.length}>Select page...</option>);
            }
            pageDropdownFields = <td><select className="form-control" onChange={this.onPageSelect} value={this.props.currentPageName}>{pageDropdownFields}</select></td>;
        }
        // Use when appControlData failed to load
        var selectUserText = null;
        if (sectionFields.length >= 1) {
            selectUserText = <td className="pr-5px">Select user</td>;
            sectionFields = <td><select className="form-control" onChange={this.onSectionSelect} value={this.props.data.currentSectionId}>{sectionFields}</select></td>;
        }
        var reloadButton = <td><button className="btn btn-primary" onClick={this.onReloadClick}>Reload</button></td>;
        if (this.props.data.firstTimeDataLoadStatus !== "completed" || this.props.currentPageName === "home" || this.props.data.sectionsData.length < 1) {
            selectUserText = null;
            sectionFields = null;
            pageDropdownFields = null;
            dateSelection = null;
            reloadButton = null;
            pageTab = null;
        }
        return (<div className="container SELECT-FILTER">
                <div><table><tbody><tr>
                    {selectUserText}
                    {sectionFields}
                    {pageDropdownFields}
                    {dateSelection}
                    {reloadButton}
                </tr></tbody></table></div>
                <div><ul className="nav nav-tabs">{pageTab}</ul></div>
            </div>);
    }
}

export default SelectFilter;

