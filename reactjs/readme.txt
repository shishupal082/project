React
	- not a framework
	- It is a javascript library for building user interface

One way data flow
Used for one page application

Installation
-------------
Dependencies
	- nodejs, npm

Goto reactjs folder
>> npm install -g create-react-app
>> create-react-app reactapp

For css install
>> nom install tachyons
http://tachyons.io/docs/table-of-styles/

For random image
https://joeschmoe.io/api/v1/<name>

React components
----------------
1) Functional component (States not used)
	- Normal javascript
2) Class component (More powerfull, states can be used)

Class component (Demo.js)
***
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class Demo extends Component {
	render() {
		return <h1>Hello World </h1>;
	}
}

export default Demo;


React props
-----------
It is like properties
Can be passed from parent to child
Props can not be changed by child (immutable)
To change props states has to be used



React Routing
-------------
Change url without refresh and load page as per url
>> create-react-app reactrouter
>> npm install react-router-dom

<img src={logo} className="App-logo" alt="logo" />

import {BrowserRouter, Route, Switch} from 'react-router-dom';


App.js
----
<BrowserRouter />
<div>
	<Menu />
	<Switch>
		<Router path="/" component={Home} />
		<Router path="/about" component={About} />
		<Router path="/contact" component={Contact} />
	</Switch>
</div>
<BrowserRouter />

Menu.js
----
import {Link} from 'react-router-dom';

<ul>
	<li><Link to="/">Home</Link></li>
	<li><Link to="About">About</Link></li>
	<li><Link to="Contact">Contact</Link></li>
</ul>



