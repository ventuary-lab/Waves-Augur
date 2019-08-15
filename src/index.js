import React from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {store} from 'components';

import './style/index.scss';

const AppEntry = () => {
    const [initFinished, setInitFinished] = React.useState(false);
    const [mainApp, setMainApp] = React.useState(null);

    React.useEffect(
        () => {
            (async () => {
                const response = await axios.get('/get-dapp-info');
        
                const { APP_DAPP_NETWORK, DAPP } = response.data;

                window.APP_DAPP_NETWORK = APP_DAPP_NETWORK;
                window.DAPP = DAPP;

                setInitFinished(true);
                const Application = require('./Application').default;
                setMainApp(Application);
            })();
        },
        []
    );

    return initFinished && mainApp ? (
        <Provider store={store.store}>
            {mainApp}
        </Provider>
    ) : null;
}

(init => {
    if (window.Raven && process.env.NODE_ENV === 'production') {
        window.Raven.config('https://cbf87ee15794479abde8a2ad545714cf@sentry.kozhindev.com/21').install();
        window.Raven.context(init);
    } else {
        init();
    }
})(() => {
    ReactDOM.render(
        <AppEntry />,
        document.getElementById('root'),
    );
});
