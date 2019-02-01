import { expect } from "chai";

import Info from "./info";

describe('Info', () => {
    it('can render with no tasks', () => {
        const elem = new Info({});
        const rendered = elem.render();
        expect(!!rendered).to.be.true;
    });

    it('can render with some tasks', () => {
        const elem = new Info({
            tasks: [
                {state: 'running', task_id: 'task1'},
                {state: 'running', task_id: 'task2'},
                {state: 'waiting', task_id: 'task3'},
            ]
        });
        const rendered = elem.render();
        expect(!!rendered).to.be.true;
    });
});
