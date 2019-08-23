import axios from 'axios';

export const UPDATE_GLOBAL_VARS = 'updateGlobalVars';

export const getVariables = async () => {
    const response = await axios.get('/get-dapp-info');
    const { DAPP, APP_DAPP_NETWORK, NODE_URL, APP_ADMIN_ADDRESS } = response.data;

    return {
        DAPP, APP_DAPP_NETWORK, NODE_URL, APP_ADMIN_ADDRESS
    };
};

export const loadVariables = (onLoad) => async (dispatch) => {
    const variables = await getVariables();

    dispatch({
        type: UPDATE_GLOBAL_VARS,
        data: variables
    });

    onLoad();
};