import React from 'react';
import ReactDOM from 'react-dom';
// import App from './indexApp/App';
// import App from './yard-s17/App';
// import App from './Demo/App';
// import App from './management/App';
// import App from './hooks/App';
import App from './account/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();