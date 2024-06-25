import React from 'react';
import {useHistory} from 'react-router';

function App (props) {
    var history = useHistory();
    console.log(history); // It is coming as undefined, hence it is not working
    function onClick() {
        console.log("OK");
    }
    return (<center>
        <div><h2>React hooks</h2></div>
        <div><button onClick={onClick}>Click me</button></div>
    </center>);
}

export default App;
