import React from 'react';
import $S from "../../../interface/stack.js";

import AppComponentWrapper from "./AppComponentWrapper";


class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.dropDownChange = this.dropDownChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.pageComponentDidMount = this.pageComponentDidMount.bind(this);
        this.getTabDisplayText = this.getTabDisplayText.bind(this);
        // this.methods = {
        //     onClick: this.onClick,
        //     onChange: this.onChange,
        //     dropDownChange: this.dropDownChange,
        //     pageComponentDidMount: this.pageComponentDidMount,
        //     getTabDisplayText: this.getTabDisplayText
        // };
    }
    _callAppMethod(method, arg) {
        if ($S.isFunction(method)) {
            return method(arg);
        }
        return arg;
    }
    onClick(e) {
        this._callAppMethod(this.props.methods.onClick, e);
    }
    onChange(e) {
        this._callAppMethod(this.props.methods.onChange, e);
    }
    dropDownChange(e) {
        this._callAppMethod(this.props.methods.dropDownChange, e);
    }
    onFormSubmit(e) {
        this._callAppMethod(this.props.methods.onFormSubmit, e);
    }
    pageComponentDidMount(pageName) {
        this._callAppMethod(this.props.methods.pageComponentDidMount, pageName);
    }
    getTabDisplayText(tabName) {
        return this._callAppMethod(this.props.methods.getTabDisplayText, tabName);
    }
    componentDidMount() {
        $S.log("AppComponent:componentDidMount");
        if ($S.isFunction(this.props.methods.registerChildAttribute)) {
            this.props.methods.registerChildAttribute("history", this.props.history);
        }
    }
    render() {
        return (<AppComponentWrapper data={this.props.data} history={this.props.history}
            currentPageName={this.props.currentPageName} renderFieldRow={this.props.renderFieldRow}
            methods={this.props.methods} onClick={this.onClick} onFormSubmit={this.onFormSubmit} onChange={this.onChange} dropDownChange={this.dropDownChange}/>);
    }
}

export default AppComponent;

