import React from 'react';
import $S from "../../../interface/stack.js";


class SelectFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.onList1Select = this.onList1Select.bind(this);
        this.onList2Select = this.onList2Select.bind(this);
        this.onDateSelect = this.onDateSelect.bind(this);
        this.onReloadClick = this.onReloadClick.bind(this);
    }
    onList1Select(e) {
        this.props.methods.onList1Select(e);
    }
    onList2Select(e) {
        this.props.methods.onList2Select(e);
    }
    onDateSelect(e) {
        this.props.methods.onDateSelect(e);
    }
    onReloadClick(e) {
        this.props.methods.onReloadClick(e);
    }
    componentDidMount() {
        $S.log("SelectFilter:componentDidMount");
    }
    render() {
        var self = this;
        var list2ItemNotFound = true;
        var list1Text = <td className="pr-5px">{this.props.data.list1Text}</td>;
        var list1Dropdown = this.props.data.list1Data.map(function(el, i, arr) {
            return <option key={i} value={el.id}>{el.name}</option>
        });
        var list2Dropdown = this.props.data.list2Data.map(function(el, i, arr) {
            if (el.name === self.props.data.currentList2Id) {
                list2ItemNotFound = false;
            }
            return <option key={i} value={el.name}>{el.toText}</option>
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
        if (list1Dropdown.length >= 1) {
            list1Dropdown = <td><select className="form-control" onChange={this.onList1Select} value={this.props.data.currentList1Id}>{list1Dropdown}</select></td>;
        } else {
            list1Text = null;
        }
        if (list2Dropdown.length > 0) {
            if (list2ItemNotFound) {
                $S.addElAt(list2Dropdown, 0, <option key={list2Dropdown.length}>{this.props.data.list2Text}</option>);
            }
            list2Dropdown = <td><select className="form-control" onChange={this.onList2Select} value={this.props.data.currentList2Id}>{list2Dropdown}</select></td>;
        } else {
            list2Dropdown = null;
        }
        if (dateSelection.length > 0) {
            dateSelection = <td><div className="btn-group" role="group" aria-label="Basic example">
                            {dateSelection}
                        </div></td>;
        }
        if (this.props.data.dateSelectionRequiredPages.indexOf(this.props.data.currentList2Id) < 0) {
            dateSelection = null;
        }
        var reloadButton = <td><button className="btn btn-primary" onClick={this.onReloadClick}>Reload</button></td>;
        if (this.props.data.firstTimeDataLoadStatus !== "completed" || this.props.data.list1Data.length < 1) {
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

