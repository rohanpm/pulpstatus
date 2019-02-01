import { expect } from "chai";

import Controls from "./controls";

describe('Controls', () => {
    it('can render', () => {
        const elem = new Controls({env: 'foo', availableEnvs: ['foo', 'bar', 'baz']});
        const rendered = elem.render();
        expect(!!rendered).to.be.true;
    })
});
