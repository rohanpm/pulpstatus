import { expect } from "chai";

import Error from "./error";

describe('Error', () => {
    it('can render', () => {
        const elem = new Error({error: 'quux'});
        const rendered = elem.render();
        expect(!!rendered).to.be.true;
    })
});
