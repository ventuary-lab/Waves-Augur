import { UPDATE_GLOBAL_VARS } from 'actions/global_vars';

const initialState = {
    DAPP: null,
    APP_DAPP_NETWORK: null,
    NODE_URL: null,
    APP_ADMIN_ADDRESS: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_GLOBAL_VARS:

            return {
                ...state,
                ...action.data
            };
    };

    return state;
};