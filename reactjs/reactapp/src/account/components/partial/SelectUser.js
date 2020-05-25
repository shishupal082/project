import React from 'react';


class SelectUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount() {
    }
    onChange(e) {
        this.props.methods.userChange(e.target.value);
    }
    render() {
        var selectOptions = this.props.data.userControlData.map(function(el, i, arr) {
            return <option key={i} value={el.username}>{el.displayName}</option>
        });
        var seleUserOptions = <div className="row">
                    <div className="col"><table><tbody><tr>
                        <td>Select user</td>
                        <td><select onChange={this.onChange} value={this.props.data.currentUserName}>
                            {selectOptions}
                        </select></td>
                    </tr></tbody></table></div>
            </div>;
        if (this.props.data.userControlData.length < 2) {
            seleUserOptions = null;
        }
        return (seleUserOptions);
    }
}

export default SelectUser;

