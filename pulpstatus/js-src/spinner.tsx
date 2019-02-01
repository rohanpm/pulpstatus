import * as React from 'react';

//const SPINNER_CHARS = '▁▂▃▄▅▆▇█▇▆▅▄▃▁'.split('');
const SPINNER_CHARS = '▉▊▋▌▍▎▏▎▍▌▋▊▉'.split('');

interface SpinnerState {
    index: number
}


export default class extends React.Component<{}, SpinnerState> {
    timer: number;

    constructor(props = {}) {
        super(props);
        this.state = {index: 0};
    }

    render() {
        return <span className="spinner">
            {SPINNER_CHARS[this.state.index]}
        </span>;
    }

    componentDidMount() {
        this.timer = setInterval(
            () => this.tick(),
            100,
        );
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    tick() {
        this.setState({index: (this.state.index + 1) % SPINNER_CHARS.length});
    }
}