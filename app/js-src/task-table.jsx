import React from 'react';
import TaskRow from './task-row.jsx';

const TABLE_ORDER = [
    'id',
    'started',
    // type seems not useful because it is implied by other columnsmt
    // 'type',
    'tags',
    'worker',
    'progress',
];

const TABLE_HEADERS = {
    id: 'Task',
    started: 'Started',
    type: 'Type',
    tags: 'Tags',
    worker: 'Worker',
    progress: 'Progress',
};

export default class extends React.Component {
    render() {
        return <table>
            <thead>
            <tr>
                {this.renderHeaders()}
            </tr>
            </thead>
            <tbody>
            {this.renderRows()}
            </tbody>
        </table>;
    }

    renderHeaders() {
        return TABLE_ORDER.reduce((out, key) => {
            const text = TABLE_HEADERS[key];
            out.push(<td key={key}>{text}</td>);
            return out;
        }, []);
    }

    renderRows() {
        const tasks = this.filteredTasks();
        if (tasks.length == 0) {
            return this.renderEmptyBody();
        }
        return tasks.reduce((out, task) => {
            out.push(<TaskRow
                relativeTimes={this.props.relativeTimes}
                key={task.task_id}
                task={task}
                order={TABLE_ORDER}/>);
            return out;
        }, []);
    }

    renderEmptyBody() {
        return <tr>
            <td className="empty" colSpan={TABLE_ORDER.length}>
                (there are no tasks to display)
            </td>
        </tr>;
    }

    filteredTasks() {
        const allTasks = this.props.tasks || [];
        return allTasks.filter((task) => task['state'] == 'running');
    }
}
