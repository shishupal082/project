import React from 'react';
import $S from "../../../interface/stack.js";


class SelectFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
        $S.log("SelectFilter:componentDidMount");
    }
    render() {
        var self = this;
        var list1Data = this.props.data.list1Data;
        var list2Data = this.props.data.list2Data;
        var dateSelection = this.props.data.dateSelection;
        var dateSelectionRequiredPages = this.props.data.dateSelectionRequiredPages;
        if (!$S.isArray(list1Data)) {
            list1Data = [];
        }
        if (!$S.isArray(list2Data)) {
            list2Data = [];
        }
        if (!$S.isArray(dateSelection)) {
            dateSelection = [];
        }
        if (!$S.isArray(dateSelectionRequiredPages)) {
            dateSelectionRequiredPages = [];
        }
        var list2ItemNotFound = true;
        var list1Text = null;
        if ($S.isString(this.props.data.list1Text) && this.props.data.list1Text.length > 0) {
            list1Text = <td className="pr-5px">{this.props.data.list1Text}</td>;
        }
        var list1Dropdown = list1Data.map(function(el, i, arr) {
            return <option key={i} value={el.id}>{el.name}</option>
        });
        var list2Dropdown = list2Data.map(function(el, i, arr) {
            if (el.name === self.props.data.currentList2Id) {
                list2ItemNotFound = false;
            }
            return <option key={i} value={el.name}>{el.toText}</option>
        });
        dateSelection = dateSelection.map(function(el, i, arr) {
            var className = "btn ";
            if (el.value === self.props.data.selectedDateType) {
                className += "btn-secondary";
            } else {
                className += "btn-primary";
            }
            return <button key={i} type="button" className={className} name="date-select" onClick={self.props.methods.onClick} value={el.value}>{el.name}</button>;
        });
        if (list1Dropdown.length >= 1) {
            list1Dropdown = <td><select className="form-control" name="list1-select" onChange={this.props.methods.dropDownChange} value={this.props.data.currentList1Id}>{list1Dropdown}</select></td>;
        } else {
            list1Text = null;
        }
        if (list2Dropdown.length > 0) {
            if (list2ItemNotFound) {
                $S.addElAt(list2Dropdown, 0, <option key={list2Dropdown.length}>{this.props.data.list2Text}</option>);
            }
            list2Dropdown = <td><select className="form-control" name="list2-select" onChange={this.props.methods.dropDownChange} value={this.props.data.currentList2Id}>{list2Dropdown}</select></td>;
        } else {
            list2Dropdown = null;
        }
        if (dateSelection.length > 0) {
            dateSelection = <td><div className="btn-group" role="group" aria-label="Basic example">
                            {dateSelection}
                        </div></td>;
        }
        if (dateSelectionRequiredPages.indexOf(this.props.data.currentList2Id) < 0) {
            dateSelection = null;
        }
        var reloadButton = <td><button className="btn btn-primary" name="filter-reload" value="reload" onClick={this.props.methods.onClick}>Reload</button></td>;
        if (this.props.data.firstTimeDataLoadStatus !== "completed" || list1Data.length < 1) {
            list1Text = null;
            list1Dropdown = null;
            list2Dropdown = null;
            dateSelection = null;
            reloadButton = null;
        }
        return (<div className="SELECT-FILTER">
                <div><table><tbody><tr>
                    {list1Text}
                    {list1Dropdown}
                    {list2Dropdown}
                    {dateSelection}
                    {reloadButton}
                </tr></tbody></table></div>
            </div>);
    }
}

export default SelectFilter;

