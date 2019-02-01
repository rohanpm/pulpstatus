import { expect } from "chai";

import AppBody from "./app-body";

describe('AppBody', () => {
    it('can be constructed', () => {
        const body = new AppBody();
        expect(body).to.be.an('object');
        expect(!!body).to.be.true;
    })

    it('can render', () => {
        const body = new AppBody();
        const rendered = body.render();
        expect(!!rendered).to.be.true;
    })
});
