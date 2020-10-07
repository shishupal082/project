import React from 'react';
import $S from "../../../interface/stack.js";
import DataHandler from "../../common/DataHandler";

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
    onSectionSelect(e) {
        var appStateCallback = this.props.methods.appStateCallback;
        var appDataCallback = this.props.methods.appDataCallback;
        var sectionId = e.currentTarget.value;
        DataHandler.OnSectionChange(appStateCallback, appDataCallback, sectionId);
    }
    gotoPage(pageName) {
        var pageUrl = null;
        for (var i = 0; i < this.props.data.dropdownFields.length; i++) {
            if (this.props.data.dropdownFields[i].name === pageName) {
                pageUrl = this.props.data.dropdownFields[i].url;
                break;
            }
        }
        if (pageUrl) {
            this.props.history.push(pageUrl);
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
    onReloadClick(e) {
        var appDataCallback = this.props.methods.appDataCallback;
        var appStateCallback = this.props.methods.appStateCallback;
        DataHandler.setData("csvDataLoadStatus", "not-started");
        DataHandler.PageComponentDidMount(appStateCallback, appDataCallback);
    }
    componentDidMount() {
        $S.log("SelectFilter:componentDidMount");
    }
    render() {
        var self = this;
        var pageDropdownFields = this.props.data.dropdownFields.map(function(el, i, arr) {
            return <option key={i} value={el.name}>{el.linkText}</option>
        });
        var sectionFields = this.props.data.availableSection.map(function(el, i, arr) {
            return <option key={i} value={el.id}>{el.text}</option>
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
        if (["entrybydate"].indexOf(this.props.data.pageName) < 0) {
            dateSelection = null;
        }
        return (<div className="container">
                <div><table><tbody><tr>
                    <td><select className="form-control" onChange={this.onSectionSelect} value={this.props.data.section}>{sectionFields}</select></td>
                    <td><select className="form-control" onChange={this.onPageSelect} value={this.props.data.pageName}>{pageDropdownFields}</select></td>
                    <td><div className="btn-group" role="group" aria-label="Basic example">
                            {dateSelection}
                        </div></td>
                    <td><button className="btn btn-primary" onClick={this.onReloadClick}>Reload</button></td>
                </tr></tbody></table></div>
                <div><ul className="nav nav-tabs">{pageTab}</ul></div>
            </div>);
    }
}

export default SelectFilter;

