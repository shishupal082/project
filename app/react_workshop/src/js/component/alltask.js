var React = require("../../../../../static/gulp/src/js/react.js");
var TodoList = require("./todolist.js");;
var Actions = require("../actions/actions.js");

var AllTask = React.createClass({
	componentDidMount:function(){
		Actions.loadAlltodos();
		console.log("AllTask componentDidMount");
	},
	render : function(){
		var pendingStatusList = ["pending", "in_progress"];
		var completedStatusList = ["completed"];
		var todoItem = <TodoList todoList={this.props.todoList} statusList={pendingStatusList}></TodoList>;
		var compltedItem = <TodoList todoList={this.props.todoList} statusList={completedStatusList}></TodoList>;;
		return (<div className="container"><div className="row">
			<div className="col-md-6">
				<div><h3>Todo List</h3></div>
				<div>{todoItem}</div>
			</div>
			<div className="col-md-6">
				<div><h3>Completed List</h3></div>
				<div>{compltedItem}</div>
			</div>
		</div></div>);
	}
});

module.exports = AllTask;