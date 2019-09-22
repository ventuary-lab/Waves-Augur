import {
    LOG_IN_USER,
    LOG_OUT_USER
} from 'actions/global';

const initialState = {
    isLoggedIn: true,
    authCheckerEnabled: true
};

export default (state = initialState, action) => {
    switch (action.type) {
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