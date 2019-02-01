type TaskState = 'running' | 'waiting';

interface Task {
    state: TaskState;
    task_id: string;
    progress_report?: Array<object> | object;
    start_time?: string;
}

declare function require(name: string): any;
