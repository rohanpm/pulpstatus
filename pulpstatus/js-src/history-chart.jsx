import React from 'react';
import * as ReactChart from 'react-chartjs';
import TimeAgo from 'react-timeago';


export default class extends React.Component {
    history() {
        return this.props.history[this.props.historyKey + '-count'] || [];
    }

    chartData() {
        return {
            labels: this.history().map((elem) => elem[0]),
            datasets: [{
                data: this.history().map((elem) => elem[1]),
                fillColor: this.props.fillColor || "rgba(20,20,20,0.8)",
            }]
        };
    }

    chartOptions() {
        return {
            showScale: false,
            pointDot : false,
            datasetStroke: false,
            datasetFill : true,
            responsive: true,
            maintainAspectRatio: false,
            showTooltips: false,
        };
    }

    min() {
        return Math.min.apply(null, this.history().map(x => x[1]));
    }

    mean() {
        const hist = this.history();
        var out = 0.0;
        hist.forEach(x => {
            out = out + x[1]/hist.length;
        });
        return Math.round(out);
    }

    max() {
        return Math.max.apply(null, this.history().map(x => x[1]));
    }

    renderLabel() {
        const history = this.history();
        if (!history || history.length < 2) {
            return null;
        }
        var since = history[0][0];

        // assume UTC if no timezone supplied
        if (since.indexOf('+') == -1) {
            since = since + ' +0000';
        }

        return <p className="chart-label">
            {this.props.historyKey}
            {" tasks from "}
            <TimeAgo date={since}/>
            <br />
            {"min: " + this.min()}
            {"   mean: " + this.mean()}
            {"   max: " + this.max()}
        </p>
    }

    render() {
        const LineChart = ReactChart.Line;
        return <div>
            <LineChart
                data={this.chartData()}
                options={this.chartOptions()}
                height={100}
            />
            {this.renderLabel()}
        </div>;
    }
}
