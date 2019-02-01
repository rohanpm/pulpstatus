import * as React from 'react';
import * as Logger from 'js-logger';

export interface EnvControlProps {
    env: string;
    availableEnvs: Array<string>;
    onEnvChange?: (env: string) => any;
}

export class EnvControl extends React.Component<EnvControlProps> {
    render() {
        return <form>
            {this.renderEnvInputs()}
        </form>;
    }

    renderEnvInputs(): Array<JSX.Element> {
        const prefix = (str: string) => (str.split('-')[0]);
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
        }, [] as Array<JSX.Element>);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        Logger.debug('radio change', event);
        if (!event.target.checked) {
            return;
        }
        Logger.debug('set env to', event.target.value);
        if (this.props.onEnvChange) {
            this.props.onEnvChange(event.target.value);
        }
    }
}
