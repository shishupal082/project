import React from 'react';
import ReactDOM from 'react-dom';
// import App from './indexApp/App';
// import App from './yard-s17/App';
// import App from './Demo/App';
// import App from './management/App';
// import App from './hooks/App';
// import App from './account/App';
// import App from './search/App';
// import App from './auth/App';
// import App from './monitoring/App';
// import App from './assets/App';
// import App from './data-entry/App';
// import App from './data-display/App';
// import App from './attendance/App';
// import App from './ml2/App';
import App from './ftp/App';
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
