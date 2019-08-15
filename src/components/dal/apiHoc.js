import React from 'react';
import _isEqual from 'lodash-es/isEqual';
import _isArray from 'lodash-es/isArray';

import {http} from 'components';

export default (methodsFunc) => {
    return WrappedComponent => class ApiHOC extends React.Component {

        static WrappedComponent = WrappedComponent;

        constructor() {
            super(...arguments);

            this.state = {
                isLoading: false,
            };

            this._isRendered = false;
            this._fetch = this._fetch.bind(this);
        }

        componentDidMount() {
            this._isRendered = true;
            this._fetch(methodsFunc(this.props));
        }

        componentWillUnmount() {
            this._isRendered = false;
        }

        componentWillReceiveProps(nextProps) {
            const prevConfigs = methodsFunc(this.props);
            const nextConfigs = methodsFunc(nextProps);
            if (!_isEqual(prevConfigs, nextConfigs)) {
                this._fetch(nextConfigs);
            }
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    {...this.state}
                    fetch={this._fetch}
                />
            );
        }

        _fetch(configs) {
            this.setState({isLoading: true});

            if (!_isArray(configs)) {
                configs = [configs];
            }
            configs.forEach(config => {
                if (!config.key || !config.url) {
                    throw new Error('key and url is required');
                }

                http.send(config.method || 'get',  config.url, config.params || {})
                    .then(result => {
                        if (this._isRendered) {
                            this.setState({
                                isLoading: false,
                                [config.key]: result.data,
                            });
                        }
                    });
            });
        }

    };
};
