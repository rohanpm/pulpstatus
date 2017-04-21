import React from 'react';

export default class extends React.Component {
    render() {
        return <form>
            {this.renderEnvInputs()}
        </form>;
    }

    renderEnvInputs() {
        const prefix = (str) => (str.split('-')[0]);
        var lastPrefix = prefix(this.props.availableEnvs[0]);

        return this.props.availableEnvs.reduce((out, env) => {
            const elem = (
                <label key={env}>
                    <input type="radio" name="env" value={env}
                           onChange={(...x) => this.handleChange(...x)}
                           autoComplete="off"
                           checked={env === this.props.env}/>
                    {env}
                </label>
            );

            const thisPrefix = prefix(env);
            if (thisPrefix != lastPrefix) {
                out.push(<br />);
                lastPrefix = thisPrefix;
            }

            out.push(elem);
            return out;
        }, []);
    }

    handleChange(event) {
        console.log('radio change', event);
        if (!event.target.checked) {
            return;
        }
        console.log('set env to', event.target.value);
        this.props.onEnvChange(event.target.value);
    }
}
