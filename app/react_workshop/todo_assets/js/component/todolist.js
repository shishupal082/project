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