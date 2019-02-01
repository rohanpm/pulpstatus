import { expect } from "chai";

import AppBody from "./app-body";

describe('AppBody', () => {
    it('can be constructed', () => {
        const body = new AppBody({});
        expect(body).to.be.an('object');
        expect(!!body).to.be.true;
    });

    it('can render - empty', () => {
        const body = new AppBody({});
        const rendered = body.render();
        expect(!!rendered).to.be.true;
    });

    it('can render - with data', () => {
        const body = new AppBody({});
        Object.assign(body.state, {
            availableEnvs: ['env1', 'env2', 'env3'],
            env: 'env2',
        });
        const rendered = body.render();
        expect(!!rendered).to.be.true;
    });

    it('can render - with error', () => {
        const body = new AppBody({});
        Object.assign(body.state, {
            availableEnvs: ['env1', 'env2', 'env3'],
            env: 'env2',
            fetchError: 'something went wrong',
        });
        const rendered = body.render();
        expect(!!rendered).to.be.true;
    });

    it('can render - with charts', () => {
        const body = new AppBody({});
        Object.assign(body.state, {
            availableEnvs: ['env1', 'env2', 'env3'],
            env: 'env2',
            charts: 'full',
        });
        const rendered = body.render();
        expect(!!rendered).to.be.true;
    });
});
