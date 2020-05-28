import React from 'react';


class SelectUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.dateSelection = [];
        this.dateSelection.push({"name": "Daily", "value": "daily"});
        this.dateSelection.push({"name": "Monthly", "value": "monthly"});
        this.dateSelection.push({"name": "Yearly", "value": "yearly"});
        this.dateSelection.push({"name": "All", "value": "all"});
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
        var dateSelection = this.dateSelection.map(function(el, i, arr) {
            var className = "btn ";
            if (el.value === self.props.data.dateSelectionType) {
                className += "btn-secondary";
            } else {
                className += "btn-primary";
            }
            return <button key={i} type="button" className={className} onClick={self.onClick} value={el.value}>{el.name}</button>;
        });
        var seleUserOptions = <div className="row">
                    <div className="col"><table><tbody><tr>
                        <td>Select user</td>
                        <td><select onChange={this.onChange} value={this.props.data.currentUserName}>
                            {selectOptions}
                        </select></td>
                        <td><div className="btn-group" role="group" aria-label="Basic example">
                            {dateSelection}
                        </div></td>
                    </tr></tbody></table></div>
            </div>;
        if (this.props.data.userControlData.length < 2) {
            seleUserOptions = null;
        }
        return (seleUserOptions);
    }
}

export default SelectUser;

