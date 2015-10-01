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