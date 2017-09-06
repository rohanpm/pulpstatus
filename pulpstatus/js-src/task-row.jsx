import React from 'react';
import TimeAgo from 'react-timeago';
import Logger from 'js-logger';

export default class extends React.Component {
    render() {
        return <tr>
            {this.renderCells()}
        </tr>;
    }

    renderCells() {
        return this.props.order.reduce((out, key) => {
            const fn = 'render' + key[0].toUpperCase() + key.substr(1);
            const val = this[fn].apply(this);
            out.push(<td key={key}>{val}</td>);
            return out;
        }, []);
    }

    renderId() {
        return this.props.task['task_id'] || '<unknown_id>';
    }

    renderStarted() {
        const startTime = this.props.task['start_time'];
        if (startTime && this.props.relativeTimes) {
            return <TimeAgo date={startTime}/>;
        }
        return startTime;
    }

    renderType() {
        return this.props.task['task_type'] || '<unknown_type>';
    }

    renderTags() {
        const li = (this.props.task['tags'] || []).reduce((out, tag) => {
            out.push(<li key={tag}>{tag}</li>);
            return out;
        }, []);
        return <ul>{li}</ul>;
    }

    renderWorker() {
        const workerName = this.props.task['worker_name'] || '<unknown_worker>';
        // Simplify it to strip redundant info
        var [name, host] = workerName.split('@');
        if (!host) {
            return name;
        }
        if (name.startsWith('reserved_resource_worker-')) {
            name = name.substr('reserved_resource_worker-'.length);
        }
        const [shortHost, rest] = host.split('.', 1);
        return [name, shortHost].join('@');
    }

    renderProgress() {
        const report = this.props.task.progress_report || {};
        const keys = Object.keys(report);
        if (keys.length == 0) {
            return <span
                className="no-progress"
                title="This task has not reported any progress information.">
                n/a
            </span>;
        }
        if (keys.length != 1) {
            Logger.warn('bad progress report', report);
            return '(something went wrong handling this progress report)';
        }
        const type = keys[0];
        const steps = report[type];
        return <ul>
            {steps.map((step, index) =>
                <li key={index} className={'step step-' + step.state}>
                    {step.step_type}
                </li>
            )}
        </ul>;
    }
}
