import * as React from 'react';

import { EnvControl, EnvControlProps } from './env-control';

interface ControlsProps extends EnvControlProps {
    charts?: "full" | "" | number;
    onChartsChange?: React.ChangeEventHandler<HTMLSelectElement>;
    onRelativeTimesChange?: React.ChangeEventHandler<HTMLInputElement>;
    onRefreshChange?: React.ChangeEventHandler<HTMLInputElement>;
    onRefreshNow?: React.MouseEventHandler;
    relativeTimes?: boolean;
    refresh?: boolean;
    loading?: boolean;
};

export default class extends React.Component<ControlsProps> {
    chartsControl() {
        return <label>
            Charts
            {' '}
            <select value={this.props.charts} onChange={this.props.onChartsChange}>
                <option value="">None</option>
                <option value="full">Full</option>
                <option value={60 * 60}>1 hour</option>
                <option value={60 * 60 * 2}>2 hours</option>
                <option value={60 * 60 * 4}>4 hours</option>
                <option value={60 * 60 * 8}>8 hours</option>
                <option value={60 * 60 * 16}>16 hours</option>
            </select>
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
                Relative times
            </label>

            <label>
                <input type="checkbox" name="refresh"
                       checked={this.props.refresh}
                       autoComplete="off"
                       onChange={this.props.onRefreshChange}
                />
                Refresh automatically
            </label>

            {this.chartsControl()}

            <button type="button" onClick={this.props.onRefreshNow}
                    disabled={this.props.loading}>
                Refresh now
            </button>
        </span>;
    }
}