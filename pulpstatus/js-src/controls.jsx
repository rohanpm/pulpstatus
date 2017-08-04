import React from 'react';

import EnvControl from './env-control.jsx';
import Spinner from './spinner.jsx';

export default class extends React.Component {
    chartsCheckbox() {
        return <label>
            <input type="checkbox" name="charts"
                    checked={this.props.charts}
                    autoComplete="off"
                    onChange={this.props.onChartsChange}
            />
            Charts?
        </label>;
    }

    render() {
        return <span className="controls">
            <EnvControl {...this.props}/>

            <label>
                <input type="checkbox" name="relativeTimes"
                       checked={this.props.relativeTimes}
                       autoComplete="off"
                       onChange={this.props.onRelativeTimesChange}
                />
                Relative times?
            </label>

            <label>
                <input type="checkbox" name="refresh"
                       checked={this.props.refresh}
                       autoComplete="off"
                       onChange={this.props.onRefreshChange}
                />
                Refresh automatically?
            </label>

            {this.chartsCheckbox()}

            <button type="button" onClick={this.props.onRefreshNow}
                    disabled={this.props.loading}>
                Refresh now
            </button>
        </span>;
    }
}