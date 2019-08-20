export const COVER_ADD = 'COVER_ADD';
export const COVER_REMOVE = 'COVER_REMOVE';

export const addCover = cover => {

    return ({
        type: COVER_ADD,
        cover,
    });
};

export const removeCover = {type: COVER_REMOVE};

