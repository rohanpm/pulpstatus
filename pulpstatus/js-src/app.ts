import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as Logger from 'js-logger';

import { AppBody } from './app-body';

require('./app.css');

Logger.useDefaults();

ReactDOM.render(
    React.createElement(AppBody),
    document.getElementById('appContainer')
);
