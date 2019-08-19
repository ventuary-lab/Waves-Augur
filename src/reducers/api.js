import {API_ADD_CONFIGS, API_REMOVE_CONFIGS, API_SET_DATA, getConfigId} from 'actions/api';

const initialState = {
    configs: [],
    data: {},
    counters: {},
};

export default (state = initialState, action) => {
    switch (action.type) {
        case API_ADD_CONFIGS:
            const configs = [].concat(state.configs);
            const counters = {...state.counters};
            action.configs.forEach(config => {
                const id = getConfigId(config);
                if (counters[id]) {
                    counters[id]++;
                } else {
                    counters[id] = 1;
                    configs.push(config);
                }
            });

            return {
                ...state,
                configs,
                counters,
            };

        case API_REMOVE_CONFIGS:
            let configs2 = [].concat(state.configs);
            const counters2 = {...state.counters};
            action.configs.forEach(config => {
                const id = getConfigId(config);
                if (counters2[id]) {
                    counters2[id]--;

                    if (counters2[id] <= 0) {
                        configs2 = configs2.filter(item => getConfigId(item) !== id);
                    }
                }
            });
            return {
                ...state,
                configs: configs2,
                counters: counters2,
            };

        case API_SET_DATA:
            return {
                ...state,
                data: {
                    ...state.data,
                    [getConfigId(action.config)]: action.data,
                },
            };
    }

    return state;
};
