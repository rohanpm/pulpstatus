import { expect } from "chai";

import TaskTable from "./task-table";

const TEST_ORDER = ['id', 'started', 'type', 'tags', 'worker', 'progress'];


describe('TaskTable', () => {
    it('can render when empty', () => {
        const elem = new TaskTable({});
        const rendered = elem.render();
        expect(!!rendered).to.be.true;
    });

    it('can render with tasks', () => {
        const elem = new TaskTable({
            relativeTimes: true,
            tasks: [
                {task_id: 'some-task', state: 'waiting'},
                {task_id: 'other-task', state: 'running'},
                {task_id: 'yet-another-task', state: 'running'},
            ]
        });
        const rendered = elem.render();
        expect(!!rendered).to.be.true;
    });
});
