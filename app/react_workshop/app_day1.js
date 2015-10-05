var h1 = React.createElement('h1', null, 'Hello world');
var h2 = <h2 id="hellow_world" className="hello-world">Hello world</h2>;
var Header3 = React.createClass({
	render : function(){
		var msg = this.props.msg,
			msg_header = this.props.msg_header;
		return <h3 id="hellow_world" className="hello-world">Hello world</h3>;
	}
});
var h3 = React.createElement(Header3);
var Header4 = React.createClass({
	render : function(){
		var msg = this.props.msg,
			msg_header = this.props.msg_header;
		return <h4 id="hellow_world" className="hello-world">{this.props.message}</h4>;
	}
});
var Header5 = React.createClass({
	render : function(){
		var message = this.props.message,
			id = this.props.id;
		return <h5 id={id} className="hello-world">{message}</h5>;
	}
});
React.render(h1, document.getElementById('example1'));
React.render(h2, document.getElementById('example2'));
React.render(h3, document.getElementById('example3'));
React.render(<Header4 message="Hello World"/>, document.getElementById('example4'));
React.render(<Header5 id="hellow_world" message="Hello World"></Header5>, document.getElementById('example5'));