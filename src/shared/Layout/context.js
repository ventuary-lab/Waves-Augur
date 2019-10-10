

import { createContext } from 'react';

export const initialContextState = {
    approveModal: {
        triggerModal: () => {}
    },
    noKeeperModal: {
        triggerModal: () => {}
    }
};

export default createContext(initialContextState);