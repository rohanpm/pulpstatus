import { expect } from "chai";

import { EnvControl } from "./env-control";

describe('EnvControl', () => {
    it('can be constructed', () => {
        const elem = new EnvControl({
            env: 'test-env',
            availableEnvs: ['test-env'],
            onEnvChange: (x) => x
        });
        expect(elem).to.be.an('object');
        expect(!!elem).to.be.true;
    })

    it('can render', () => {
        const elem = new EnvControl({
            env: 'test-env',
            availableEnvs: ['test-env'],
            onEnvChange: (x) => x
        });
        const rendered = elem.render();
        expect(!!rendered).to.be.true;
    })
});
