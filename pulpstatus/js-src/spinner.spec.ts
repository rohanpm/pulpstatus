import { expect } from "chai";

import Spinner from "./spinner";

describe('Spinner', () => {
    it('can be constructed', () => {
        const spinner = new Spinner();
        expect(spinner).to.be.an('object');
        expect(!!spinner).to.be.true;
    })
});
