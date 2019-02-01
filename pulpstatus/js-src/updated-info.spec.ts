import { expect } from "chai";

import UpdatedInfo from "./updated-info";


describe('UpdatedInfo', () => {
    const loadingValues = [true, false];
    const relativeTimesValues = [true, false];
    const lastUpdatedValues = [undefined, '', '2019-02-01T06:40Z'];

    for (const loading of loadingValues) {
        for (const relativeTimes of relativeTimesValues) {
            for (const lastUpdated of lastUpdatedValues) {
                const testName = [
                    'can render with',
                    `loading=${loading}`,
                    `relativeTimes=${relativeTimes}`,
                    `lastUpdated=${lastUpdated}`,
                ].join(' ');

                it(testName, () => {
                    const rendered = new UpdatedInfo({
                        loading: loading,
                        relativeTimes: relativeTimes,
                        lastUpdated: lastUpdated,
                    }).render();
                    expect(!!rendered).to.be.true;
                });
            }
        }
    }
});
