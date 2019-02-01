export type TaskState = 'running' | 'waiting';

export interface Task {
    state: TaskState;
    progress_report?: Array<object> | object;
    start_time?: string;
};
