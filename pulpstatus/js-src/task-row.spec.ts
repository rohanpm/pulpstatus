import { expect } from "chai";
import * as ReactDOMServer from 'react-dom/server';

import TaskRow from "./task-row";
import { stepLabel } from "./task-row";

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


describe('stepLabel', () => {
    it('returns step % when available', () => {
        const step = {
            "items_total": 1000,
            "num_processed": 37,
            "step_type": "Do the thing",
            "state": "IN_PROGRESS",
        };

        const text = ReactDOMServer.renderToString(stepLabel(step));
        expect(text).to.contain("Do the thing (4%)");
        expect(text).to.contain("37 / 1000");
    });

});