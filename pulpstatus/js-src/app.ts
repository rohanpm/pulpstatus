import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as Logger from 'js-logger';

import appBody from './app-body';

require('./app.css');

Logger.useDefaults();

ReactDOM.render(
    React.createElement(appBody),
    document.getElementById('appContainer')
);
