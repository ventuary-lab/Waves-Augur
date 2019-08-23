import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { store } from 'components';
import { loadVariables } from 'actions/global_vars';
import './style/index.scss';

const AppEntry = () => {
    const [isReady, setIsReady] = React.useState(false);
    const [app, setApp] = React.useState(null);

    React.useEffect(
        () => {
            store.dispatch(loadVariables(() => {
                setIsReady(true);
                const Application = require('./Application').default;

                setApp(<Application />);
            }));
        },
        []
    );

    return app && isReady ? (
        app
    ) : null;
};

(init => {
    if (window.Raven && process.env.NODE_ENV === 'production') {
        window.Raven.config('https://cbf87ee15794479abde8a2ad545714cf@sentry.kozhindev.com/21').install();
        window.Raven.context(init);
    } else {
        init();
    }
})(() => {
    ReactDOM.render(
        <Provider store={store.store}>
            <AppEntry />
        </Provider>,
        document.getElementById('root'),
    );
});
