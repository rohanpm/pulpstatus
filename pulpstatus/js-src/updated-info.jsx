import React from 'react';
import TimeAgo from 'react-timeago';
import Logger from 'js-logger';

import Spinner from './spinner.jsx';

export default class extends React.Component {
    render() {
        Logger.debug('render info');
        return <span className="updated-info">
            Updated: {this.updatedText()}
        </span>;
    }

    updatedText() {
        if (this.props.loading) {
            return <Spinner/>;
        }
        if (this.props.lastUpdated) {
            if (this.props.relativeTimes) {
                return <TimeAgo date={this.props.lastUpdated}/>;
            }
            return this.props.lastUpdated;
        }
        return ' (never updated)';
    }
}
