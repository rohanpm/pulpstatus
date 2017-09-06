import React from 'react';
import Logger from 'js-logger';

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
                <label key={'env-' + env}>
                    <input type="radio" name="env" value={env}
                           onChange={(...x) => this.handleChange(...x)}
                           autoComplete="off"
                           checked={env === this.props.env}/>
                    {env}
                </label>
            );

            const thisPrefix = prefix(env);
            if (thisPrefix != lastPrefix) {
                out.push(<br key={'br-' + env} />);
                lastPrefix = thisPrefix;
            }

            out.push(elem);
            return out;
        }, []);
    }

    handleChange(event) {
        Logger.debug('radio change', event);
        if (!event.target.checked) {
            return;
        }
        Logger.debug('set env to', event.target.value);
        this.props.onEnvChange(event.target.value);
    }
}
