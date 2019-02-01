export type TaskState = 'running' | 'waiting';

export interface Task {
    state: TaskState;
};
