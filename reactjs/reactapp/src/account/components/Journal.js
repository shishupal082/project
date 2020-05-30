import React from 'react';
import Header from "./partial/Header";
import Errors from "./partial/Errors";

import Api from "../../common/Api";
// import $S from "../../interface/stack.js";

class Journal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
    }
    render() {
        var self = this;
        var JournalTableTr = this.props.renderFieldRow.map(function(el, i, arr) {
            return Api.generateFields(self.props, el);
        });
        return (<div className="container">
                    <Header data={this.props.data} heading={this.props.heading} methods={this.props.methods}/>
                    <Errors data={this.props.data}/>
                    <div className="row"><div className="col">
                        <table className="table2 table-bordered table-striped"><tbody>
                            {JournalTableTr}
                        </tbody></table>
                    </div></div>
            </div>);
    }
}

export default Journal;

