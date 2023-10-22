import React from 'react';

class Child2 extends React.Component {
    /* constructor required for state and binding methods */
    constructor(props) {
        super(props);
        this.renderCount = 1; //chnage in this will not count re render
        this.state = {
            btnStatus: false
        };
        this.onChildBtnClick = this.onChildBtnClick.bind(this);
        console.log("Child2 constructor");
    }
    ToggleBtnStatus() {
        this.setState({
            btnStatus: !this.state.btnStatus
        });
    }
    onChildBtnClick() {
        console.log("Child2 ChildClick");
        this.ToggleBtnStatus();
        this.props.onChildBtnClick();
    }
    componentDidMount() {
        console.log("Child2 componentDidMount");
        if (typeof this.props.getChildExposedMethod === "function") {
            this.props.getChildExposedMethod(this.ToggleBtnStatus.bind(this));
        }
        if (typeof this.props.btnStatus === "boolean") {
            this.setState({
                btnStatus: this.props.btnStatus
            });
        }
    }
    render() {
        console.log("Child2 Render: " + this.renderCount++);
        var className="btn ";
        className += this.state.btnStatus ? "btn-primary" : "btn-success";
        return (<div>
            <button className={className} onClick={this.onChildBtnClick}>Child Button</button>
        </div>);
    }
}

export default Child2;
