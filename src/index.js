import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {store} from 'components';

import './style/index.scss';

class Wrapper extends React.Component {
    constructor() {
        this.state = {
            varsInitialized: false
        };
    }

    componentDidMount () {
        (async () => {
            const response = await axios.get('/get-dapp-info');
            const { APP_DAPP_NETWORK, DAPP } = response.data;
            window.APP_DAPP_NETWORK = APP_DAPP_NETWORK;
            window.DAPP = DAPP;
            this.setState({ varsInitialized: true });
        })();
    }

    render() {
        const { varsInitialized } = this.state;
        return varsInitialized ? this.children : null;
    }
}

(init => {
    if (window.Raven && process.env.NODE_ENV === 'production') {
        window.Raven.config('https://cbf87ee15794479abde8a2ad545714cf@sentry.kozhindev.com/21').install();
        window.Raven.context(init);
    } else {
        init();
    }
})(() => {
    const Application = require('./Application').default;
    ReactDOM.render(
        <Wrapper>
            <Provider store={store.store}>
                <Application/>
            </Provider>
        </Wrapper>,
        document.getElementById('root'),
    );
});
