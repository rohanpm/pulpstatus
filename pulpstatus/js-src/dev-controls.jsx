import React from 'react';

export default class extends React.Component {
    render() {
        return <span className="dev-controls">
            <button type="button" onClick={this.props.onCannedData}
                    disabled={this.props.loading}>
                Load canned data
            </button>
        </span>;
    }
}