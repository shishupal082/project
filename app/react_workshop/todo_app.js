var Header = React.createClass({
	render : function(){
		return (<div className="container">
			<div className="row">
				<div className="col-md-6"><h1>Todo List</h1></div>
				<div className="col-md-6"></div>
			</div>
		</div>);
	}
});
var TodoItem = React.createClass({
	componentDidMount: function() {
		console.log("componentDidMount TodoItem");
	},
	getInitialState : function(){
		return {
			name : this.props.todo.name,
			isComplete : this.props.todo.isComplete,
			status : this.props.todo.isComplete ? "done" : "pending"
		};
	},
	todoAction : function(){
		this.props.todo.isComplete = !this.props.todo.isComplete;
		this.props.todo.status = this.state.isComplete ? "done" : "pending";
		this.setState(this.props.todo);
		renderBody();
	},
	render : function(){
		var todoName = this.state.name;
		var todoStatus = this.state.status;
		var className = "list-group-item ";
		className = className + todoStatus;
		return (
			<li className={className} onClick={this.todoAction}>{todoName} {todoStatus}</li>
		);
	}
});
var TodoList = React.createClass({
	render : function(){
		var todoArray = this.props.todoList;
		var todoItem = [], self = this;
		todoItem = todoArray.map(function(el, index, arr){
			if(el.isComplete === self.props.isComplete){
				return <TodoItem todo={el}></TodoItem>;
			}
			return false;
		});
		if(!todoItem.length){
			todoItem = <div></div>;
		}
		return (
			<div><ul className="list-group">{todoItem}</ul></div>
		);
	}
});
var AllTask = React.createClass({
	render : function(){
		var todoItem = <TodoList todoList={this.props.todoList} isComplete={false}></TodoList>;
		var compltedItem = <TodoList todoList={this.props.todoList} isComplete={true}></TodoList>;;
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
var TODOLIST = [
	{name : "Item 1", status : "done", isComplete : false},
	{name : "Item 2", status : "pending", isComplete : true}
];
React.render(<Header/>, document.getElementById('header_container'));
function renderBody () {
	React.render(<AllTask todoList={TODOLIST}/>, document.getElementById('body_container'));
	return true;
}
renderBody();