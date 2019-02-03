import { expect } from "chai";

import { AppBody, getMax } from "./app-body";


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


describe('getMax', () => {
    it('returns null for undefined', () => {
        expect(getMax(undefined)).to.be.null;
    });

    it('returns null for empty', () => {
        expect(getMax([])).to.be.null;
    });

    it('returns max value for numbers', () => {
        expect(getMax([-4, 30, 10, 42, -8, 9])).to.equal(42);
    });

    it('returns max value for strings', () => {
        expect(getMax([
            '2007-03-01T14:00:00Z',
            '2017-03-01T11:00:00Z',
            '2027-03-01T13:00:00Z',
            '1998-03-01T14:00:00Z',
            '1995-03-01T16:00:00Z',
        ])).to.equal('2027-03-01T13:00:00Z');
    });
});


describe('AppBody.aggregateWith', () => {
    it('aggregates correctly', () => {
        const body = new AppBody({});
        const existingData: HistoryMap = {
            durian: [
                ['2018-01', 0.5],
                ['2018-06', 0.5],
            ],
            orange: [
                ['2017-01', 33],
                ['2020-01', 66],
            ],
        };
        const input: RawHistory = {
            keys: ['orange', 'apple', 'banana'],
            times: ['2018-01', '2018-02', '2019-01', '2019-04'],
            data: [
                {time: 2, key: 1, value: 100},
                {time: 1, key: 1, value: 50},
                {time: 3, key: 0, value: 30},
            ],
        };
        const expectedResult: HistoryMap = {
            durian: [
                ['2018-01', 0.5],
                ['2018-06', 0.5],
            ],
            orange: [
                ['2017-01', 33],
                ['2019-04', 30],
                ['2020-01', 66],
            ],
            apple: [
                ['2018-02', 50],
                ['2019-01', 100],
            ],
        };
        const result = body.aggregateWith(existingData, input);
        expect(result).to.deep.equal(expectedResult);
    });
});


describe('AppBody.stateFromSearch', () => {
    it('ignores unexpected fields', () => {
        const body = new AppBody({});
        body.location.search = '?foo=bar&quux=baz';
        const result = body.stateFromSearch();
        expect(result).to.deep.equal({});
    });

    it('parses expected fields', () => {
        const body = new AppBody({});
        body.location.search = '?env=foobar&charts=1234&relativeTimes=0&refresh=1';
        const result = body.stateFromSearch();
        expect(result).to.deep.equal({
            env: 'foobar',
            charts: '1234',
            relativeTimes: false,
            refresh: true,
        });
    });
});


describe('AppBody.urlFromState', () => {
    it('serializes state as expected', () => {
        const body = new AppBody({});
        body.state = {
            env: 'foobar',
            relativeTimes: true,
            charts: 12345,
        };
        body.location = {
            pathname: '/pulpstatus',
            search: '',
        };
        const result = body.urlFromState();
        expect(result).to.equal('/pulpstatus?env=foobar&relativeTimes=1&refresh=0&charts=12345');
    });
});
