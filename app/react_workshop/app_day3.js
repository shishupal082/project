/*components/commnet.js*/
var Comment = React.createClass({
	render : function(){
		return (<li>{this.props.comment.text}</li>);
	}
});
/*components/commnetForm.js*/
var CommentForm = React.createClass({
	addComment : function(e){
		e.preventDefault();
		var field = React.findDOMNode(this.refs.CommentBox);
		if(field.value){
			this.props.addComment({text : field.value});
		}
	},
	render : function(){
		return (<li><form>
			<input type="text" id="newCommentField" ref="CommentBox"/>
			<input type="submit" onClick={this.addComment} value="Add Comment"/>
			</form></li>);
	}
});
/*components/commnetList.js*/
var CommentList = React.createClass({
	addComment : function(comment){
		this.state.comments.push(comment);
		this.setState({comments : this.state.comments});
	},
	getInitialState : function(){
		return {comments : this.props.comments};
	},
	render : function(){
		var comments = this.state.comments.map(function(comment){
			return <Comment comment={comment} />;
		});
		comments.push(<CommentForm addComment={this.addComment}/>)
		return (<ul>{comments}</ul>);
	}
});
//App.js
var comments = [
	{text : "Hi"},
	{text : "Good Morning"}
];
React.render(<CommentList comments={comments}></CommentList>,
document.getElementById('commentList'));
