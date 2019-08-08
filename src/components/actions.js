
export const INITIALIZE_AT_CLIENT = 'initializeAtClient';
export const CLIENT_LOCAL_STORAGE_KEY = 'ALPHA_VENTUARY_DAO_USER';

const actions = {
    [INITIALIZE_AT_CLIENT]: async function (keeper) {

        try {
            if (localStorage.getItem(CLIENT_LOCAL_STORAGE_KEY)) {
                const state = await keeper.publicState();
                return state.userData;
            }
            
        } catch (e) {
            throw e;
        }
    }
};

export default actions;