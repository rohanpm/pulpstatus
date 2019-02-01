import { expect } from "chai";

import TaskRow from "./task-row";

const TEST_ORDER = ['id', 'started', 'type', 'tags', 'worker', 'progress'];


describe('TaskRow', () => {
    it('can render', () => {
        const elem = new TaskRow({
            order: TEST_ORDER,
            task: {
                state: 'running',
                start_time: '2019-01-01',
                task_id: 'test-task',
            }
        });
        const rendered = elem.render();
        expect(!!rendered).to.be.true;
    });
});
