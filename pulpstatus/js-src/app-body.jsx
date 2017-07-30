import React from 'react';
import $ from 'jquery';
import qs from 'qs';

import Controls from './controls.jsx';
import DevControls from './dev-controls.jsx';
import TaskTable from './task-table.jsx';
import Info from './info.jsx';
import UpdatedInfo from './updated-info.jsx';

const URL_STATE_KEYS = [
    'env',
    'relativeTimes',
    'refresh',
    'dev',
];

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
            latestHistory: '2000-01-01 00:00:00',
        };
        Object.assign(this.state, this.stateFromSearch());
    }

    render() {
        console.log("body render with tasks", this.state.tasks);
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
                          loading={this.isLoading()}
                          relativeTimes={this.state.relativeTimes}
                          refresh={this.state.refresh}
                />
                {this.state.dev && <DevControls
                    onCannedData={(...args) => this.fetchCannedData()}/>}
                <UpdatedInfo
                    lastUpdated={this.state.lastUpdated}
                    loading={this.isLoading()}
                    relativeTimes={this.state.relativeTimes}/>
                <Info tasks={this.state.tasks}
                      lastUpdated={this.state.lastUpdated}
                      loading={this.isLoading()}
                      relativeTimes={this.state.relativeTimes}/>
                <TaskTable tasks={this.state.tasks}
                           relativeTimes={this.state.relativeTimes}/>
            </div>
        );
    }

    handleRelativeTimesChange(event) {
        console.log('relative times changed', event.target.checked);
        this.setState({relativeTimes: event.target.checked});
    }

    handleRefreshChange(event) {
        console.log('refresh changed', event.target.checked);
        this.setState({refresh: event.target.checked});
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
            console.log('should set state', event);
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
        console.log('component did update', this.state);
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

        const xhr = $.getJSON(url, {'history-since': this.state.latestHistory});
        const env = this.env();
        xhr.then((...x) => this.onNewData(env, ...x));
        this.setState({
            fetching: xhr,
            fetchingEnv: env,
        });
    }

    fetchCannedData() {
        // for development purposes, can use some static data
        return this.fetchData('static/data/tasks-2016-10-26T19:52+1000.json');
    }

    onNewData(env, data, textStatus, jqXHR) {
        const newState = {
            fetching: null,
            fetchingEnv: null,
        };

        console.log('Got data!', env, textStatus);

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
        Object.assign(newState, {
            latestHistory: getMax(history['times'])
        });
    }

    env() {
        return this.state.env;
    }

    dataUrl() {
        return 'data/' + this.env() + '/latest';
    }

    handleEnvChange(newEnv) {
        this.setState({env: newEnv});
    }


    urlFromState() {
        const search = qs.stringify({
            env: this.state.env,
            relativeTimes: this.state.relativeTimes ? 1 : 0,
            refresh: this.state.refresh ? 1 : 0,
            // note: dev deliberately omitted from URL
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
            ['relativeTimes', 'refresh', 'dev'].forEach((key) => {
                if (key in parsed) {
                    out[key] = parsed[key] == '1';
                }
            });
            console.log('parsed from search', out);
        }
        return out;
    }
};
