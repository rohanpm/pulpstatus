import * as React from 'react';
import TimeAgo from 'react-timeago';
import * as Logger from 'js-logger';


interface TaskRowProps {
    task: Task;
    relativeTimes?: boolean;
    order: Array<string>;
};

interface Step {
    state: string;
    step_type: string;
    items_total?: number;
    num_processed?: number;
};

export function stepLabel(step: Step): JSX.Element {
    let label = step.step_type;
    const labelProps: React.HTMLProps<HTMLSpanElement> = {};

    // If a step has meaningful item counts, we can use that to show
    // percentage of completion for that step.
    // Note: most steps don't have a meaningful count.
    if (step.state == "IN_PROGRESS" && step.items_total && step.items_total > 1 && step.num_processed) {
        const pct = Math.round(step.num_processed / step.items_total * 100);
        label = `${label} (${pct}%)`;
        labelProps.title = `${step.num_processed} / ${step.items_total}`;
    }

    return <span {...labelProps}>{label}</span>;
}

type RenderFunction = () => JSX.Element;

export default class extends React.Component<TaskRowProps> {
    render() {
        return <tr>
            {this.renderCells()}
        </tr>;
    }

    getRenderFn(key: string): RenderFunction {
        const thisUnknown = (this as unknown);
        const thisLookup = (thisUnknown as {[key: string]: RenderFunction});
        const fnKey = 'render' + key[0].toUpperCase() + key.substr(1);
        return () => thisLookup[fnKey].apply(this);
    }

    renderCells() {
        return this.props.order.reduce((out, key) => {
            const fn = this.getRenderFn(key);
            const val = fn();
            out.push(<td key={key}>{val}</td>);
            return out;
        }, [] as Array<JSX.Element>);
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
        return this.props.task.task_type || '<unknown_type>';
    }

    renderTags() {
        const li = (this.props.task.tags || []).reduce((out, tag) => {
            out.push(<li key={tag}>{tag}</li>);
            return out;
        }, [] as Array<JSX.Element>);
        return <ul>{li}</ul>;
    }

    renderWorker() {
        const workerName = this.props.task.worker_name || '<unknown_worker>';
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

    progressNotAvailable() {
        return <span
            className="no-progress"
            title="This task has not reported any progress information.">
            n/a
        </span>;
    }

    renderProgress() {
        const report = this.props.task.progress_report || {};
        const keys = Object.keys(report);
        if (keys.length == 0) {
            return this.progressNotAvailable();
        }
        if (keys.length != 1) {
            Logger.warn('bad progress report', report);
            return '(something went wrong handling this progress report)';
        }

        try {
            const type = keys[0];
            const reportObject = report as any;
            const maybeSteps = reportObject[type];
            if (maybeSteps instanceof Array) {
                const steps = maybeSteps as Array<Step>;
                return <ul>
                    {steps.map((step, index) =>
                        <li key={index} className={'step step-' + step.state}>
                            {stepLabel(step)}
                        </li>
                    )}
                </ul>;
            }
        } catch(err) {
            Logger.warn('error rendering progress report', err);
        }
        return this.progressNotAvailable();
    }
}
