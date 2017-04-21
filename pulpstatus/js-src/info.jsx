import React from 'react';

export default class extends React.Component {
    render() {
        console.log('render info');
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

    tasksCount(state) {
        return this.props.tasks.reduce((accum, task) => {
            if (task.state == state) {
                return accum + 1;
            }
            return accum;
        }, 0);
    }
};
