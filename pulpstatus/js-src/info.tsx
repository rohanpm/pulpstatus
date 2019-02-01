import * as React from 'react';
import * as Logger from 'js-logger';


interface InfoProps {
    tasks?: Array<Task>;
};

export default class extends React.Component<InfoProps> {
    render() {
        Logger.debug('render info');
        return <div className="info">{this.innerInfo()}</div>;
    }

    innerInfo() {
        return (
            <p>{this.taskCountText()}
            </p>
        );
    }

    taskCountText() {
        if (!this.props.tasks) {
            return '';
        }
        return 'There are ' + this.runningCount() + ' running and '
            + this.waitingCount() + ' waiting task(s).';
    }

    runningCount() {
        return this.tasksCount('running');
    }

    waitingCount() {
        return this.tasksCount('waiting');
    }

    tasksCount(state: TaskState) {
        return (this.props.tasks || []).reduce((accum, task) => {
            if (task.state == state) {
                return accum + 1;
            }
            return accum;
        }, 0);
    }
};
