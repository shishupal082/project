import React from 'react';

import $S from "../../../interface/stack";

import Config from "../../common/Config";

class SelectUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.onClick = this.onClick.bind(this);
        this.onReloadClick = this.onReloadClick.bind(this);
        this.onUserChange = this.onUserChange.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
    }
    componentDidMount() {
    }
    onUserChange(e) {
        this.props.methods.userChange(e.target.value);
    }
    onPageChange(e) {
        var pageName = e.target.value;
        var pages = Config.pages;
        if ($S.isString(pages[pageName])) {
            this.props.history.push(pages[pageName]);
        }
    }
    onClick(e) {
        this.props.methods.onDateSelectionTypeChange(e.target.value);
    }
    onReloadClick(e) {
        this.props.methods.userChange(this.props.data.currentUserName);
    }
    render() {
        var self = this;
        var homeFields = $S.clone(Config.homeFields);
        var isCurrentPageNotFound = true;
        var selectOptions = this.props.data.userControlData.map(function(el, i, arr) {
            return <option key={i} value={el.username}>{el.displayName}</option>
        });
        var pageOptions = homeFields.map(function(el, i, arr) {
            if (el.name === self.props.currentPageName) {
                isCurrentPageNotFound = false;
            }
            return <option key={i} value={el.name}>{el.toText}</option>
        });
        var dateSelection = this.props.data.dateSelection.map(function(el, i, arr) {
            var className = "btn ";
            if (el.value === self.props.data.dateSelectionType) {
                className += "btn-secondary";
            } else {
                className += "btn-primary";
            }
            return <button key={i} type="button" className={className} onClick={self.onClick} value={el.value}>{el.name}</button>;
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
        var seleUserOptions = <div className="row">
                    <div className="col"><table><tbody><tr>
                        {seleUserOptionsDropDown}
                        {pageOptionsDropDown}
                        <td><div className="btn-group" role="group" aria-label="Basic example">
                            {dateSelection}
                        </div></td>
                        <td><button className="btn btn-primary" onClick={this.onReloadClick}>Reload</button></td>
                    </tr></tbody></table></div>
            </div>;
        return (seleUserOptions);
    }
}

export default SelectUser;

