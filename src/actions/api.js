import _isArray from 'lodash-es/isArray';
import _trim from 'lodash-es/trim';
import {http} from 'components';

export const API_ADD_CONFIGS = 'API_ADD_CONFIGS';
export const API_REMOVE_CONFIGS = 'API_REMOVE_CONFIGS';
export const API_SET_DATA = 'API_SET_DATA';

const normalizeConfigs = configs => {
    if (!_isArray(configs)) {
        configs = [configs];
    }

    configs.forEach((config, index) => {
        if (!config.key || !config.url) {
            throw new Error('key and url is required');
        }

        configs[index] = {
            method: 'get',
            params: {},
            ...config,
        };
    });

    return configs;
};

const fetch = config => http.send(config.method, config.url, config.params).then(result => result.data);

export const getConfigId = config => config.id || _trim(config.url, '/');

export const apiAddConfigs = configs => dispatch => {
    configs = normalizeConfigs(configs);

    dispatch({
        type: API_ADD_CONFIGS,
        configs,
    });

    configs.forEach(config => {
        fetch(config)
            .then(data => dispatch({
                type: API_SET_DATA,
                config,
                data,
            }));
    });
};

export const apiRemoveConfigs = configs => {
    configs = normalizeConfigs(configs);

    return {
        type: API_REMOVE_CONFIGS,
        configs,
    };
};

export const apiWsHandler = event => (dispatch, getState) => {
    if (event.stream === 'collections') {
        const configs = getState().api.configs;
        configs.forEach(config => {
            if (config.collection === event.data.collection) {
                fetch(config)
                    .then(data => dispatch({
                        type: API_SET_DATA,
                        config,
                        data,
                    }));
            }
        });
    }
};