import { COVER_ADD, COVER_REMOVE } from 'actions/layout';

const initialState = {
    cover: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case COVER_ADD:
            return {
                ...state,
                cover: action.cover,
            };

        case COVER_REMOVE:
            return {
                ...state,
                cover: null,
            };
    }

    return state;
};

