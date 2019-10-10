import {
    LOG_IN_USER,
    LOG_OUT_USER,
    TRIGGER_AUTH_CHECKER
} from 'actions/global';

const initialState = {
    isLoggedIn: false,
    authCheckerEnabled: true
};

export default (state = initialState, action) => {
    switch (action.type) {
        case TRIGGER_AUTH_CHECKER:
            return {
                ...state,
                authCheckerEnabled: action.state
            }
        case LOG_IN_USER:
            return {
                ...state,
                authCheckerEnabled: true,
                isLoggedIn: true
            };
        case LOG_OUT_USER:
            return {
                ...state,
                authCheckerEnabled: false,
                isLoggedIn: false
            };
    }

    return state;
};