import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {store} from 'components';

import './style/index.scss';

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
        <Provider store={store.store}>
            <Application/>
        </Provider>,
        document.getElementById('root'),
    );
});
