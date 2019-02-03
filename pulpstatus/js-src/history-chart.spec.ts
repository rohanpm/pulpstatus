import { expect } from "chai";

import HistoryChart from "./history-chart";


describe('HistoryChart', () => {
    it('can render when empty', () => {
        const elem = new HistoryChart(
            {
                historyKey: 'somekey',
                since: 'full'
            }
        );
        const rendered = elem.render();
        expect(!!rendered).to.be.true;
    });

    const sinceValues: Array<number|'full'> = ['full', 10000];
    for (const since of sinceValues) {
        it(`can render with history, since=${since}`, () => {
            const elem = new HistoryChart({
                historyKey: 'somekey',
                history: {
                    'otherkey-count': [['foo', 1], ['bar', 2]],
                    'somekey-count': [
                        ['2018-01', 10],
                        ['2018-02', 20],
                        ['2018-03', 30],
                    ],
                },
                since: since,
            });
            const rendered = elem.render();
            expect(!!rendered).to.be.true;
        });
    }
});
