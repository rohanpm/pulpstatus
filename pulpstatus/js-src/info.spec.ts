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
                {state: 'running'},
                {state: 'running'},
                {state: 'waiting'},
            ]
        });
        const rendered = elem.render();
        expect(!!rendered).to.be.true;
    });
});
