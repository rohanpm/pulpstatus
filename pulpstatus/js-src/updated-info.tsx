import * as React from 'react';
import TimeAgo from 'react-timeago';
import * as Logger from 'js-logger';

import Spinner from './spinner';

interface UpdatedInfoProps {
    loading?: boolean;
    relativeTimes?: boolean;
    lastUpdated?: string;
};

export default class extends React.Component<UpdatedInfoProps> {
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
