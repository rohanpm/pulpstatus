import React from 'react';
import * as ReactChart from 'react-chartjs';
import TimeAgo from 'react-timeago';
import Logger from 'js-logger';


export default class extends React.Component {
    history() {
        const unfiltered = this.props.history[this.props.historyKey + '-count'] || [];
        var beginIndex = 0;
        if (this.props.since != 'full') {
            const now = new Date();
            const since = new Date(now.getTime() - this.props.since*1000);
            const sinceStr = since.toISOString();
            beginIndex = unfiltered.findIndex((timestamp, value) => timestamp >= sinceStr);
            Logger.debug('sinceStr', sinceStr, 'beginIndex', beginIndex);
        }

        if (beginIndex == -1) {
            return [];
        }

        return unfiltered.slice(beginIndex);
    }

    // https://github.com/chartjs/Chart.js/tree/v1.1.1/docs

    chartData(history) {
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

    min(history) {
        return Math.min.apply(null, history.map(x => x[1]));
    }

    mean(hist) {
        var out = 0.0;
        hist.forEach(x => {
            out = out + x[1]/hist.length;
        });
        return Math.round(out);
    }

    max(history) {
        return Math.max.apply(null, history.map(x => x[1]));
    }

    renderLabel(history) {
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
                data={this.chartData(history)}
                options={this.chartOptions()}
                height={100}
            />
            {this.renderLabel(history)}
        </div>;
    }
}
