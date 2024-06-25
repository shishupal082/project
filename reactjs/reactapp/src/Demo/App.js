import React from 'react';
import Parent from './Parent';
import Parent2 from './Parent2';
function App (props) {
    return (<div>
        <div><center><h2>Demo App</h2></center></div>
        <hr/>
        <center><Parent/></center>
        <hr/>
        <center><Parent2/></center>
    </div>);
}

export default App;
