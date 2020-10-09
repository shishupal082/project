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
    }
    componentDidMount() {
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
        var selectOptions = this.props.data.userControlData.map(function(el, i, arr) {
            return <option key={i} value={el.username}>{el.displayName}</option>
        });
        var pageOptions = this.props.data.dropdownFields.map(function(el, i, arr) {
            if (el.name === self.props.currentPageName) {
                isCurrentPageNotFound = false;
            }
            return <option key={i} value={el.name}>{el.toText}</option>
        });
        var dateSelection = this.props.data.dateSelectionFields.map(function(el, i, arr) {
            var className = "btn ";
            if (el.value === self.props.data.selectedDateType) {
                className += "btn-secondary";
            } else {
                className += "btn-primary";
            }
            return <button key={i+1} type="button" className={className} onClick={self.onDateOptionClick} value={el.value}>{el.name}</button>;
        });
        var seleUserOptionsDropDown = null;
        if (this.props.data.userControlData.length > 1) {
            seleUserOptionsDropDown = <td><div className="form-group row m-0">
                    <label className="col-sm-4 col-form-label">Select user</label>
                    <div className="col-sm-8">
                        <select className="form-control" onChange={this.onUserChange} value={this.props.data.currentUserName}>
                            {selectOptions}
                        </select>
                    </div>
                </div></td>;
        }
        var pageOptionsDropDown = null;
        if (isCurrentPageNotFound) {
            $S.addElAt(pageOptions, 0, <option key={pageOptions.length}>Select page...</option>);
        }
        if (pageOptions.length > 1) {
            pageOptionsDropDown = <td><div className="form-group row m-0">
                    <div>
                        <select className="form-control" onChange={this.onPageChange} value={this.props.currentPageName}>
                            {pageOptions}
                        </select>
                    </div>
                </div></td>;
        }
        var reloadTextClass = "btn btn-primary";
        if (this.props.data.firstTimeDataLoadStatus !== "completed") {
            seleUserOptionsDropDown = null;
            reloadTextClass += " d-none";
        }
        var dateSelectionRequired = $S.isArray(Config.dateSelectionRequired) ? Config.dateSelectionRequired : [];
        if (dateSelectionRequired.indexOf(this.props.currentPageName) < 0 && dateSelectionRequired.length > 0) {
            dateSelection = null;
        }
        var seleUserOptions = <div className="row">
                    <div className="col"><table><tbody><tr>
                        {seleUserOptionsDropDown}
                        {pageOptionsDropDown}
                        <td><div className="btn-group" role="group" aria-label="Basic example">
                            {dateSelection}
                        </div></td>
                        <td><button className={reloadTextClass} onClick={this.onReloadClick}>Reload</button></td>
                    </tr></tbody></table></div>
            </div>;
        return (seleUserOptions);
    }
}

export default SelectUser;

