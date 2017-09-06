import React from 'react';

export default class extends React.Component {
    render() {
        return <div className="error">
            Error fetching tasks, information may be incomplete:
            {' '}
            <span className="message">{this.props.error || 'Unknown error'}</span>
        </div>;
    }
};
