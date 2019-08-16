import React from 'react';
import _isEqual from 'lodash-es/isEqual';

import {apiAddConfigs, apiRemoveConfigs, getConfigId} from '../../actions/api';
import {connect} from 'react-redux';

const stateMap = state => ({
    apiData: state.api && state.api.data || null,
});

export default configsFunc => WrappedComponent => @connect(stateMap)
class ApiHOC extends React.Component {

    static WrappedComponent = WrappedComponent;

    componentDidMount() {
        this.props.dispatch(apiAddConfigs(configsFunc(this.props)));
    }

    componentWillUnmount() {
        this.props.dispatch(apiRemoveConfigs(configsFunc(this.props)));
    }

    componentWillReceiveProps(nextProps) {
        const prevConfigs = [].concat(configsFunc(this.props));
        const nextConfigs = [].concat(configsFunc(nextProps));
        for (let i = 0; i < Math.max(prevConfigs.length, nextConfigs.length); i++) {
            if (!_isEqual(prevConfigs[i], nextConfigs[i])) {
                this.props.dispatch([
                    apiRemoveConfigs(prevConfigs[i]),
                    apiAddConfigs(nextConfigs[i]),
                ]);
            }
        }
    }

    render() {
        const data = {};
        if (this.props.apiData) {
            [].concat(configsFunc(this.props)).forEach(config => {
                data[config.key] = this.props.apiData[getConfigId(config)];
            });
        }

        return (
            <WrappedComponent
                {...this.props}
                {...data}
                fetch={this._fetch}
            />
        );
    }

};
