import * as React from 'react';
import * as $ from 'jquery';
import * as qs from 'qs';
import * as Logger from 'js-logger';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);


import Controls from './controls';
import TaskTable from './task-table';
import Info from './info';
import Error from './error';
import UpdatedInfo from './updated-info';
import HistoryChart from './history-chart';


interface AppBodyState {
    tasks?: Array<Task>;
    availableEnvs?: Array<string>;
    env?: string | null;
    fetchingEnv?: string | null;
    fetchedEnv?: string | null;
    fetchError?: any;
    relativeTimes?: boolean;
    refresh?: boolean;
    charts?: "full" | "" | number;
    history?: HistoryMap;
    historyTimestamp?: string;
    lastUpdated?: string;
    fetching?: any;
};

interface UrlState {
    env?: string;
    relativeTimes?: string;
    refresh?: string;
};

interface LocationLite {
    pathname: string;
    search: string;
};


const INITIAL_HISTORY = '2000-01-01T00:00:00Z';

export function getMax<T>(values?: Array<T>) {
    if (!values || values.length==0) {
        return null;
    }
    var max = values[0];
    for (const value of values) {
        if (value > max) {
            max = value;
        }
    }
    return max;
}

export class AppBody extends React.Component<{}, AppBodyState> {
    timer?: number;
    location: LocationLite;

    constructor(props: {}) {
        super(props);

        this.location = typeof(location) == 'undefined'
            ? {pathname: '', search: ''}
            : location;

        this.state = {
            availableEnvs: [],
            env: null, fetchingEnv: null, fetchedEnv: null,
            fetchError: null,
            relativeTimes: true, refresh: true,
            charts: '',
            history: {},
            historyTimestamp: INITIAL_HISTORY,
        };
        Object.assign(this.state, this.stateFromSearch());
    }

    render() {
        Logger.debug("body render with tasks", this.state.tasks);
        if ((this.state.availableEnvs || []).length === 0) {
            return <div className={this.globalClassName()}>
                Loading available environments...
            </div>;
        }
        return (
            <div className={this.globalClassName()}>
                <Controls env={this.env()}
                          availableEnvs={this.state.availableEnvs || []}
                          onEnvChange={(...args) => this.handleEnvChange(...args)}
                          onRefreshNow={(...args) => this.fetchData()}
                          onRelativeTimesChange={(...args) => this.handleRelativeTimesChange(...args)}
                          onRefreshChange={(...args) => this.handleRefreshChange(...args)}
                          onChartsChange={(...args) => this.handleChartsChange(...args)}
                          loading={this.isLoading()}
                          relativeTimes={this.state.relativeTimes}
                          refresh={this.state.refresh}
                          charts={this.state.charts}
                />
                <UpdatedInfo
                    lastUpdated={this.state.lastUpdated}
                    loading={this.isLoading()}
                    relativeTimes={this.state.relativeTimes} />
                <Info tasks={this.state.tasks} />
                {this.renderError()}
                {this.renderGrid()}
            </div>
        );
    }

    renderError() {
        if (this.state.fetchError) {
            return <Error error={this.state.fetchError}/>;
        }
    }

    renderGrid() {
        const taskTable = <TaskTable
            tasks={this.state.tasks}
            relativeTimes={this.state.relativeTimes} />;

        if (!this.state.charts) {
            // charts feature disabled, no grid required
            return taskTable;
        }

        const layout = [
            {i: 'table', x: 0, y: 0, w: 2, h: 5, static: true},
            {i: 'hist1', x: 2, y: 1, w: 1, h: 1, isResizable: false},
            {i: 'hist2', x: 2, y: 2, w: 1, h: 1, isResizable: false},
        ];
        const layouts = {
            lg: layout, md: layout, sm: layout, xs: layout, xxs: layout
        };
        return (
            <ResponsiveReactGridLayout className="layout" layouts={layouts}
                breakpoints={{lg: 800, md: 800, sm: 400, xs: 0, xxs: 0}}
                cols={{lg: 3, md: 3, sm: 2, xs: 1, xxs: 1}}
                rowHeight={180}
            >
                <div key="table" className="table">
                    {taskTable}
                </div>
                <div key="hist1" className="history">
                    <HistoryChart historyKey="waiting" since={this.state.charts} history={this.state.history}
                        fillColor="rgba(20,20,200,0.8)"
                        />
                </div>
                <div key="hist2" className="history">
                    <HistoryChart historyKey="running" since={this.state.charts} history={this.state.history}
                        fillColor="rgba(200,20,20,0.8)"
                        />
                </div>
            </ResponsiveReactGridLayout>
        );
    }

