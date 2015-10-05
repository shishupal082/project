var React = require("../../../../../static/gulp/src/js/react.js");
var TodoItem = require("./todoitem.js");
var TodoList = React.createClass({
	render : function(){
		var todoArray = this.props.todoList;
		var todoItem = [], self = this;
		todoItem = todoArray.map(function(el, index, arr){
			if(self.props.statusList.indexOf(el.status) != -1){
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

module.exports = TodoList;