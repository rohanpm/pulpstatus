import ReactDOM from 'react-dom';
import React from 'react';
import Logger from 'js-logger';

import appBody from './app-body.jsx';

require('./app.css');

Logger.useDefaults();

ReactDOM.render(
    React.createElement(appBody),
    document.getElementById('appContainer')
);
