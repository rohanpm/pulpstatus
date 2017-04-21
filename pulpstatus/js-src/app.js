import ReactDOM from 'react-dom';
import React from 'react';
import appBody from './app-body.jsx';

require('./app.css');

ReactDOM.render(
    React.createElement(appBody),
    document.getElementById('appContainer')
);
