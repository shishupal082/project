import React from 'react';

import Api from "../../../common/Api";
// import $S from "../../interface/stack.js";

class LedgerBookRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
    }
    render() {
        var accountDisplayName = this.props.accountDisplayName;
        var LedgerTableTr = Api.generateFields(this.props, this.props.fields);
        return (<div className="row"><div className="col">
                    <p><b>{accountDisplayName}</b></p>
                    <table className="table table-bordered table-striped"><tbody>
                        {LedgerTableTr}
                    </tbody></table>
            </div></div>);
    }
}

export default LedgerBookRow;

