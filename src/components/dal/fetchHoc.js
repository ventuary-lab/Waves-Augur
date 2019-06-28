import React from 'react';
import _isObject from 'lodash-es/isObject';
import _isFunction from 'lodash-es/isFunction';

export default (requestFunc) => {
    return WrappedComponent => class HttpHOC extends React.Component {

        static WrappedComponent = WrappedComponent;

        constructor() {
            super(...arguments);

            this.state = {
                data: null,
            };

            this._isRendered = false;
            this._fetch = this._fetch.bind(this);
        }

        componentDidMount() {
            this._isRendered = true;
            this._fetch();
        }

        componentWillUnmount() {
            this._isRendered = false;
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    {...this.state.data}
                    fetch={this._fetch}
                />
            );
        }

        _fetch(params) {
            const result = requestFunc({
                ...this.props,
                ...params,
            });

            if (_isObject(result)) {
                if (_isFunction(result.then)) {
                    return result.then(data => {
                        if (this._isRendered) {
                            this.setState({data});
                        }
                        return data;
                    });
                } else {
                    this.setState({data: result});
                }
            }

            return result;
        }

    };
};
