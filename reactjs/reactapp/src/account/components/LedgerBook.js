import React from 'react';
import Header from "./partial/Header";

import Api from "../../common/Api";
// import $S from "../../interface/stack.js";

class LedgerBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
    }
    render() {
        var LedgerTableTr = Api.generateFields(this.props, this.props.state.ledgerData.ledgerRowData);
        return (<div className="container">
                    <Header data={this.props.data} heading={this.props.heading}/>
                    <div className="row">
                        <h4>{this.props.state.ledgerData.companyName}</h4>
                        <table className="table table-bordered table-striped"><tbody>
                            {LedgerTableTr}
                        </tbody></table>
                    </div>
            </div>);
    }
}

export default LedgerBook;

