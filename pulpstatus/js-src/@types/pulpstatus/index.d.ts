type TaskState = 'running' | 'waiting';

// Map-like interface for use with object instances
// (not ES6 map)
interface ObjectMap<T> {
    [key: string]: T;
}

type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
    [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> { }

interface Task {
    state: TaskState;
    task_id: string;
    progress_report?: JSONObject | JSONArray;
    start_time?: string;
    task_type?: string;
    worker_name?: string;
    tags?: Array<string>;
}

declare type HistoryPoint = [string, number];
declare type HistoryMap = ObjectMap<Array<HistoryPoint>>;

interface RawHistoryDatum {
    time: string;
    key: string;
    value: number;
}

interface RawHistory {
    keys: Array<string>;
    times: Array<string>;
    data: Array<RawHistoryDatum>;
}

declare function require(name: string): any;
