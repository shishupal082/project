To install dependencies from package.json
------------------------------------------
npm i

------------------------------------------
Before development
sync required js files to make updated dependent js files
>> sh sync.sh

After development run
>> sh build.sh

It will create build and put all js code in desired directory

------------------------------------------
Changing index.js filename for app start

------------------------------------------
Load js and css files outside of src directory

------------------------------------------
Remove //# sourceMappingURL=2.caa3872d.chunk.js.map file line entry from build file
Using sed command
>> sed -i  ''  '2s/.*//' build/2.caa3872d.chunk.js

------------------------------------------
Read global variable in React Application
inside index.html

>> window.var1 = var1

inside App.js
>> var var1 = window.var1;
------------------------------------------

https://www.taniarascia.com/getting-started-with-react/
https://reactjs.org/tutorial/tutorial.html

React
	- not a framework
	- It is a javascript library for building user interface

One way data flow
Used for one page application

Installation
-------------
Dependencies
	- nodejs, npm

>> npm install -g create-react-app

Goto reactjs folder
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
<BrowserRouter>
<div>
	<Menu />
	<Switch>
		<Router path="/" component={Home} />
		<Router path="/about" component={About} />
		<Router path="/contact" component={Contact} />
	</Switch>
</div>
</BrowserRouter>

Menu.js
----
import {Link} from 'react-router-dom';

<ul>
	<li><Link to="/">Home</Link></li>
	<li><Link to="About">About</Link></li>
	<li><Link to="Contact">Contact</Link></li>
</ul>


Error handling
------------------
>> npm install -g create-react-app
npm ERR! Unexpected end of JSON input while parsing near '...registry.npmjs.org/cr'

Solutions
----------
Check proper permission of /usr/local/lib/node_modules
>> cd /usr/local/lib/
>> ls -ltrh
>> chmod 777 node_modules

Still not working
---
>> npm cache clean --force
>> npm install -g @angular/cli@latest

***** Now working

Error handling
------------------
>> create-react-app reactapp

npm ERR! Unexpected end of JSON input while parsing near '...a512-MrehJzXWhZGjwASB'

Solutions
----------
>> npm cache clean --force

11.08.2021
--------------------------
Error in >> npm start
events.js:292
      throw er; // Unhandled 'error' event

Rename node_modules folder as temp_node_modules and try
>> npm install

Restart system --> it should be working now

