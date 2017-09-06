import React from 'react';
import $ from 'jquery';
import qs from 'qs';
import Logger from 'js-logger';
import {Responsive, WidthProvider} from 'react-grid-layout';
const ResponsiveReactGridLayout = WidthProvider(Responsive);


import Controls from './controls.jsx';
import TaskTable from './task-table.jsx';
import Info from './info.jsx';
import UpdatedInfo from './updated-info.jsx';
import HistoryChart from './history-chart.jsx';


const URL_STATE_KEYS = [
    'env',
    'relativeTimes',
    'refresh',
];

const INITIAL_HISTORY = '2000-01-01T00:00:00Z';

function getMax(values) {
    var max = null;
    values.forEach((value) => {
        if (max === null || value > max) {
            max = value;
        }
    });
    return max;
}

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            availableEnvs: null,
            env: null, fetchingEnv: null, fetchedEnv: null,
            relativeTimes: true, refresh: true,
            charts: false,
            history: {},
            historyTimestamp: INITIAL_HISTORY,
        };
        Object.assign(this.state, this.stateFromSearch());
    }

    render() {
        Logger.debug("body render with tasks", this.state.tasks);
        if (!this.state.availableEnvs) {
            return <div className={this.globalClassName()}>
                Loading available environments...
            </div>;
        }
        return (
            <div className={this.globalClassName()}>
                <Controls env={this.env()}
                          availableEnvs={this.state.availableEnvs}
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
                    relativeTimes={this.state.relativeTimes}/>
                <Info tasks={this.state.tasks}
                      lastUpdated={this.state.lastUpdated}
                      loading={this.isLoading()}
                      relativeTimes={this.state.relativeTimes}/>
                {this.renderGrid()}
            </div>
        );
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
            lg: layout, s: layout, xs: layout
        };
        return (
            <ResponsiveReactGridLayout className="layout" layouts={layouts}
                breakpoints={{lg: 800, s: 400, xs: 0}}
                cols={{lg: 3, s: 2, xs: 1}}
                rowHeight={180}
            >
                <div key="table" className="table">
                    {taskTable}
                </div>
                <div key="hist1" className="history">
                    <HistoryChart historyKey="waiting" history={this.state.history}
                        fillColor="rgba(20,20,200,0.8)"
                        />
                </div>
                <div key="hist2" className="history">
                    <HistoryChart historyKey="running" history={this.state.history}
                        fillColor="rgba(200,20,20,0.8)"
                        />
                </div>
            </ResponsiveReactGridLayout>
        );
    }

    handleRelativeTimesChange(event) {
        Logger.debug('relative times changed', event.target.checked);
        this.setState({relativeTimes: event.target.checked});
    }

    handleRefreshChange(event) {
        Logger.debug('refresh changed', event.target.checked);
        this.setState({refresh: event.target.checked});
    }

    handleChartsChange(event) {
        Logger.debug('charts changed', event.target.checked);
        this.setState({charts: event.target.checked});
    }

    isLoading() {
        return !!this.state.fetching;
    }

    globalClassName() {
        const out = [];
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
            this.timer = null;
        }
    }

    componentDidMount() {
        window.onpopstate = (event) => {
            Logger.debug('should set state', event);
            this.setState(event.state);
        };

        const xhr = $.getJSON('env');
        xhr.then((...x) => this.onEnvsFetched(...x));
    }

    componentWillUnmount() {
        this.stopTimer();
        window.onpopstate = null;
    }

    onEnvsFetched(envs) {
        this.setState({
            availableEnvs: envs,
            env: envs[0],
        });
        this.startTimer();
        this.fetchData();
    }

    componentDidUpdate() {
        Logger.debug('component did update', this.state);
        if (this.state.env != this.state.fetchedEnv && this.state.env != this.state.fetchingEnv) {
            this.fetchData();
        }

        const currentUrl = [location.pathname, location.search].join('');
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
        return URL_STATE_KEYS.reduce((out, key) => {
            out[key] = this.state[key];
            return out;
        }, {});
    }

    fetchData(url) {
        if (this.state.fetching) {
            this.state.fetching.abort();
        }

        if (!url) {
            url = this.dataUrl();
        }

        const xhr = $.getJSON(url, {'history-since': this.state.historyTimestamp});
        const env = this.env();
        xhr.then((...x) => this.onNewData(env, ...x));
        this.setState({
            fetching: xhr,
            fetchingEnv: env,
        });
    }

    onNewData(env, data, textStatus, jqXHR) {
        const newState = {
            fetching: null,
            fetchingEnv: null,
        };

        Logger.debug('Got data!', env, textStatus);

        if (env === this.state.env) {
            Object.assign(newState, {
                fetchedEnv: env,
                lastUpdated: jqXHR.getResponseHeader('Date'),
            });
            this.onNewPulpData(newState, data['pulp']);
            this.onNewHistory(newState, data['history']);
        }

        this.setState(newState);
    }

    onNewPulpData(newState, pulp_data) {
        Object.assign(newState, {
            tasks: pulp_data,
        });
    }

    onNewHistory(newState, history) {
        // History object is like this:
        /*
            {'metric1': [
                [<timestamp>, <value>],
                ...
            ]}
        */

        const aggregate = this.state.history || {};
        history.data.forEach((h) => {
            const value = h.value;
            const key = history.keys[h.key];
            const time = history.times[h.time];

            if (!aggregate[key]) {
                aggregate[key] = [];
            }
            aggregate[key].push([time, value]);
        });

        history.keys.forEach((key) => {
            aggregate[key].sort((a, b) => {
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

        Object.assign(newState, {
            history: aggregate,
            historyTimestamp: getMax(history['times'])
        });
    }

    env() {
        return this.state.env;
    }

    dataUrl() {
        return 'data/' + this.env() + '/latest';
    }

    handleEnvChange(newEnv) {
        this.setState({env: newEnv, history: {}, historyTimestamp: INITIAL_HISTORY});
    }


    urlFromState() {
        const search = qs.stringify({
            env: this.state.env,
            relativeTimes: this.state.relativeTimes ? 1 : 0,
            refresh: this.state.refresh ? 1 : 0,
            charts: this.state.charts ? 1 : 0,
        });
        return [
            location.pathname,
            '?',
            search
        ].join('');
    }

    stateFromSearch() {
        const out = {};
        if (location.search) {
            const parsed = qs.parse(location.search.substr(1));
            if ('env' in parsed) {
                out.env = parsed.env;
            }
            ['relativeTimes', 'refresh', 'charts'].forEach((key) => {
                if (key in parsed) {
                    out[key] = parsed[key] == '1';
                }
            });
            Logger.debug('parsed from search', out);
        }
        return out;
    }
};