    handleRelativeTimesChange(event: React.ChangeEvent<HTMLInputElement>) {
        Logger.debug('relative times changed', event.target.checked);
        this.setState({relativeTimes: event.target.checked});
    }

    handleRefreshChange(event: React.ChangeEvent<HTMLInputElement>) {
        Logger.debug('refresh changed', event.target.checked);
        this.setState({refresh: event.target.checked});
    }

    handleChartsChange(event: React.ChangeEvent<HTMLSelectElement>) {
        Logger.debug('charts changed', event.target.value);
        this.setState({charts: event.target.value as ("" | "full" | number)});
    }

    isLoading() {
        return !!this.state.fetching;
    }

    globalClassName() {
        const out: Array<string> = [];
        if (this.isLoading()) {
            out.push('loading');
        }
        if (this.state.env !== this.state.fetchedEnv) {
            out.push('env-mismatch');
        }
        return out.join(' ');
    }

    startTimer() {
        this.stopTimer();
        this.timer = setInterval(
            () => this.fetchData(),
            1000 * 120
        );
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    componentDidMount() {
        window.onpopstate = (event) => {
            Logger.debug('should set state', event);
            this.setState(event.state);
        };

        const xhr = $.getJSON('env');
        xhr.then((envs) => this.onEnvsFetched(envs));
    }

    componentWillUnmount() {
        this.stopTimer();
        window.onpopstate = null;
    }

    onEnvsFetched(envs: Array<string>) {
        const selectedEnv =
            (this.state.env && envs.indexOf(this.state.env) != -1)
            ? this.state.env
            : envs[0];

        this.setState({
            availableEnvs: envs,
            env: selectedEnv,
        });
        this.startTimer();
        this.fetchData();
    }

    componentDidUpdate() {
        Logger.debug('component did update', this.state);
        if (this.state.env != this.state.fetchedEnv && this.state.env != this.state.fetchingEnv) {
            this.fetchData();
        }

        const currentUrl = [this.location.pathname, this.location.search].join('');
        const newUrl = this.urlFromState();
        if (currentUrl !== newUrl) {
            history.pushState(this.urlState(), '', newUrl);
        }

        if (this.state.refresh && !this.timer) {
            this.startTimer();
        } else if (!this.state.refresh && this.timer) {
            this.stopTimer();
        }
    }

    urlState() {
        return {
            env: this.state.env,
            relativeTimes: this.state.relativeTimes,
            refresh: this.state.refresh,
        };
    }

    fetchData(url: string | undefined = undefined) {
        if (this.state.fetching) {
            this.state.fetching.abort();
        }

        if (!url) {
            url = this.dataUrl();
        }

        const xhr = $.getJSON(url, {'history-since': this.state.historyTimestamp});
        const env = this.env();
        xhr
            .then((...x) => this.onNewData(env, ...x))
            .catch((...x) => this.onFetchError(env, ...x));

        this.setState({
            fetching: xhr,
            fetchingEnv: env,
        });
    }

    onNewData(env: string, data: ApiResponse, textStatus: string,
              jqXHR: JQueryXHR, ...rest: any[]) {
        const newState: AppBodyState = {
            fetching: null,
            fetchingEnv: null,
            fetchError: null,
        };

        Logger.debug('Got data!', env, textStatus);

        if (env === this.state.env) {
            Object.assign(newState, {
                fetchedEnv: env,
                lastUpdated: jqXHR.getResponseHeader('Date'),
            });
            this.onNewPulpData(newState, data.pulp);
            this.onNewHistory(newState, data['history']);
        }

        this.setState(newState);
    }

    onFetchError(env: string, jqXHR: JQueryXHR, textStatus: string,
                 error: Error|string, ...rest: any[]) {
        if (env != this.env()) {
            Logger.debug('fetch error for', env, 'but no longer interested');
            return;
        }
        if (error === 'abort') {
            Logger.debug('Request aborted', jqXHR);
            return;
        }

        Logger.warn('Error fetching data', jqXHR, textStatus, error);
        this.setState({
            fetching: null,
            fetchingEnv: null,
            fetchError: error,
        });

        // We've failed to fetch this env.
        // There's two possibilities:
        // 1 - We have fetched it successfully in the past.
        // Then we'll keep displaying that data.
        //
        // 2 - We've never fetched it before.  Then let's initialize with
        // empty data so we're not still showing data from some other env.
        if (this.state.fetchedEnv != env) {
            const newState = {
                fetchedEnv: env,
                lastUpdated: jqXHR.getResponseHeader('Date') || '',
            };
            this.onNewPulpData(newState, []);
            this.onNewHistory(newState, {keys: [], times: [], data: []});
            this.setState(newState);
        }
    }

    onNewPulpData(newState: AppBodyState, pulp_data: Array<Task>) {
        Object.assign(newState, {
            tasks: pulp_data,
        });
    }

    aggregateWith(aggregate: HistoryMap, history: RawHistory) {
        (history.data || []).forEach((h) => {
            const value = h.value;
            const key = history.keys[h.key];
            const time = history.times[h.time];

            if (!aggregate[key]) {
                aggregate[key] = [];
            }
            aggregate[key].push([time, value]);
        });

        (history.keys || []).forEach((key) => {
            (aggregate[key] || []).sort((a, b) => {
                const timeA = a[0];
                const timeB = b[0];
                if (timeA > timeB) {
                    return 1;
                }
                if (timeA < timeB) {
                    return -1;
                }
                return 0;
            });
        });

        return aggregate;
    }

    onNewHistory(newState: AppBodyState, history: RawHistory) {
        // History object is like this:
        /*
            {'metric1': [
                [<timestamp>, <value>],
                ...
            ]}
        */

        const aggregate = this.aggregateWith(this.state.history || {}, history);

        Object.assign(newState, {
            history: aggregate,
            historyTimestamp: getMax(history.times) || INITIAL_HISTORY,
        });
    }

    env(): string {
        if (!this.state.env) {
            return '';
        }
        return this.state.env;
    }

    dataUrl() {
        return 'data/' + this.env() + '/latest';
    }

    handleEnvChange(newEnv: string) {
        this.setState({env: newEnv, fetchError: null, history: {}, historyTimestamp: INITIAL_HISTORY});
    }

    urlFromState() {
        const search = qs.stringify({
            env: this.state.env,
            relativeTimes: this.state.relativeTimes ? 1 : 0,
            refresh: this.state.refresh ? 1 : 0,
            charts: this.state.charts,
        });
        return [
            this.location.pathname,
            '?',
            search
        ].join('');
    }

    stateFromSearch(): AppBodyState {
        const out: AppBodyState = {};

        const parsed = qs.parse(this.location.search.substr(1));
        if ('env' in parsed) {
            out.env = parsed.env;
        }
        if ('charts' in parsed) {
            out.charts = parsed.charts;
        }
        ['relativeTimes', 'refresh'].forEach((key) => {
            if (key in parsed) {
                (out as ObjectMap<boolean>)[key] = parsed[key] == '1';
            }
        });
        Logger.debug('parsed from search', out);

        return out;
    }
};
