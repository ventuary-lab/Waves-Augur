import {
    LOG_IN_USER,
    LOG_OUT_USER
} from 'actions/global';

const initialState = {
    isLoggedIn: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOG_IN_USER:
            return {
                ...state,
                isLoggedIn: true
            };
        case LOG_OUT_USER:
            return {
                ...state,
                isLoggedIn: false
            };
    }

    return state;
};