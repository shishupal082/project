var React = require("../../../../../static/gulp/src/js/react.js");
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

module.exports = Header;