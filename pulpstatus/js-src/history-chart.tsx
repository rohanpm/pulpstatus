import * as React from 'react';
import * as ReactChart from 'react-chartjs';
import TimeAgo from 'react-timeago';
import * as Logger from 'js-logger';


interface HistoryChartProps {
    history?: HistoryMap;
    historyKey: string;
    since: 'full' | number;
    fillColor?: string;
};

type HistorySlice = Array<HistoryPoint>;


export default class extends React.Component<HistoryChartProps> {
    history(): HistorySlice {
        const history = this.props.history || {};
        const unfiltered = history[this.props.historyKey + '-count'] || [];
        var beginIndex = 0;
        if (this.props.since != 'full') {
            const now = new Date();
            const since = new Date(now.getTime() - this.props.since*1000);
            const sinceStr = since.toISOString();
            beginIndex = unfiltered.findIndex(
                (elem) => elem[0] >= sinceStr);
            Logger.debug('sinceStr', sinceStr, 'beginIndex', beginIndex);
        }

        if (beginIndex == -1) {
            return [];
        }

        return unfiltered.slice(beginIndex);
    }

    // https://github.com/chartjs/Chart.js/tree/v1.1.1/docs

    chartData(history: HistorySlice) {
        return {
            labels: history.map((elem) => elem[0]),
            datasets: [{
                data: history.map((elem) => elem[1]),
                fillColor: this.props.fillColor || "rgba(20,20,20,0.8)",
            }]
        };
    }

    chartOptions() {
        return {
            animation: false,
            showScale: false,
            scaleBeginAtZero: true,
            pointDot : false,
            datasetStroke: false,
            datasetFill : true,
            responsive: true,
            maintainAspectRatio: false,
            showTooltips: false,
        };
    }

    min(history: HistorySlice) {
        return Math.min.apply(null, history.map(x => x[1]));
    }

    mean(hist: HistorySlice) {
        var out = 0.0;
        hist.forEach(x => {
            out = out + x[1]/hist.length;
        });
        return Math.round(out);
    }

    max(history: HistorySlice) {
        return Math.max.apply(null, history.map(x => x[1]));
    }

    renderLabel(history: HistorySlice) {
        if (!history || history.length < 2) {
            return null;
        }
        var since = history[0][0];

        return <p className="chart-label">
            {this.props.historyKey}
            {" tasks from "}
            <TimeAgo date={since}/>
            <br />
            {"min: " + this.min(history)}
            {"   mean: " + this.mean(history)}
            {"   max: " + this.max(history)}
        </p>
    }

    render() {
        const history = this.history();
        const LineChart = ReactChart.Line;
        return <div>
            <LineChart
                // In practice it is much faster for this element
                // to be dropped/recreated on each render rather than
                // the usual React reconciliation, so use a deliberately
                // unstable key to achieve this.
                key={Math.random()}
                data={this.chartData(history)}
                options={this.chartOptions()}
                height={100}
            />
            {this.renderLabel(history)}
        </div>;
    }
}
