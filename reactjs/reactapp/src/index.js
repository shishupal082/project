import React from 'react';
import ReactDOM from 'react-dom';
// import App from './indexApp/App';
// import App from './yard-s17/App';
// import App from './Demo/App';
// import App from './DemoRouter/App';
// import App from './management/App';
// import App from './hooks/App';
// import App from './account/App';
// import App from './auth-demo/App';
// import App from './assets/App';
// import App from './data-entry/App';
// import App from './data-display/App';
// import App from './ml2/App';
// import App from './ftp/App';
// import App from './project-tracking/App';
// import App from './auth/App';
// import App from './rcc/App';
// import App from './attendance/App';
// import App from './google_login/App';
// import App from './track-plan/App';
// import App from './mastersheet/App';
import App from './scan-dir/App';
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
