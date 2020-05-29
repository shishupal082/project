import React from 'react';


class SelectUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }
    componentDidMount() {
    }
    onChange(e) {
        this.props.methods.userChange(e.target.value);
    }
    onClick(e) {
        this.props.methods.onDateSelectionTypeChange(e.target.value);
    }
    render() {
        var self = this;
        var selectOptions = this.props.data.userControlData.map(function(el, i, arr) {
            return <option key={i} value={el.username}>{el.displayName}</option>
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
                        <select className="form-control" onChange={this.onChange} value={this.props.data.currentUserName}>
                            {selectOptions}
                        </select>
                    </div>
                </div></td>;
        }
        var seleUserOptions = <div className="row">
                    <div className="col"><table><tbody><tr>
                        {seleUserOptionsDropDown}
                        <td><div className="btn-group" role="group" aria-label="Basic example">
                            {dateSelection}
                        </div></td>
                    </tr></tbody></table></div>
            </div>;
        return (seleUserOptions);
    }
}

export default SelectUser;

