

import { createContext } from 'react';

export const initialContextState = {
    approveModal: {
        triggerModal: () => {}
    },
    noKeeperModal: {
        triggerModal: () => {}
    }
};

export const ReduxModalContext = createContext({
    openLoginModal: () => {}
});

export default createContext(initialContextState);