import React from 'react';

class Child extends React.Component {
    /* constructor required for state and binding methods */
    constructor(props) {
        super(props);
        this.renderCount = 1; //chnage in this will not count re render
        this.state = {
            btnStatus: false
        };
        this.checkboxStatus = false;
        this.handleChildClick = this.handleChildClick.bind(this);
        this.checkboxClick = this.checkboxClick.bind(this);
        console.log("constructor");
    }
    ToggleBtnStatus() {
        this.setState({
            btnStatus: !this.state.btnStatus
        });
    }
    handleChildClick() {
        console.log("ChildClick");
        this.ToggleBtnStatus();
        if (!this.checkboxStatus) {
            this.props.onBtnClick();
        }
    }
    checkboxClick() {
        this.checkboxStatus = !this.checkboxStatus
    }
    componentDidMount() {
        console.log("componentDidMount");
        if (typeof this.props.btnStatus == "boolean" && this.props.btnStatus !== this.state.btnStatus) {
            /* this.props.btnStatus !== this.state.btnStatus
                Above check is required for stopping un necessary rendering
            */
            this.setState({
                btnStatus: this.props.btnStatus
            });
        }
    }
    render() {
        console.log("Child Render: " + this.renderCount++);
        var className="btn ";
        className += this.state.btnStatus ? "btn-primary" : "btn-success";
        return (<div>
            <button className={className} onClick={this.handleChildClick}>Child Button</button>
            <label>&nbsp;&nbsp;Decouple </label><input type="checkbox" onClick={this.checkboxClick}/>
        </div>);
    }
}

export default Child;
